export default function Sidebar() {
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
        <div className="nav-item active">
          <span className="nav-icon">📚</span>
          <span>Книги</span>
        </div>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-version">v1.0</div>
      </div>
    </aside>
  );
}
