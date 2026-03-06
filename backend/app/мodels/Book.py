from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from ..database import Base
from typing import datetime, Text, ForeignKey

class Book(Base):
    __tablename__ = "books"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False, index=True)
    description  = Column(Text)
    genre = Column(String, nullable=False)
    author = Column(String,nullable=False)
    year = Column(Integer,nullable=False )
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    image_url = Column(String)
    Created_at = Column(datetime.DateTime, default=datetime.utcnow)

    category = relationship("category", back_populates="books")

    def __repr__(self):
        return f"<Book(id={self.id}, name='{self.name}', author={self.author})>"

