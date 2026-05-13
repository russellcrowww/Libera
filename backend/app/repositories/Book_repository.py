from typing import List, Optional
from datetime import datetime

from sqlalchemy.orm import Session
from sqlalchemy import or_

from ..models.Book import Book
from ..schemas.Book import BookCreate


class BookRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self) -> List[Book]:
        return self.db.query(Book).order_by(Book.id).all()

    def get_by_id(self, book_id: int) -> Optional[Book]:
        return self.db.query(Book).filter(Book.id == book_id).first()

    def get_by_category(self, category_id: int) -> List[Book]:
        return (
            self.db.query(Book)
            .filter(Book.category_id == category_id)
            .order_by(Book.id)
            .all()
        )

    def get_by_author(self, author_name: str) -> List[Book]:
        return (
            self.db.query(Book)
            .filter(Book.author == author_name)
            .order_by(Book.id)
            .all()
        )

    def get_by_year(self, year_writing: int) -> List[Book]:
        return (
            self.db.query(Book)
            .filter(Book.year >= year_writing)
            .order_by(Book.id)
            .all()
        )

    def get_filtered(
        self,
        genre: Optional[str] = None,
        author: Optional[str] = None,
        query: Optional[str] = None,
        category_id: Optional[int] = None,
    ) -> List[Book]:
        q = self.db.query(Book)

        if category_id:
            q = q.filter(Book.category_id == category_id)
        if genre:
            q = q.filter(Book.genre == genre)
        if author:
            q = q.filter(Book.author == author)
        if query:
            term = f"%{query.strip()}%"
            q = q.filter(
                or_(
                    Book.name.ilike(term),
                    Book.author.ilike(term),
                    Book.description.ilike(term),
                )
            )

        return q.order_by(Book.id).all()

    def create(self, book_data: BookCreate) -> Book:
        db_book = Book(
            **book_data.model_dump(),
            created_at=datetime.utcnow(),
        )
        self.db.add(db_book)
        self.db.commit()
        self.db.refresh(db_book)
        return db_book

    def update(self, book_id: int, update_data: dict) -> Optional[Book]:
        book = self.get_by_id(book_id)
        if not book:
            return None
        for key, value in update_data.items():
            setattr(book, key, value)
        self.db.commit()
        self.db.refresh(book)
        return book

    def delete(self, book_id: int) -> bool:
        book = self.get_by_id(book_id)
        if not book:
            return False
        self.db.delete(book)
        self.db.commit()
        return True
