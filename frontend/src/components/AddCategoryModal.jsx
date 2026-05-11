import { useEffect, useState } from "react";
import { createCategory, updateCategory } from "../api/clients";

const EMPTY = { name: "", genre: "" };

export default function AddCategoryModal({ onClose, onSaved, editingCategory = null }) {
  const isEdit = Boolean(editingCategory);
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (editingCategory) {
      setForm({
        name: editingCategory.name ?? "",
        genre: editingCategory.genre ?? "",
      });
    } else {
      setForm(EMPTY);
    }
  }, [editingCategory]);

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (isEdit) {
        await updateCategory(editingCategory.id, form);
      } else {
        await createCategory(form);
      }
      onSaved?.();
      onClose();
    } catch (err) {
      const detail = err?.response?.data?.detail;
      if (Array.isArray(detail)) {
        setError(detail.map((d) => d.msg).join("; "));
      } else {
        setError(detail || err?.message || "Ошибка");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{isEdit ? "Редактировать категорию" : "Добавить категорию"}</h3>
          <button type="button" className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <label>Название *</label>
            <input
              required
              value={form.name}
              onChange={set("name")}
              placeholder="Художественная"
            />
          </div>
          <div className="form-row">
            <label>Жанр *</label>
            <input
              required
              value={form.genre}
              onChange={set("genre")}
              placeholder="Драма"
            />
          </div>

          {error && <div className="form-error">⚠ {error}</div>}

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Отмена
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Сохраняем..." : isEdit ? "Сохранить" : "Создать"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
