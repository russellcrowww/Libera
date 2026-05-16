import { useCallback, useEffect, useMemo, useState } from "react";
import {
  deleteBook,
  getBooks,
  getBooksFiltered,
  getCategories,
  getFileUrl,
} from "../api/clients";
import BookCard from "../components/BookCard";
import Spinner from "../components/Spinner";
import AddBookModal from "../components/AddBookModal";
import AddCategoryModal from "../components/AddCategoryModal";

export default function BooksPage() {
  const [books, setBooks] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [selectedAuthor, setSelectedAuthor] = useState("all");
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState(null);
  const [editingBook, setEditingBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const genres = useMemo(
    () => [...new Set(allBooks.map((book) => book.genre).filter(Boolean))].sort(),
    [allBooks]
  );

  const authors = useMemo(
    () => [...new Set(allBooks.map((book) => book.author).filter(Boolean))].sort(),
    [allBooks]
  );

  const fetchCategories = useCallback(async () => {
    try {
      const res = await getCategories();
      setAllCategories(res.data ?? []);
    } catch {
      setAllCategories([]);
    }
  }, []);

  const fetchBooks = async (filters = {}) => {
    setLoading(true);
    setError("");
    try {
      const res = await getBooksFiltered(filters);
      setBooks(res.data?.books ?? []);
    } catch (err) {
      setError(err?.response?.data?.detail || err?.message || "Ошибка загрузки");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllBooks = async () => {
    const res = await getBooks();
    setAllBooks(res.data?.books ?? []);
  };

  useEffect(() => {
    fetchCategories();
    fetchAllBooks().catch(() => {});
    fetchBooks({});
  }, [fetchCategories]);

  useEffect(() => {
    if (selectedGenre !== "all" && !genres.includes(selectedGenre)) {
      setSelectedGenre("all");
    }
    if (selectedAuthor !== "all" && !authors.includes(selectedAuthor)) {
      setSelectedAuthor("all");
    }
    if (
      selectedCategory !== null &&
      !allCategories.some((category) => category.id === selectedCategory)
    ) {
      setSelectedCategory(null);
    }
  }, [allCategories, authors, genres, selectedAuthor, selectedCategory, selectedGenre]);

  const applyFilters = () => {
    const categoryId =
      selectedCategory !== null ? Number(selectedCategory) : undefined;
    const params = {
      category_id: categoryId,
      genre: selectedGenre !== "all" ? selectedGenre : undefined,
      author: selectedAuthor !== "all" ? selectedAuthor : undefined,
      query: query.trim() || undefined,
    };
    fetchBooks(params);
  };

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGenre, selectedAuthor, query, selectedCategory]);

  const handleDelete = async (book) => {
    if (!window.confirm(`Удалить книгу «${book.name}»?`)) return;
    try {
      await deleteBook(book.id);
      await fetchAllBooks();
      applyFilters();
    } catch (err) {
      setError(err?.response?.data?.detail || err?.message || "Ошибка удаления");
    }
  };

  const handleCategoryClick = (catId) => {
    const next = catId === null || catId === selectedCategory ? null : catId;
    setSelectedCategory(next);
  };

  const openCreateModal = () => {
    setEditingBook(null);
    setModal("book");
  };

  const openEditModal = (book) => {
    setEditingBook(book);
    setModal("book");
  };

  const handleSaved = async () => {
    await fetchAllBooks();
    await fetchCategories();
    applyFilters();
  };

  const handleCategorySaved = async () => {
    await fetchCategories();
  };

  const handleRead = (book) => {
    const url = getFileUrl(book.pdf_url);
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="page">
      <section className="page-hero">
        <div className="hero-glow" aria-hidden="true" />
        <div className="hero-content">
          <p className="hero-eyebrow">Твоя цифровая полка</p>
          <h1 className="hero-title">
            Читай <span className="hero-gradient-text">смело</span>, ищи быстро
          </h1>
          <p className="hero-lead">
            Каталог книг, фильтры по жанрам и категориям — всё в одном месте.
          </p>
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-value">{allBooks.length}</span>
              <span className="hero-stat-label">книг</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-value">{allCategories.length}</span>
              <span className="hero-stat-label">категорий</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-value">{genres.length}</span>
              <span className="hero-stat-label">жанров</span>
            </div>
          </div>
        </div>
        <div className="hero-actions">
          <button type="button" className="btn-primary btn-glow" onClick={openCreateModal}>
            <span>＋</span> Добавить книгу
          </button>
        </div>
      </section>

      <div className="filters-panel">
        <div className="filters-row">
          <input
            className="search-input"
            placeholder="🔍 Поиск по названию, автору или описанию..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select
            className="filter-select"
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
          >
            <option value="all">Все жанры</option>
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
          <select
            className="filter-select"
            value={selectedAuthor}
            onChange={(e) => setSelectedAuthor(e.target.value)}
          >
            <option value="all">Все авторы</option>
            {authors.map((author) => (
              <option key={author} value={author}>
                {author}
              </option>
            ))}
          </select>
        </div>

        <div className="category-filters">
          <span className="category-filters-label">Категории</span>
          <button
            type="button"
            className={`filter-chip ${selectedCategory === null ? "active" : ""}`}
            onClick={() => handleCategoryClick(null)}
          >
            Все
          </button>
          {allCategories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`filter-chip ${selectedCategory === cat.id ? "active" : ""}`}
              onClick={() => handleCategoryClick(cat.id)}
            >
              {cat.name}
            </button>
          ))}
          <button
            type="button"
            className="filter-chip filter-chip--add"
            onClick={() => setModal("category")}
            title="Добавить категорию"
          >
            ＋ Категория
          </button>
        </div>
      </div>

      <p className="results-line">
        {loading ? "Загружаем..." : `Найдено: ${books.length} ${books.length === 1 ? "книга" : books.length < 5 ? "книги" : "книг"}`}
      </p>

      {loading && <Spinner />}
      {error && <div className="error-banner">⚠ {error}</div>}

      {!loading && !error && books.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📚</div>
          <p>Здесь пока пусто. Добавь книгу или смени фильтры!</p>
          <button type="button" className="btn-secondary" onClick={openCreateModal}>
            Добавить первую книгу
          </button>
        </div>
      )}

      {!loading && !error && books.length > 0 && (
        <div className="books-grid">
          {books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onEdit={openEditModal}
              onDelete={handleDelete}
              onRead={handleRead}
            />
          ))}
        </div>
      )}

      {modal === "book" && (
        <AddBookModal
          onClose={() => setModal(null)}
          onCreated={handleSaved}
          initialData={editingBook}
        />
      )}

      {modal === "category" && (
        <AddCategoryModal
          onClose={() => setModal(null)}
          onSaved={handleCategorySaved}
        />
      )}
    </div>
  );
}
