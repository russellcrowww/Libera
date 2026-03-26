from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..services.Book_service import BookService
from ..schemas.Book import BookResponse, BookListResponse, BookCreate

router = APIRouter(
    prefix="/api/books", 
    tags=["Books"]
)

@router.post("", response_model=BookResponse, status_code=status.HTTP_201_CREATED)
def create_book(book_data: BookCreate, db: Session = Depends(get_db)):
    service = BookService(db)
    return service.create_book(book_data)


@router.get("", response_model=BookListResponse, status_code=status.HTTP_200_OK)
def get_all_books(db: Session = Depends(get_db)):
    service = BookService(db)
    return service.get_all_books() 

@router.get("/{book_id}", response_model=BookResponse, status_code=status.HTTP_200_OK)
def get_book_by_id(book_id: int, db: Session = Depends(get_db)):
    service = BookService(db)
    return service.get_book_by_id(book_id)

@router.get("/category/{category_id}", response_model=BookListResponse, status_code=status.HTTP_200_OK)
def get_books_by_category(category_id: int, db: Session = Depends(get_db)):
    service = BookService(db)
    return service.get_books_by_category(category_id)
