import { useCallback, useEffect, useState } from "react";
import { createBook, getCategories, updateBook } from "../api/clients";
import AddCategoryModal from "./AddCategoryModal";

const EMPTY = {
  name: "",
  author: "",
  genre: "",
  year: new Date().getFullYear(),
  description: "",
  category_id: "",
  image_url: "",
  pdf_url: "",
};

export default function AddBookModal({
  onClose,
  onCreated,
  initialData = null,
}) {
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
          pdf_url: initialData.pdf_url ?? "",
        }
      : EMPTY
  );
  const [categories, setCategories] = useState([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadCategories = useCallback(() => {
    getCategories()
      .then((r) => setCategories(r.data ?? []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleCategorySaved = (category) => {
    loadCategories();
    if (category?.id) {
      setForm((prev) => ({ ...prev, category_id: String(category.id) }));
    }
    setShowCategoryModal(false);
  };

  const openCategoryForm = () => setShowCategoryModal(true);

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
        pdf_url: form.pdf_url.trim() || null,
      };
      if (isEdit) {
        await updateBook(initialData.id, payload);
      } else {
        await createBook(payload);
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
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>{isEdit ? "Редактировать книгу" : "Добавить книгу"}</h3>
            <button type="button" className="modal-close" onClick={onClose}>✕</button>
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
              <div className="category-field-row">
                <select required value={form.category_id} onChange={set("category_id")}>
                  <option value="">— выберите —</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <button type="button" className="btn-ghost" onClick={openCategoryForm}>＋ Новая</button>
              </div>
            </div>
            <div className="form-row">
              <label>Описание</label>
              <textarea value={form.description} onChange={set("description")} placeholder="Краткое описание..." rows={3} />
            </div>
            <div className="form-row">
              <label>URL обложки</label>
              <input value={form.image_url} onChange={set("image_url")} placeholder="https://..." />
            </div>
            <div className="form-row">
              <label>Ссылка на PDF *</label>
              <aside className="pdf-guide" aria-label="Как получить ссылку на PDF">
                <p className="pdf-guide-title">Как добавить книгу в формате PDF</p>
                <ol className="pdf-guide-steps">
                  <li>
                    <strong>Скачайте PDF</strong> на компьютер — файл должен быть в формате
                    .pdf (при необходимости заранее конвертируйте книгу).
                  </li>
                  <li>
                    <strong>Загрузите в Google Диск</strong> — нажмите «Создать» →
                    «Загрузить файл» и выберите PDF.
                  </li>
                  <li>
                    <strong>Откройте доступ</strong> — щёлкните по файлу правой кнопкой →
                    «Настроить доступ» → «Доступно всем, у кого есть ссылка» (роль
                    «Читатель»).
                  </li>
                  <li>
                    <strong>Скопируйте ссылку</strong> — «Поделиться» → «Копировать ссылку»
                    и вставьте её в поле ниже.
                  </li>
                </ol>
                <p className="pdf-guide-note">
                  При нажатии «Читать» ссылка откроется в новой вкладке браузера.
                </p>
              </aside>
              <input
                required={!isEdit}
                type="url"
                value={form.pdf_url}
                onChange={set("pdf_url")}
                placeholder="https://drive.google.com/file/d/..."
              />
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
      {showCategoryModal && (
        <AddCategoryModal onClose={() => setShowCategoryModal(false)} onSaved={handleCategorySaved} />
      )}
    </>
  );
}
