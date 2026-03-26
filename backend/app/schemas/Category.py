from pydantic import BaseModel, Field, ConfigDict

class CategoryBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=50, description='Название категории (например, Художественная)')
    genre: str =  Field(..., min_length=1, max_length=30, description='Жанр (например, Драма)')

class CategoryCreate(CategoryBase):
    pass

class CategoryResponse(CategoryBase):
    id: int = Field(..., gt=0, description="ID из базы данных")
    model_config = ConfigDict(from_attributes=True)
