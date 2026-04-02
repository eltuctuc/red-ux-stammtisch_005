import './EmptyState.css'

export function EmptyState() {
  return (
    <div className="empty-state">
      <svg
        className="empty-state__icon"
        aria-hidden="true"
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="9 11 12 14 22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
      <p className="empty-state__title">Noch keine Todos.</p>
      <p className="empty-state__hint">Einfach oben tippen und Enter drücken.</p>
    </div>
  )
}
