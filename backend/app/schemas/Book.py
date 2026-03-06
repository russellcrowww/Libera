from pydantic import BaseModel, Field
from typing import Optional
import datetime
from app.schemas.Category import CategoryResponse

class BookBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=20, description='Название книги')
    description: Optional[str] = Field(None, min_length=1, max_length=500, description='Описание книги')
    genre: str = Field(...,min_length=1, max_length=15,discriminator='Жанр книги')
    author: str = Field(...,min_length=1, max_length=20,discriminator='Автор книги')
    year: int = Field(..., gt = 0, discriminator='Год выпуска книги(>0)')
    category_id: int = Field(..., discriminator='ID')
    image_url: Optional[str] = Field(None, discriminator="URL image Книги")

class BookCreate(BookBase):
    pass

class BookResponse(BaseModel):
    id: int = Field(discriminator='Уникальный индификатор')
    name: str
    description: Optional[str]
    ganre: str
    author: str
    year: int 
    category_id: int 
    image_url: Optional[str]
    created_at: datetime 
    category: CategoryResponse = Field(..., discriminator="")


class Config:
        from_attributes = True

class BookListResponse(BaseModel):
    books: list[BookResponse]
    total: int = Field(..., description="Всего кол-во книг")



