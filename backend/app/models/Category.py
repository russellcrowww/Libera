from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from ..database import Base

class Category(Base):
    __tablename__ = "categories"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False, index=True)
    genre = Column(String, nullable=False) 
    
    books = relationship("Book", back_populates="category") 


    def __repr__(self):
        return f"<Category(id={self.id}, name='{self.name}')>"