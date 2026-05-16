from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..services.Book_service import BookService
from ..schemas.Book import BookResponse, BookListResponse, BookCreate, BookUpdate

router = APIRouter(
    prefix="/api/books",
    tags=["Books"]
)


@router.post("", response_model=BookResponse, status_code=status.HTTP_201_CREATED)
def create_book(book_data: BookCreate, db: Session = Depends(get_db)):
    service = BookService(db)
    return service.create_book(book_data)


@router.get("", response_model=BookListResponse, status_code=status.HTTP_200_OK)
def get_all_books(
    db: Session = Depends(get_db),
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
def get_book_by_id(book_id: int, db: Session = Depends(get_db)):
    service = BookService(db)
    return service.get_book_by_id(book_id)


@router.put("/{book_id}", response_model=BookResponse, status_code=status.HTTP_200_OK)
def update_book(book_id: int, book_data: BookUpdate, db: Session = Depends(get_db)):
    service = BookService(db)
    return service.update_book(book_id, book_data)


@router.delete("/{book_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_book(book_id: int, db: Session = Depends(get_db)):
    service = BookService(db)
    service.delete_book(book_id)
