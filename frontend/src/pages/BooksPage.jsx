import { useEffect, useState } from "react";
import { getBooks, getBooksByCategory, getCategories } from "../api/clients";
import BookCard from "../components/BookCard";
import Spinner from "../components/Spinner";

export default function BooksPage({ onAddBook }) {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBooks = async (categoryId = null) => {
    setLoading(true);
    setError("");
    try {
      const res = categoryId
        ? await getBooksByCategory(categoryId)
        : await getBooks();
      setBooks(res.data?.books ?? []);
    } catch (err) {
      setError(err?.response?.data?.detail || err?.message || "Ошибка загрузки");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategories()
      .then((r) => setCategories(r.data))
      .catch(() => {});
    fetchBooks();
  }, []);

  const handleCategoryClick = (catId) => {
    const next = catId === selectedCategory ? null : catId;
    setSelectedCategory(next);
    fetchBooks(next);
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Каталог книг</h2>
          <p className="page-subtitle">
            {loading ? "Загружаем..." : `${books.length} книг в библиотеке`}
          </p>
        </div>
        <button className="btn-primary" onClick={onAddBook}>
          <span>＋</span> Добавить книгу
        </button>
      </div>

      {categories.length > 0 && (
        <div className="category-filters">
          <button
            className={`filter-chip ${!selectedCategory ? "active" : ""}`}
            onClick={() => handleCategoryClick(null)}
          >
            Все
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`filter-chip ${selectedCategory === cat.id ? "active" : ""}`}
              onClick={() => handleCategoryClick(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {loading && <Spinner />}
      {error && <div className="error-banner">⚠ {error}</div>}

      {!loading && !error && books.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📚</div>
          <p>Книг пока нет. Добавьте первую!</p>
        </div>
      )}

      {!loading && !error && books.length > 0 && (
        <div className="books-grid">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}
