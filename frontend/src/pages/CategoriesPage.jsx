import { useCallback, useEffect, useState } from "react";
import { deleteCategory, getCategories } from "../api/clients";
import Spinner from "../components/Spinner";
import AddCategoryModal from "../components/AddCategoryModal";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState(null);

  const loadCategories = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const r = await getCategories();
      setCategories(r.data);
    } catch (err) {
      setError(err?.response?.data?.detail || err?.message || "Ошибка загрузки");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleDelete = async (cat) => {
    if (!window.confirm(`Удалить категорию «${cat.name}»?`)) return;
    try {
      await deleteCategory(cat.id);
      await loadCategories();
    } catch (err) {
      setError(err?.response?.data?.detail || err?.message || "Ошибка удаления");
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Категории</h2>
          <p className="page-subtitle">{categories.length} категорий</p>
        </div>
        <button className="btn-primary" onClick={() => setModal({ mode: "create" })}>
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
            <div key={cat.id} className="category-card category-card-manage">
              <div className="category-card-icon">📖</div>
              <div className="category-card-body">
                <h3>{cat.name}</h3>
                <p className="category-genre">{cat.genre}</p>
              </div>
              <div className="category-card-actions">
                <button
                  type="button"
                  className="btn-secondary btn-compact"
                  onClick={() => setModal({ mode: "edit", category: cat })}
                >
                  Изменить
                </button>
                <button
                  type="button"
                  className="btn-secondary btn-compact danger-outline"
                  onClick={() => handleDelete(cat)}
                >
                  Удалить
                </button>
              </div>
              <div className="category-card-id">#{cat.id}</div>
            </div>
          ))}
        </div>
      )}

      {modal?.mode === "create" && (
        <AddCategoryModal
          onClose={() => setModal(null)}
          onSaved={loadCategories}
        />
      )}
      {modal?.mode === "edit" && (
        <AddCategoryModal
          editingCategory={modal.category}
          onClose={() => setModal(null)}
          onSaved={loadCategories}
        />
      )}
    </div>
  );
}
