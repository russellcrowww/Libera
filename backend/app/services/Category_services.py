from ..repositories.Category_repositories import CategoryRepository
from ..schemas.Category import CategoryResponse
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
