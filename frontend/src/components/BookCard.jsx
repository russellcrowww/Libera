const COVER_GRADIENTS = [
  "linear-gradient(135deg, #6366f1, #a855f7)",
  "linear-gradient(135deg, #06b6d4, #3b82f6)",
  "linear-gradient(135deg, #f43f5e, #fb923c)",
  "linear-gradient(135deg, #10b981, #14b8a6)",
  "linear-gradient(135deg, #8b5cf6, #ec4899)",
  "linear-gradient(135deg, #f59e0b, #ef4444)",
];

function getCoverGradient(id) {
  return COVER_GRADIENTS[id % COVER_GRADIENTS.length];
}

export default function BookCard({ book, onEdit, onDelete, onRead }) {
  const gradient = getCoverGradient(book.id);
  const canRead = Boolean(book.pdf_url);

  return (
    <article className="book-card">
      <div className="book-card-accent" style={{ background: gradient }} />
      <div className="book-cover-wrap">
        {book.image_url ? (
          <img src={book.image_url} alt={book.name} className="book-img" />
        ) : (
          <div className="book-cover-placeholder" style={{ background: gradient }}>
            <span className="book-icon">📖</span>
          </div>
        )}
      </div>
      <div className="book-info">
        <h3 className="book-name">{book.name}</h3>
        <p className="book-author">{book.author}</p>
        {book.description && <p className="book-desc">{book.description}</p>}
        <div className="book-meta">
          <span className="book-tag">{book.genre}</span>
          <span className="book-tag">{book.year}</span>
          {book.category && (
            <span className="book-tag book-tag-cat">{book.category.name}</span>
          )}
        </div>
        <div className="book-actions">
          <button
            type="button"
            className="book-action-btn book-action-btn--read"
            onClick={() => onRead?.(book)}
            disabled={!canRead}
            title={
              canRead
                ? "Открыть PDF"
                : "Добавьте ссылку на PDF при редактировании"
            }
          >
            ▶ Читать
          </button>
          <button
            type="button"
            className="book-action-btn"
            onClick={() => onEdit?.(book)}
          >
            Изменить
          </button>
          <button
            type="button"
            className="book-action-btn danger"
            onClick={() => onDelete?.(book)}
          >
            Удалить
          </button>
        </div>
      </div>
    </article>
  );
}
