const COVER_COLORS = [
  "#8B5E3C", "#6B7C5B", "#7B6E9E", "#C4956A",
  "#5B7B8C", "#9E6B6B", "#7B8C5B", "#8C7B5B",
];

function getCoverColor(id) {
  return COVER_COLORS[id % COVER_COLORS.length];
}

export default function BookCard({ book }) {
  const color = getCoverColor(book.id);

  return (
    <div className="book-card">
      <div className="book-spine" style={{ background: color }} />
      <div className="book-cover" style={{ borderLeftColor: color }}>
        {book.image_url ? (
          <img src={book.image_url} alt={book.name} className="book-img" />
        ) : (
          <div className="book-cover-placeholder" style={{ background: color + "22" }}>
            <span className="book-icon">📖</span>
          </div>
        )}
      </div>
      <div className="book-info">
        <h3 className="book-name">{book.name}</h3>
        <p className="book-author">{book.author}</p>
        {book.description && (
          <p className="book-desc">{book.description}</p>
        )}
        <div className="book-meta">
          <span className="book-tag">{book.genre}</span>
          <span className="book-tag">{book.year}</span>
          {book.category && (
            <span className="book-tag book-tag-cat">{book.category.name}</span>
          )}
        </div>
      </div>
    </div>
  );
}
