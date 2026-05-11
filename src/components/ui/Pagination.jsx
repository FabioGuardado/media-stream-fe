export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="flex items-center justify-center gap-2 mt-10" aria-label="Pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1.5 rounded-md text-sm text-muted hover:text-white hover:bg-card
                   disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        ← Prev
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          aria-current={page === currentPage ? 'page' : undefined}
          className={`
            w-9 h-9 rounded-md text-sm font-medium transition-all
            ${
              page === currentPage
                ? 'bg-accent text-white shadow-lg shadow-accent/30'
                : 'text-muted hover:text-white hover:bg-card'
            }
          `}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1.5 rounded-md text-sm text-muted hover:text-white hover:bg-card
                   disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        Next →
      </button>
    </nav>
  );
}
