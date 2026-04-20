import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  queryParams?: string;
}

export default function Pagination({ currentPage, totalPages, basePath, queryParams = "" }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: (number | "...")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  const getHref = (page: number) => {
    const sep = queryParams ? "&" : "?";
    return queryParams
      ? `${basePath}?${queryParams}${sep}page=${page}`
      : `${basePath}?page=${page}`;
  };

  return (
    <div className="flex items-center justify-center space-x-2 mt-12">
      {/* Prev */}
      {currentPage > 1 && (
        <Link
          href={getHref(currentPage - 1)}
          className="w-10 h-10 flex items-center justify-center border border-gray-200 hover:border-accent hover:text-accent transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
      )}

      {/* Pages */}
      {pages.map((page, i) =>
        page === "..." ? (
          <span key={`dots-${i}`} className="w-10 h-10 flex items-center justify-center text-gray-400 font-body text-sm">
            ...
          </span>
        ) : (
          <Link
            key={page}
            href={getHref(page as number)}
            className={`w-10 h-10 flex items-center justify-center font-body text-sm transition-colors ${
              page === currentPage
                ? "bg-accent text-white"
                : "border border-gray-200 hover:border-accent hover:text-accent"
            }`}
          >
            {page}
          </Link>
        )
      )}

      {/* Next */}
      {currentPage < totalPages && (
        <Link
          href={getHref(currentPage + 1)}
          className="w-10 h-10 flex items-center justify-center border border-gray-200 hover:border-accent hover:text-accent transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      )}
    </div>
  );
}
