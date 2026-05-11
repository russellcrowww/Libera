from typing import List, Optional
from pymongo import ReturnDocument
from pymongo.database import Database
from app.schemas.Category import CategoryCreate 

class CategoryRepository:
    def __init__(self, db: Database):
        self.db = db

    def _next_id(self) -> int:
        counter = self.db.counters.find_one_and_update(
            {"_id": "categories_id"},
            {"$inc": {"seq": 1}},
            upsert=True,
            return_document=ReturnDocument.AFTER,
        )
        return counter["seq"]

    def get_all(self) -> List[dict]:
        return list(self.db.categories.find({}, {"_id": 0}).sort("id", 1))
    
    def get_by_id(self, category_id: int) -> Optional[dict]:
        return self.db.categories.find_one({"id": category_id}, {"_id": 0})

    def create(self, category_data: CategoryCreate) -> dict:
        db_category = category_data.model_dump()
        db_category["id"] = self._next_id()
        self.db.categories.insert_one(db_category)
        return db_category