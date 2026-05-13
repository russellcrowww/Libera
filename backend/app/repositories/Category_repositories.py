from typing import List, Optional

from sqlalchemy.orm import Session

from ..models.Category import Category
from ..models.Book import Book
from ..schemas.Category import CategoryCreate


class CategoryRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self) -> List[Category]:
        return self.db.query(Category).order_by(Category.id).all()

    def get_by_id(self, category_id: int) -> Optional[Category]:
        return self.db.query(Category).filter(Category.id == category_id).first()

    def create(self, category_data: CategoryCreate) -> Category:
        db_category = Category(**category_data.model_dump())
        self.db.add(db_category)
        self.db.commit()
        self.db.refresh(db_category)
        return db_category

    def update(self, category_id: int, update_data: dict) -> Optional[Category]:
        category = self.get_by_id(category_id)
        if not category:
            return None
        for key, value in update_data.items():
            setattr(category, key, value)
        self.db.commit()
        self.db.refresh(category)
        return category

    def delete(self, category_id: int) -> bool:
        category = self.get_by_id(category_id)
        if not category:
            return False
        self.db.delete(category)
        self.db.commit()
        return True

    def count_books(self, category_id: int) -> int:
        return (
            self.db.query(Book)
            .filter(Book.category_id == category_id)
            .count()
        )
