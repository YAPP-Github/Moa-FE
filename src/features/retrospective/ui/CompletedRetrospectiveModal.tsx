/**
 * CompletedRetrospectiveModal - 완료된 회고 모달
 *
 * 완료된 회고 리스트 클릭 시 중앙에 모달로 표시.
 * 좌우 화살표로 이전/이후 회고 탐색 가능.
 */

import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import { CompletedRetrospectiveView } from '@/features/retrospective/ui/CompletedRetrospectiveView';
import type { RetrospectListItem } from '@/shared/api/generated/index';
import {
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
} from '@/shared/ui/dialog/Dialog';
import { IconButton } from '@/shared/ui/icon-button/IconButton';
import IcChevronLeftFit from '@/shared/ui/icons/IcChevronLeftFit';
import IcClose from '@/shared/ui/icons/IcClose';

// ============================================================================
// Types
// ============================================================================

interface CompletedRetrospectiveModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  retrospects: RetrospectListItem[];
  initialIndex: number;
}

// ============================================================================
// Helpers
// ============================================================================

function formatRetrospectDate(dateStr: string): string {
  const date = new Date(dateStr);
  return format(date, 'yyyy년 M월 d일', { locale: ko });
}

// ============================================================================
// Component
// ============================================================================

function CompletedRetrospectiveModal({
  open,
  onOpenChange,
  retrospects,
  initialIndex,
}: CompletedRetrospectiveModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // initialIndex 변경 시 동기화
  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  const currentRetrospect = retrospects[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === retrospects.length - 1;
  const showNavigation = retrospects.length > 1;

  const handlePrev = () => {
    if (!isFirst) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (!isLast) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  if (!currentRetrospect) return null;

  return (
    <DialogRoot open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="bg-black/50" />
        <DialogContent
          hideCloseButton
          disableOutsideClick={false}
          className="flex items-center justify-center gap-7 sm:max-w-none max-w-none"
        >
          {/* 왼쪽 네비게이션 버튼 */}
          {showNavigation && (
            <button
              type="button"
              onClick={handlePrev}
              disabled={isFirst}
              className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white/70 transition-opacity disabled:cursor-default disabled:opacity-50"
              aria-label="이전 회고"
            >
              <IcChevronLeftFit className="h-4 w-4" />
            </button>
          )}

          {/* 모달 본체 */}
          <div className="flex max-h-[calc(100vh-160px)] w-full max-w-[680px] flex-col rounded-2xl bg-white shadow-[0px_4px_24px_0px_rgba(0,0,0,0.12)]">
            {/* 헤더: 날짜 + 제목 + 닫기 */}
            <div className="relative shrink-0 px-8 pt-8 pb-0">
              <IconButton
                variant="ghost"
                size="md"
                onClick={() => onOpenChange(false)}
                className="absolute right-5 top-5"
                aria-label="닫기"
              >
                <IcClose className="h-6 w-6" />
              </IconButton>

              <p className="text-caption-4 text-grey-600">
                {formatRetrospectDate(currentRetrospect.retrospectDate)}
              </p>
              <DialogTitle className="mt-1 text-title-1 text-grey-1000">
                {currentRetrospect.projectName}
              </DialogTitle>
            </div>

            {/* CompletedRetrospectiveView (탭 + 콘텐츠) */}
            <div className="mt-5 flex-1 overflow-hidden px-3 pb-8">
              <CompletedRetrospectiveView
                key={currentRetrospect.retrospectId}
                retrospectId={currentRetrospect.retrospectId}
                projectName={currentRetrospect.projectName}
                retrospectMethod={currentRetrospect.retrospectMethod}
                participantCount={currentRetrospect.participantCount ?? 0}
                totalParticipants={12}
                hideTitle
              />
            </div>
          </div>

          {/* 오른쪽 네비게이션 버튼 */}
          {showNavigation && (
            <button
              type="button"
              onClick={handleNext}
              disabled={isLast}
              className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white/70 transition-opacity disabled:cursor-default disabled:opacity-50"
              aria-label="다음 회고"
            >
              <IcChevronLeftFit className="h-4 w-4 rotate-180" />
            </button>
          )}
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
  );
}

export { CompletedRetrospectiveModal, type CompletedRetrospectiveModalProps };
