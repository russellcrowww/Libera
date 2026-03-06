from pydantic import BaseModel, Field

class CategoryBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=20, description='Введите название')
    genre: str =  Field(..., min_length=1, max_length=15, description='Введите жанр книги')
    id: int = Field(...,gt = 0, description='Уникальный индификатор')

class CategoryCreate(CategoryBase):
    pass

class CategoryResponse(CategoryBase):
    id: int = Field(..., description="Уникальный индификатор")

    class Config:
        from_attributes = True