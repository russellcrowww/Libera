from sqlalchemy.orm import Session
from typing import List
from ..repositories.Book_repository import BookRepository
from ..repositories.Category_repositories import CategoryRepository
from ..schemas.Book import BookResponse, BookCreate, BookListResponse
from fastapi import HTTPException, status

class BookService:
    def __init__(self,db):
        self.Category_repository = CategoryRepository(db)
        self.Book_repository = BookRepository(db)
    
    def get_all_Book(self)->BookListResponse:
        Book = self.Book_repository.get_all
        Book_response = [BookResponse.model_validate(byk) for byk in Book]
        return BookListResponse(Book=Book_response, total=len(Book_response))
    
    def get_Book_by_id(self, Book_id: int) -> BookResponse:
        Book = self.Book_repository.get_by_id(Book_id)
        if not Book:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Product with id {Book_id} not found"
            )
        return BookResponse.model_validate(Book)

    def get_Book_by_category(self, category_id: int) -> BookListResponse:
        category = self.category_repository.get_by_id(category_id)
        if not category:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Category with id {category_id} not found"
            )

        products = self.Book_repository.get_by_category(category_id)
        products_response = [BookResponse.model_validate(prod) for prod in products]
        return BookListResponse(products=products_response, total=len(products_response))

    def create_Book(self, Book_data: BookCreate) -> BookResponse:
        category = self.category_repository.get_by_id(Book_data.category_id)
        if not category:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Category with id {Book_data.category_id} does not exist"
            )

        Book = self.Book_repository.create(Book_data)
        return BookResponse.model_validate(Book)
    