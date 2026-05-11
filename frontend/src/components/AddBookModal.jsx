import { useEffect, useState } from "react";
import {
  createBook,
  getCategories,
  updateBook,
  uploadBookPdf,
} from "../api/clients";

const EMPTY = {
  name: "",
  author: "",
  genre: "",
  year: new Date().getFullYear(),
  description: "",
  category_id: "",
  image_url: "",
};

export default function AddBookModal({ onClose, onCreated, initialData = null }) {
  const isEdit = Boolean(initialData);
  const [form, setForm] = useState(
    initialData
      ? {
          name: initialData.name ?? "",
          author: initialData.author ?? "",
          genre: initialData.genre ?? "",
          year: initialData.year ?? new Date().getFullYear(),
          description: initialData.description ?? "",
          category_id: initialData.category_id ?? "",
          image_url: initialData.image_url ?? "",
        }
      : EMPTY
  );
  const [categories, setCategories] = useState([]);
  const [pdfFile, setPdfFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getCategories().then((r) => setCategories(r.data)).catch(() => {});
  }, []);

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const payload = {
        ...form,
        year: parseInt(form.year, 10),
        category_id: parseInt(form.category_id, 10),
        image_url: form.image_url || null,
        description: form.description || null,
      };
      let savedBook;
      if (isEdit) {
        const updated = await updateBook(initialData.id, payload);
        savedBook = updated.data;
      } else {
        const created = await createBook(payload);
        savedBook = created.data;
      }
      if (pdfFile && savedBook?.id) {
        await uploadBookPdf(savedBook.id, pdfFile);
      }
      onCreated?.();
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
          <h3>{isEdit ? "Редактировать книгу" : "Добавить книгу"}</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <label>Название *</label>
            <input required value={form.name} onChange={set("name")} placeholder="Мастер и Маргарита" />
          </div>
          <div className="form-row">
            <label>Автор *</label>
            <input required value={form.author} onChange={set("author")} placeholder="М. Булгаков" />
          </div>
          <div className="form-2col">
            <div className="form-row">
              <label>Жанр *</label>
              <input required value={form.genre} onChange={set("genre")} placeholder="Роман" />
            </div>
            <div className="form-row">
              <label>Год *</label>
              <input required type="number" value={form.year} onChange={set("year")} min="1" max="2099" />
            </div>
          </div>
          <div className="form-row">
            <label>Категория *</label>
            <select required value={form.category_id} onChange={set("category_id")}>
              <option value="">— выберите —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="form-row">
            <label>Описание</label>
            <textarea
              value={form.description}
              onChange={set("description")}
              placeholder="Краткое описание книги..."
              rows={3}
            />
          </div>
          <div className="form-row">
            <label>URL обложки</label>
            <input value={form.image_url} onChange={set("image_url")} placeholder="https://..." />
          </div>
          <div className="form-row">
            <label>PDF файл книги</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setPdfFile(e.target.files?.[0] ?? null)}
            />
            {initialData?.pdf_url && !pdfFile && (
              <small className="form-hint">
                PDF уже загружен. Выберите новый файл, чтобы заменить.
              </small>
            )}
          </div>

          {error && <div className="form-error">⚠ {error}</div>}

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Отмена</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Сохраняем..." : isEdit ? "Сохранить" : "Добавить"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
