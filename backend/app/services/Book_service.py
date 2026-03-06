from sqlalchemy.orm import Session
from typing import List
from ..repositories.Book_repository import BookRepository
from ..repositories.Category_repositories import CategoryRepository
from ..schemas.Book import BookResponse, BookCreate, BookListResponse
from fastapi import HTTPException, status

class CategoryService:
    def __init__(self,db):
        self.Category_repository = CategoryRepository(db)
        self.Book_repository = BookRepository(db)
    
    def get_all_Book(self)->BookListResponse:
        Book = self.Book_repository.get_all
        Book_response = [BookResponse.model_validate(byk) for byk in Book]
        return BookListResponse(Book=Book_response, total=len(Book_response))
    
    def get_Book_by_id(self, Book_id: int) -> ProductResponse:
        Book = self.Book_repository.get_by_id(Book_id)
        if not Book:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Product with id {Book_id} not found"
            )
        return ProductResponse.model_validate(product)

    def get_products_by_category(self, category_id: int) -> ProductListResponse:
        category = self.category_repository.get_by_id(category_id)
        if not category:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Category with id {category_id} not found"
            )

        products = self.product_repository.get_by_category(category_id)
        products_response = [ProductResponse.model_validate(prod) for prod in products]
        return ProductListResponse(products=products_response, total=len(products_response))

    def create_product(self, product_data: ProductCreate) -> ProductResponse:
        category = self.category_repository.get_by_id(product_data.category_id)
        if not category:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Category with id {product_data.category_id} does not exist"
            )

        product = self.product_repository.create(product_data)
        return ProductResponse.model_validate(product)
    