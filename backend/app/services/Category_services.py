from pymongo.errors import DuplicateKeyError
from ..repositories.Category_repositories import CategoryRepository
from ..schemas.Category import CategoryResponse, CategoryCreate
from fastapi import HTTPException, status

class CategoryService:
    def __init__(self,db):
        self.repository = CategoryRepository(db)
    
    def get_all_categories(self)->list[CategoryResponse]:
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
        except DuplicateKeyError:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Category with name '{category_data.name}' already exists",
            )
        return CategoryResponse.model_validate(category)
    