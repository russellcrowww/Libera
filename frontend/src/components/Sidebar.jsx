export default function Sidebar({ page, setPage }) {
  const nav = [
    { id: "books", label: "Книги", icon: "📚" },
    { id: "categories", label: "Категории", icon: "🗂" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="sidebar-logo-icon">📕</span>
        <div>
          <div className="sidebar-title">Libera</div>
          <div className="sidebar-subtitle">Библиотека</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {nav.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${page === item.id ? "active" : ""}`}
            onClick={() => setPage(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-version">v1.0</div>
      </div>
    </aside>
  );
}
