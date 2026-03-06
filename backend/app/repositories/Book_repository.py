from sqlalchemy.orm import Session,joinedload
from typing import List, Optional
from app.models.Book import Book 
from app.schemas.Book import BookCreate 

class BookRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self) -> list[Book]:
       return self.db.query(Book).options(joinedload(Book.category)).all()
    
    def get_by_id(self,Book_id: int) -> Optional[Book]:
        return (self.db.query(Book).options(joinedload(Book.category)).filter(Book.id == Book_id).first())
    
    def get_by_category(self, category_id: int) -> List[Book]:
        return (
            self.db.query(Book)
            .options(joinedload(Book.category))
            .filter(Book.category_id == category_id)
            .all()
        )
    
    def create(self, Book_data: BookCreate) -> Book:
        db_Book = Book(**Book_data.model_dump())
        self.db.add(db_Book)
        self.db.commit()
        self.db.refresh(db_Book)
        return db_Book
    
    def get_multiple_by_ids(self, Book_ids: List[int]) -> List[Book]:
        return (
            self.db.query(Book)
            .options(joinedload(Book.category))
            .filter(Book.id.in_(Book_ids))
            .all()
        )

    
