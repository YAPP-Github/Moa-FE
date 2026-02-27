import { useRef, useState } from 'react';
import { RetrospectCard } from './RetrospectCard';
import type { RetrospectListItem } from '../model/schema';
import IcChevronRightGrey from '@/shared/ui/icons/IcChevronRightGrey';

const PAGE_SIZE = 10;
const MAX_VISIBLE_PAGES = 5;

/** 현재 페이지 중심으로 최대 5개 슬라이딩 윈도우 */
function getPageNumbers(current: number, total: number): number[] {
  if (total <= MAX_VISIBLE_PAGES) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  let start = current - Math.floor(MAX_VISIBLE_PAGES / 2);
  let end = start + MAX_VISIBLE_PAGES - 1;

  if (start < 1) {
    start = 1;
    end = MAX_VISIBLE_PAGES;
  }
  if (end > total) {
    end = total;
    start = total - MAX_VISIBLE_PAGES + 1;
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

interface RetrospectColumnProps {
  title: string;
  items: RetrospectListItem[];
  teamId: number;
}

export function RetrospectColumn({ title, items, teamId }: RetrospectColumnProps) {
  const [page, setPage] = useState(1);
  const scrollRef = useRef<HTMLDivElement>(null);

  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedItems = items.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const pageNumbers = getPageNumbers(currentPage, totalPages);

  const handlePageChange = (newPage: number) => {
    const clamped = Math.min(Math.max(1, newPage), totalPages);
    setPage(clamped);
    scrollRef.current?.scrollTo({ top: 0 });
  };

  return (
    <div className="flex flex-1 flex-col min-h-0">
      <div className="mb-3 flex items-center gap-1.5">
        <span className="text-caption-2 text-grey-900">{title}</span>
        <span className="text-caption-2 text-grey-900">{items.length}</span>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 min-h-0 overflow-y-auto scrollbar-hide flex flex-col gap-3 pb-10"
      >
        {paginatedItems.map((item) => (
          <RetrospectCard key={item.retrospectId} item={item} teamId={teamId} />
        ))}

        {totalPages > 1 && (
          <div className="mt-1 flex items-center gap-2">
            {/* Page numbers */}
            {pageNumbers.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => handlePageChange(p)}
                className={`flex h-7 w-7 items-center justify-center rounded-full text-sub-title-3 transition-colors ${
                  p === currentPage
                    ? 'bg-grey-200 text-grey-700'
                    : 'text-grey-600 hover:bg-grey-100'
                }`}
              >
                {p}
              </button>
            ))}

            {/* Prev */}
            <button
              type="button"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex h-7 w-7 items-center justify-center transition-opacity disabled:opacity-30"
            >
              <IcChevronRightGrey className="rotate-180" />
            </button>

            {/* Next */}
            <button
              type="button"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex h-7 w-7 items-center justify-center transition-opacity disabled:opacity-30"
            >
              <IcChevronRightGrey />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
