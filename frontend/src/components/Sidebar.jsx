export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="sidebar-logo-badge">L</span>
        <div>
          <div className="sidebar-title">Libera</div>
          <div className="sidebar-subtitle">read · discover · vibe</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-item active">
          <span className="nav-icon">📚</span>
          <span>Каталог</span>
        </div>
      </nav>

      <div className="sidebar-tip">
        <p>Добавляй категории прямо в фильтрах — без лишних вкладок.</p>
      </div>

      <div className="sidebar-footer">
        <span className="sidebar-version">v2 · youth edition</span>
      </div>
    </aside>
  );
}
