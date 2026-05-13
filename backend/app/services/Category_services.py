from sqlalchemy.exc import IntegrityError
from ..repositories.Category_repositories import CategoryRepository
from ..schemas.Category import CategoryResponse, CategoryCreate, CategoryUpdate
from fastapi import HTTPException, status


class CategoryService:
    def __init__(self, db):
        self.repository = CategoryRepository(db)

    def get_all_categories(self) -> list[CategoryResponse]:
        categories = self.repository.get_all()
        return [CategoryResponse.model_validate(cat) for cat in categories]

    def get_category_by_id(self, category_id: int) -> CategoryResponse:
        category = self.repository.get_by_id(category_id)
        if not category:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f'Category with id {category_id} not found'
            )
        return CategoryResponse.model_validate(category)

    def create_category(self, category_data: CategoryCreate) -> CategoryResponse:
        try:
            category = self.repository.create(category_data)
        except IntegrityError:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Category with name '{category_data.name}' already exists",
            )
        return CategoryResponse.model_validate(category)

    def update_category(self, category_id: int, data: CategoryUpdate) -> CategoryResponse:
        exists = self.repository.get_by_id(category_id)
        if not exists:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Category with id {category_id} not found",
            )
        payload = data.model_dump(exclude_none=True)
        if not payload:
            return CategoryResponse.model_validate(exists)
        try:
            updated = self.repository.update(category_id, payload)
        except IntegrityError:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Category with this name already exists",
            )
        if not updated:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Category with id {category_id} not found",
            )
        return CategoryResponse.model_validate(updated)

    def delete_category(self, category_id: int) -> None:
        exists = self.repository.get_by_id(category_id)
        if not exists:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Category with id {category_id} not found",
            )
        book_count = self.repository.count_books(category_id)
        if book_count > 0:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=(
                    f"Нельзя удалить категорию: к ней привязано {book_count} книг. "
                    "Сначала переназначьте или удалите книги."
                ),
            )
        self.repository.delete(category_id)
