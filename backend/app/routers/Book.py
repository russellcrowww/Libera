from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..services.Book_service import BookService
from ..schemas.Book import BookResponse, BookListResponse

router = APIRouter(
    prefix="/api/Book",
    tags=["Book"]
)

@router.get("", response_model=BookListResponse, status_code=status.HTTP_200_OK)
def get_Book(db: Session = Depends(get_db)):
    service = BookService(db)
    return service.get_all_Book()

@router.get("/{Book_id}", response_model=BookResponse, status_code=status.HTTP_200_OK)
def get_product(Book_id: int, db: Session = Depends(get_db)):
    service = BookService(db)
    return service.get_Book_by_id(Book_id)

@router.get("/category/{category_id}", response_model=BookListResponse, status_code=status.HTTP_200_OK)
def get_Book_by_category(category_id: int, db: Session = Depends(get_db)):
    service = BookService(db)
    return service.get_Book_by_category(category_id)