"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

export default function TablePagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      pages.push(i);
    } else if (
      (i === currentPage - 2 && i > 1) ||
      (i === currentPage + 2 && i < totalPages)
    ) {
      pages.push("...");
    }
  }

  const uniquePages = pages.filter((val, i, arr) => val !== arr[i - 1]);

  return (
    <div className="flex items-center justify-center gap-1 sm:gap-2 mt-6 text-sm font-medium text-foreground-soft">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="cursor-pointer flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-background transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft size={16} strokeWidth={2.5} />
        <span className="hidden sm:inline">Previous</span>
      </button>

      {uniquePages.map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === "number" && onPageChange(page)}
          disabled={typeof page !== "number"}
          className={`min-w-8 h-8 px-2 flex items-center justify-center rounded-xl transition-colors ${
            page === currentPage
              ? "bg-white border border-border text-foreground shadow-xs font-semibold"
              : typeof page === "number" && "hover:bg-background cursor-pointer"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="cursor-pointer flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-background transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight size={16} strokeWidth={2.5} />
      </button>
    </div>
  );
}
