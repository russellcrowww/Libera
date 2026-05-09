import { useEffect, useState } from "react";
import { getCategories } from "../api/clients";
import Spinner from "../components/Spinner";

export default function CategoriesPage({ onAddCategory }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getCategories()
      .then((r) => setCategories(r.data))
      .catch((err) =>
        setError(err?.response?.data?.detail || err?.message || "Ошибка загрузки")
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Категории</h2>
          <p className="page-subtitle">{categories.length} категорий</p>
        </div>
        <button className="btn-primary" onClick={onAddCategory}>
          <span>＋</span> Добавить категорию
        </button>
      </div>

      {loading && <Spinner />}
      {error && <div className="error-banner">⚠ {error}</div>}

      {!loading && !error && categories.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🗂</div>
          <p>Категорий пока нет. Создайте первую!</p>
        </div>
      )}

      {!loading && !error && categories.length > 0 && (
        <div className="categories-grid">
          {categories.map((cat) => (
            <div key={cat.id} className="category-card">
              <div className="category-card-icon">📖</div>
              <div className="category-card-body">
                <h3>{cat.name}</h3>
                <p className="category-genre">{cat.genre}</p>
              </div>
              <div className="category-card-id">#{cat.id}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
