# репозиторий решает, какие книги достать (фильтрация)

from typing import List, Optional
from sqlalchemy.orm import Session, joinedload 
from app.models.Book import Book 
from app.schemas.Book import BookCreate 

class BookRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self) -> List[Book]:
        return self.db.query(Book).options(joinedload(Book.category)).all()
    
    def get_by_id(self, book_id: int) -> Optional[Book]:
        return self.db.query(Book).options(joinedload(Book.category)).filter(Book.id == book_id).first()
    
    def get_by_category(self, category_id: int) -> List[Book]:
        return (
            self.db.query(Book)
            .options(joinedload(Book.category))
            .filter(Book.category_id == category_id)
            .all()
        )
    def get_by_author(self, author_name: str) -> List[Book]:
        return (
            self.db.query(Book)
            .options(joinedload(Book.category))
            .filter(Book.author == author_name)
            .all()
        )
    
    def get_by_year(self,year_writing: int) -> List[Book]:
        return(
            self.db.query(Book)
            .options(joinedload(Book.category))
            .filter(Book.year >= year_writing)
            .all()
        )

    def create(self, book_data: BookCreate) -> Book:
        db_book = Book(**book_data.model_dump()) 
        self.db.add(db_book)
        self.db.commit() 
        self.db.refresh(db_book) 
        return db_book


    
