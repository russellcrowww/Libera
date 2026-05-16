from sqlalchemy.exc import IntegrityError
from ..repositories.Book_repository import BookRepository
from ..repositories.Category_repositories import CategoryRepository
from ..schemas.Book import BookResponse, BookCreate, BookListResponse, BookUpdate
from fastapi import HTTPException, status


class BookService:
    def __init__(self, db):
        self.category_repository = CategoryRepository(db)
        self.book_repository = BookRepository(db)

    def get_all_books(
        self,
        genre: str | None = None,
        author: str | None = None,
        query: str | None = None,
        category_id: int | None = None,
    ) -> BookListResponse:
        has_filters = any([genre, author, query, category_id])
        books = (
            self.book_repository.get_filtered(
                genre=genre,
                author=author,
                query=query,
                category_id=category_id,
            )
            if has_filters
            else self.book_repository.get_all()
        )
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
        try:
            new_book = self.book_repository.create(book_data)
        except IntegrityError:
            self.book_repository.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Book with name '{book_data.name}' already exists",
            )
        return BookResponse.model_validate(new_book)

    def update_book(self, book_id: int, book_data: BookUpdate) -> BookResponse:
        exists = self.book_repository.get_by_id(book_id)
        if not exists:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Book with id {book_id} not found",
            )

        payload = book_data.model_dump(exclude_none=True)
        if "category_id" in payload:
            category = self.category_repository.get_by_id(payload["category_id"])
            if not category:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Category with id {payload['category_id']} does not exist",
                )

        if not payload:
            return BookResponse.model_validate(exists)

        try:
            updated_book = self.book_repository.update(book_id, payload)
        except IntegrityError:
            self.book_repository.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Book with this name already exists",
            )

        return BookResponse.model_validate(updated_book)

    def delete_book(self, book_id: int) -> None:
        book = self.book_repository.get_by_id(book_id)
        if not book:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Book with id {book_id} not found",
            )

        deleted = self.book_repository.delete(book_id)
        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Book with id {book_id} not found",
            )
