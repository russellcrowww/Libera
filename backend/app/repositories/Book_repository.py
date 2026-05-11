# репозиторий решает, какие книги достать (фильтрация)

from typing import List, Optional
from datetime import datetime
from pymongo import ReturnDocument
from pymongo.database import Database
from app.schemas.Book import BookCreate 

class BookRepository:
    def __init__(self, db: Database):
        self.db = db

    def _next_id(self) -> int:
        counter = self.db.counters.find_one_and_update(
            {"_id": "books_id"},
            {"$inc": {"seq": 1}},
            upsert=True,
            return_document=ReturnDocument.AFTER,
        )
        return counter["seq"]

    def _attach_category(self, book: dict) -> dict:
        category = self.db.categories.find_one({"id": book["category_id"]}, {"_id": 0})
        book["category"] = category
        return book

    def get_all(self) -> List[dict]:
        books = list(self.db.books.find({}, {"_id": 0}).sort("id", 1))
        return [self._attach_category(book) for book in books]
    
    def get_by_id(self, book_id: int) -> Optional[dict]:
        book = self.db.books.find_one({"id": book_id}, {"_id": 0})
        if not book:
            return None
        return self._attach_category(book)
    
    def get_by_category(self, category_id: int) -> List[dict]:
        books = list(self.db.books.find({"category_id": category_id}, {"_id": 0}).sort("id", 1))
        return [self._attach_category(book) for book in books]

    def get_by_author(self, author_name: str) -> List[dict]:
        books = list(self.db.books.find({"author": author_name}, {"_id": 0}).sort("id", 1))
        return [self._attach_category(book) for book in books]
    
    def get_by_year(self,year_writing: int) -> List[dict]:
        books = list(self.db.books.find({"year": {"$gte": year_writing}}, {"_id": 0}).sort("id", 1))
        return [self._attach_category(book) for book in books]

    def get_filtered(
        self,
        genre: Optional[str] = None,
        author: Optional[str] = None,
        query: Optional[str] = None,
        category_id: Optional[int] = None,
    ) -> List[dict]:
        mongo_filter = {}
        if category_id:
            mongo_filter["category_id"] = category_id
        if genre:
            mongo_filter["genre"] = genre
        if author:
            mongo_filter["author"] = author
        if query:
            escaped_query = query.strip()
            if escaped_query:
                mongo_filter["$or"] = [
                    {"name": {"$regex": escaped_query, "$options": "i"}},
                    {"author": {"$regex": escaped_query, "$options": "i"}},
                    {"description": {"$regex": escaped_query, "$options": "i"}},
                ]

        books = list(self.db.books.find(mongo_filter, {"_id": 0}).sort("id", 1))
        return [self._attach_category(book) for book in books]

    def create(self, book_data: BookCreate) -> dict:
        db_book = book_data.model_dump()
        db_book["id"] = self._next_id()
        db_book["created_at"] = datetime.utcnow()
        self.db.books.insert_one(db_book)
        return self._attach_category(db_book)

    def update(self, book_id: int, update_data: dict) -> Optional[dict]:
        updated_book = self.db.books.find_one_and_update(
            {"id": book_id},
            {"$set": update_data},
            return_document=ReturnDocument.AFTER,
            projection={"_id": 0},
        )
        if not updated_book:
            return None
        return self._attach_category(updated_book)

    def delete(self, book_id: int) -> bool:
        result = self.db.books.delete_one({"id": book_id})
        return result.deleted_count > 0


    
