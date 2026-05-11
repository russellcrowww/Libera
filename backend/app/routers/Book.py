from pathlib import Path
from uuid import uuid4
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from pymongo.database import Database
from ..database import get_db
from ..services.Book_service import BookService
from ..schemas.Book import BookResponse, BookListResponse, BookCreate, BookUpdate
from ..config import settings

router = APIRouter(
    prefix="/api/books", 
    tags=["Books"]
)

@router.post("", response_model=BookResponse, status_code=status.HTTP_201_CREATED)
def create_book(book_data: BookCreate, db: Database = Depends(get_db)):
    service = BookService(db)
    return service.create_book(book_data)


@router.get("", response_model=BookListResponse, status_code=status.HTTP_200_OK)
def get_all_books(
    db: Database = Depends(get_db),
    genre: str | None = None,
    author: str | None = None,
    query: str | None = None,
    category_id: int | None = None,
):
    service = BookService(db)
    return service.get_all_books(
        genre=genre,
        author=author,
        query=query,
        category_id=category_id,
    ) 

@router.get("/{book_id}", response_model=BookResponse, status_code=status.HTTP_200_OK)
def get_book_by_id(book_id: int, db: Database = Depends(get_db)):
    service = BookService(db)
    return service.get_book_by_id(book_id)

@router.get("/category/{category_id}", response_model=BookListResponse, status_code=status.HTTP_200_OK)
def get_books_by_category(category_id: int, db: Database = Depends(get_db)):
    service = BookService(db)
    return service.get_books_by_category(category_id)


@router.put("/{book_id}", response_model=BookResponse, status_code=status.HTTP_200_OK)
def update_book(book_id: int, book_data: BookUpdate, db: Database = Depends(get_db)):
    service = BookService(db)
    return service.update_book(book_id, book_data)


@router.delete("/{book_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_book(book_id: int, db: Database = Depends(get_db)):
    service = BookService(db)
    service.delete_book(book_id)


@router.post(
    "/{book_id}/pdf",
    response_model=BookResponse,
    status_code=status.HTTP_200_OK,
)
async def upload_book_pdf(
    book_id: int,
    pdf_file: UploadFile = File(...),
    db: Database = Depends(get_db),
):
    if pdf_file.content_type not in {"application/pdf"}:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF files are allowed",
        )

    suffix = Path(pdf_file.filename or "book.pdf").suffix or ".pdf"
    file_name = f"{book_id}-{uuid4().hex}{suffix}"
    file_path = Path(settings.pdfs_dir) / file_name

    content = await pdf_file.read()
    file_path.write_bytes(content)

    service = BookService(db)
    return service.set_book_pdf(book_id, f"/static/pdfs/{file_name}")
