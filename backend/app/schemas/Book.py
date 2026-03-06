from pydantic import BaseModel, Field
from typing import Optional
import datetime
from app.schemas.Category import CategoryResponse

class BookBase(BaseModel):
    id: int = Field(...,gt = 0, description='Уникальный индификатор')
    name: str = Field(..., min_length=1, max_length=20, description='Название книги')
    description: Optional[str] = Field(None, min_length=1, max_length=500, description='Описание книги')
    genre: str = Field(...,min_length=1, max_length=15,description='Жанр книги')
    author: str = Field(...,min_length=1, max_length=20,description='Автор книги')
    year: int = Field(..., gt = 0, description='Год выпуска книги(>0)')
    category_id: int = Field(..., description='ID')
    image_url: Optional[str] = Field(None, description="URL image Книги")

class BookCreate(BookBase):
    pass

class BookResponse(BaseModel):
    id: int = Field(description='Уникальный индификатор')
    name: str
    description: Optional[str]
    ganre: str
    author: str
    year: int 
    category_id: int 
    image_url: Optional[str]
    created_at: datetime 
    category: CategoryResponse = Field(..., description="")


class Config:
        from_attributes = True

class BookListResponse(BaseModel):
    books: list[BookResponse]
    total: int = Field(..., description="Всего кол-во книг")



