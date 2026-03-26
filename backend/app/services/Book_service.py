from sqlalchemy.orm import Session
from typing import List
from ..repositories.Book_repository import BookRepository
from ..repositories.Category_repositories import CategoryRepository 
from ..schemas.Book import BookResponse, BookCreate, BookListResponse
from fastapi import HTTPException, status

class BookService:
    def __init__(self, db: Session):
        self.category_repository = CategoryRepository(db)
        self.book_repository = BookRepository(db)
    
    def get_all_books(self) -> BookListResponse:
        books = self.book_repository.get_all()
        books_response = [BookResponse.model_validate(b) for b in books]
        return BookListResponse(books=books_response, total=len(books_response))
    
    def get_book_by_id(self, book_id: int) -> BookResponse:
        book = self.book_repository.get_by_id(book_id)
        if not book:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Book with id {book_id} not found"
            )
        return BookResponse.model_validate(book)

    def get_books_by_category(self, category_id: int) -> BookListResponse:
        category = self.category_repository.get_by_id(category_id)
        if not category:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Category with id {category_id} not found"
            )

        books = self.book_repository.get_by_category(category_id)
        books_response = [BookResponse.model_validate(b) for b in books]
        return BookListResponse(books=books_response, total=len(books_response))

    def create_book(self, book_data: BookCreate) -> BookResponse:
        category = self.category_repository.get_by_id(book_data.category_id)
        if not category:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Category with id {book_data.category_id} does not exist"
            )

        new_book = self.book_repository.create(book_data)
        return BookResponse.model_validate(new_book)

    