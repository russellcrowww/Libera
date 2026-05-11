from typing import Optional

from pydantic import BaseModel, Field, ConfigDict

class CategoryBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=50, description='Название категории (например, Художественная)')
    genre: str =  Field(..., min_length=1, max_length=30, description='Жанр (например, Драма)')

class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=50)
    genre: Optional[str] = Field(None, min_length=1, max_length=30)


class CategoryResponse(CategoryBase):
    id: int = Field(..., gt=0, description="ID из базы данных")
    model_config = ConfigDict(from_attributes=True)
