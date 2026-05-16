import { useEffect, useMemo, useState } from "react";
import {
  deleteBook,
  getBooks,
  getBooksFiltered,
} from "../api/clients";
import BookCard from "../components/BookCard";
import Spinner from "../components/Spinner";
import AddBookModal from "../components/AddBookModal";
import { getFileUrl } from "../api/clients";

export default function BooksPage() {
  const [books, setBooks] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
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

  const categories = useMemo(
    () =>
      [
        ...new Map(
          allBooks
            .map((book) => book.category)
            .filter(Boolean)
            .map((category) => [category.id, category])
        ).values(),
      ].sort((a, b) => a.name.localeCompare(b.name)),
    [allBooks]
  );

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
    fetchAllBooks().catch(() => {});
    fetchBooks({});
  }, []);

  useEffect(() => {
    if (selectedGenre !== "all" && !genres.includes(selectedGenre)) {
      setSelectedGenre("all");
    }
    if (selectedAuthor !== "all" && !authors.includes(selectedAuthor)) {
      setSelectedAuthor("all");
    }
    if (
      selectedCategory !== null &&
      !categories.some((category) => category.id === selectedCategory)
    ) {
      setSelectedCategory(null);
    }
  }, [authors, categories, genres, selectedAuthor, selectedCategory, selectedGenre]);

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
    if (!window.confirm(`Удалить книгу "${book.name}"?`)) return;
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
    applyFilters();
  };

  const handleRead = (book) => {
    const url = getFileUrl(book.pdf_url);
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
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
        <button className="btn-primary" onClick={openCreateModal}>
          <span>＋</span> Добавить книгу
        </button>
      </div>

      <div className="filters-row">
        <input
          className="search-input"
          placeholder="Поиск по названию, автору или описанию..."
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

      {categories.length > 0 && (
        <div className="category-filters">
          <button
            className={`filter-chip ${selectedCategory === null ? "active" : ""}`}
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

    </div>
  );
}
