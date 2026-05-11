from fastapi import APIRouter, Depends, status
from pymongo.database import Database
from typing import List
from ..database import get_db
from ..services.Category_services import CategoryService
from ..schemas.Category import CategoryResponse, CategoryCreate, CategoryUpdate

router = APIRouter(
    prefix="/api/categories",
    tags=['categories']
)

@router.post("", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
def create_category(category_data: CategoryCreate, db: Database = Depends(get_db)):
    service = CategoryService(db) 
    return service.create_category(category_data) 


@router.get("", response_model=List[CategoryResponse], status_code=status.HTTP_200_OK)
def get_categories(db: Database = Depends(get_db)):
    service = CategoryService(db)
    return service.get_all_categories()

@router.get('/{category_id}', response_model=CategoryResponse, status_code=status.HTTP_200_OK)
def get_category(category_id: int, db: Database = Depends(get_db)):
    service = CategoryService(db)
    return service.get_category_by_id(category_id)


@router.put("/{category_id}", response_model=CategoryResponse, status_code=status.HTTP_200_OK)
def update_category(
    category_id: int,
    category_data: CategoryUpdate,
    db: Database = Depends(get_db),
):
    service = CategoryService(db)
    return service.update_category(category_id, category_data)


@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_category(category_id: int, db: Database = Depends(get_db)):
    service = CategoryService(db)
    service.delete_category(category_id)
