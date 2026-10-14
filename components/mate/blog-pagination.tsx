import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import type { JSX } from 'react';

interface BlogPaginationProps {
  currentPage: number;
  totalPages: number;
  basePath?: string;
}

function pageHref(basePath: string, page: number): string {
  return page === 1 ? basePath : `${basePath}/page/${page}`;
}

/** Builds the numbered page list with ellipsis, e.g. [1, '…', 4, 5, 6, '…', 12] */
function pageItems(current: number, total: number): (number | '…')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages = new Set<number>([1, 2, current - 1, current, current + 1, total - 1, total]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const items: (number | '…')[] = [];
  let prev = 0;
  for (const p of sorted) {
    if (p - prev > 1) items.push('…');
    items.push(p);
    prev = p;
  }
  return items;
}

const linkClass =
  'inline-flex h-9 min-w-9 items-center justify-center rounded-md border border-border/50 bg-background/95 px-3 text-sm font-medium text-muted-foreground backdrop-blur transition-colors hover:border-border hover:text-foreground';
const activeClass =
  'inline-flex h-9 min-w-9 items-center justify-center rounded-md border border-primary bg-primary px-3 text-sm font-medium text-primary-foreground';

export function BlogPagination({ currentPage, totalPages, basePath = '/blog' }: BlogPaginationProps): JSX.Element | null {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Blog pagination" className="mt-10 flex items-center justify-center gap-2">
      {currentPage > 1 ? (
        <Link href={pageHref(basePath, currentPage - 1)} className={linkClass} aria-label="Previous page">
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only sm:not-sr-only sm:ml-1">Previous</span>
        </Link>
      ) : (
        <span className={`${linkClass} cursor-not-allowed opacity-40`} aria-disabled="true">
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only sm:not-sr-only sm:ml-1">Previous</span>
        </span>
      )}

      {pageItems(currentPage, totalPages).map((item, i) =>
        item === '…' ? (
          <span key={`ellipsis-${i}`} className="px-1 text-sm text-muted-foreground" aria-hidden="true">
            …
          </span>
        ) : (
          <Link
            key={item}
            href={pageHref(basePath, item)}
            className={item === currentPage ? activeClass : linkClass}
            aria-label={`Page ${item}`}
            aria-current={item === currentPage ? 'page' : undefined}
          >
            {item}
          </Link>
        ),
      )}

      {currentPage < totalPages ? (
        <Link href={pageHref(basePath, currentPage + 1)} className={linkClass} aria-label="Next page">
          <span className="sr-only sm:not-sr-only sm:mr-1">Next</span>
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <span className={`${linkClass} cursor-not-allowed opacity-40`} aria-disabled="true">
          <span className="sr-only sm:not-sr-only sm:mr-1">Next</span>
          <ChevronRight className="h-4 w-4" />
        </span>
      )}
    </nav>
  );
}
