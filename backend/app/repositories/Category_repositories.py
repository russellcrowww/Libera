from typing import List, Optional

from sqlalchemy.orm import Session

from ..models.Category import Category
from ..schemas.Category import CategoryCreate, DEFAULT_CATEGORY_GENRE


class CategoryRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self) -> List[Category]:
        return self.db.query(Category).order_by(Category.id).all()

    def get_by_id(self, category_id: int) -> Optional[Category]:
        return self.db.query(Category).filter(Category.id == category_id).first()

    def create(self, category_data: CategoryCreate) -> Category:
        db_category = Category(
            name=category_data.name,
            genre=DEFAULT_CATEGORY_GENRE,
        )
        self.db.add(db_category)
        self.db.commit()
        self.db.refresh(db_category)
        return db_category
