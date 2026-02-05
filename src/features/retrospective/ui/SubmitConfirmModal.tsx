/**
 * SubmitConfirmModal - 회고 제출 확인 모달
 *
 * 회고 작성 완료 후 제출하기 버튼 클릭 시 표시되는 확인 모달입니다.
 * 확인 클릭 시 최종 제출, 취소 클릭 시 모달만 닫힙니다.
 */

import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
} from '@/shared/ui/dialog/Dialog';

interface SubmitConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function SubmitConfirmModal({ open, onOpenChange, onConfirm }: SubmitConfirmModalProps) {
  const handleCancel = () => {
    onOpenChange(false);
  };

  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <DialogRoot open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="bg-black/50" />
        <DialogContent
          className="w-auto max-w-none rounded-2xl bg-white p-5 shadow-xl"
          hideCloseButton
        >
          {/* 접근성용 숨김 제목 */}
          <DialogHeader className="sr-only">
            <DialogTitle>제출 확인</DialogTitle>
          </DialogHeader>

          {/* 제목 */}
          <h2 className="text-title-2 text-grey-1000">최종 제출할까요?</h2>

          {/* 설명 */}
          <DialogDescription className="mt-1 text-caption-1 text-grey-800">
            제출 후에는 내용을 수정할 수 없어요.
          </DialogDescription>

          {/* 버튼 영역 */}
          <div className="mt-6 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={handleCancel}
              className="cursor-pointer rounded-lg bg-grey-100 px-5 py-1.5 text-sub-title-2 text-grey-900 transition-colors hover:bg-grey-200"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="cursor-pointer rounded-lg bg-blue-500 px-5 py-1.5 text-sub-title-2 text-white transition-colors hover:bg-blue-600"
            >
              확인
            </button>
          </div>
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
  );
}
