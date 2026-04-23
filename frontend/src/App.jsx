import { useEffect, useState } from "react";
import { api } from "./api/clients";
import "./App.css";

function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await api.get("/api/books");
        setBooks(response.data?.books ?? []);
      } catch (err) {
        const message =
          err?.response?.data?.detail || err?.message || "Failed to load books";
        setError(String(message));
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  return (
    <main className="app">
      <h1>Library Books</h1>
      <p className="hint">FastAPI: GET /api/books</p>

      {loading && <p>Loading...</p>}
      {error && <p className="error">Error: {error}</p>}

      {!loading && !error && books.length === 0 && <p>No books yet.</p>}

      {!loading && !error && books.length > 0 && (
        <ul className="book-list">
          {books.map((book) => (
            <li key={book.id} className="book-item">
              <strong>{book.name}</strong>
              <div>{book.author}</div>
              <small>
                {book.genre} • {book.year}
              </small>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

export default App;
