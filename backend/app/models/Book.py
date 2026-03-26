from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text as SQLText
from sqlalchemy.orm import relationship
from datetime import datetime     
from ..database import Base

class Book(Base):
    __tablename__ = "books"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False, index=True)
    description = Column(SQLText) 
    genre = Column(String, nullable=False)
    author = Column(String, nullable=False)
    year = Column(Integer, nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    image_url = Column(String)
    created_at = Column(DateTime, default=datetime.now) 

    category = relationship("Category", back_populates="books")

    def __repr__(self):
        return f"<Book(id={self.id}, name='{self.name}', author='{self.author}')>"


