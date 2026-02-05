/**
 * CloseConfirmModal - 회고 패널 닫기 확인 모달
 *
 * 작성 중인 내용이 임시저장 버전과 다를 때 패널을 닫으려 하면 표시됩니다.
 * 임시저장 클릭 시 저장 후 닫기, 나가기 클릭 시 저장 없이 닫기.
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

interface CloseConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
  onLeave: () => void;
}

export function CloseConfirmModal({ open, onOpenChange, onSave, onLeave }: CloseConfirmModalProps) {
  const handleSave = () => {
    onSave();
    onOpenChange(false);
  };

  const handleLeave = () => {
    onLeave();
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
            <DialogTitle>닫기 확인</DialogTitle>
          </DialogHeader>

          {/* 제목 */}
          <h2 className="text-title-2 text-grey-1000">정말 나가시겠어요?</h2>

          {/* 설명 */}
          <DialogDescription className="mt-1 text-caption-1 text-grey-800">
            저장하지 않은 내용은 모두 사라져요.
          </DialogDescription>

          {/* 버튼 영역 */}
          <div className="mt-6 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={handleSave}
              className="cursor-pointer rounded-lg bg-grey-100 px-5 py-1.5 text-sub-title-2 text-grey-900 transition-colors hover:bg-grey-200"
            >
              임시저장
            </button>
            <button
              type="button"
              onClick={handleLeave}
              className="cursor-pointer rounded-lg bg-blue-500 px-5 py-1.5 text-sub-title-2 text-white transition-colors hover:bg-blue-600"
            >
              나가기
            </button>
          </div>
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
  );
}
