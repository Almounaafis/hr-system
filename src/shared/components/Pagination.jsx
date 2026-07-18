import { ChevronRight, ChevronLeft } from "lucide-react";
import { useMemo } from "react";

function Pagination({ currentPage, totalPages, onPageChange }) {

  const pagesToShow = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages = [];
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) pages.push('...');
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  }, [currentPage, totalPages]);

  return (
    <div className="flex items-center justify-center gap-1.5 pt-4">
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        className="h-7 bg-background border border-[#EEEEEE] w-7 flex items-center justify-center rounded-md text-gray-400 disabled:opacity-40 hover:bg-gray-50 transition-colors"
        aria-label="الصفحة السابقة"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      {pagesToShow.map((p, idx) => (
        p === '...' ? (
          <span key={`ellipsis-${idx}`} className="px-1 text-xs text-gray-400">…</span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            className={`h-7 w-7 flex items-center justify-center rounded-full text-xs font-medium transition-colors ${
              Number(currentPage) === Number(p) ? "bg-teal-600 text-white" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            {p}
          </button>
        )
      ))}

      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        className="h-7 bg-background border border-[#EEEEEE] w-7 flex items-center justify-center rounded-md text-gray-400 disabled:opacity-40 hover:bg-gray-50 transition-colors"
        aria-label="الصفحة التالية"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
    </div>
  );
}

export default Pagination;