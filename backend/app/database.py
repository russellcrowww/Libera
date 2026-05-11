from pymongo import ASCENDING, MongoClient
from pymongo.database import Database
from .config import settings


client = MongoClient(settings.db_url)
db = client[settings.db_name]


def get_db():
    yield db

def init_db():
    database: Database = db
    database.categories.create_index([("id", ASCENDING)], unique=True)
    database.categories.create_index([("name", ASCENDING)], unique=True)
    database.books.create_index([("id", ASCENDING)], unique=True)
    database.books.create_index([("name", ASCENDING)], unique=True)
    database.books.create_index([("category_id", ASCENDING)])