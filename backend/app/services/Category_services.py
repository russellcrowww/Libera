from sqlalchemy.exc import IntegrityError
from ..repositories.Category_repositories import CategoryRepository
from ..schemas.Category import CategoryResponse, CategoryCreate
from fastapi import HTTPException, status


class CategoryService:
    def __init__(self, db):
        self.repository = CategoryRepository(db)

    def get_all_categories(self) -> list[CategoryResponse]:
        categories = self.repository.get_all()
        return [CategoryResponse.model_validate(cat) for cat in categories]

    def create_category(self, category_data: CategoryCreate) -> CategoryResponse:
        try:
            category = self.repository.create(category_data)
        except IntegrityError:
            self.repository.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Категория «{category_data.name}» уже существует",
            )
        return CategoryResponse.model_validate(category)
