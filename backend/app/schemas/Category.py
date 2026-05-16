from pydantic import BaseModel, Field, ConfigDict

DEFAULT_CATEGORY_GENRE = "—"


class CategoryCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=50)


class CategoryResponse(BaseModel):
    id: int = Field(..., gt=0)
    name: str
    genre: str = DEFAULT_CATEGORY_GENRE
    model_config = ConfigDict(from_attributes=True)
