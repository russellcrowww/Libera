from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime
from ..schemas.Category import CategoryResponse


class BookBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    genre: str = Field(..., min_length=1, max_length=30)
    author: str = Field(..., min_length=1, max_length=50)
    year: int = Field(..., gt=0, lt=2100)
    category_id: int = Field(..., gt=0)
    image_url: Optional[str] = None
    pdf_url: Optional[str] = None


class BookCreate(BookBase):
    pass


class BookUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    genre: Optional[str] = Field(None, min_length=1, max_length=30)
    author: Optional[str] = Field(None, min_length=1, max_length=50)
    year: Optional[int] = Field(None, gt=0, lt=2100)
    category_id: Optional[int] = Field(None, gt=0)
    image_url: Optional[str] = None
    pdf_url: Optional[str] = None


class BookResponse(BookBase):
    id: int
    created_at: datetime
    category: Optional[CategoryResponse] = None
    model_config = ConfigDict(from_attributes=True)


class BookListResponse(BaseModel):
    books: list[BookResponse]
    total: int
    model_config = ConfigDict(from_attributes=True)
