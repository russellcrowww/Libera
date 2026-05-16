from typing import List, Optional

from sqlalchemy.orm import Session

from ..models.Category import Category


class CategoryRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self) -> List[Category]:
        return self.db.query(Category).order_by(Category.id).all()

    def get_by_id(self, category_id: int) -> Optional[Category]:
        return self.db.query(Category).filter(Category.id == category_id).first()
