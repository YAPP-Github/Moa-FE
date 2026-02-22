/**
 * SubmitSuccessModal - 회고 제출 완료 모달
 */

import { Button } from '@/shared/ui/button/Button';
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
} from '@/shared/ui/dialog/Dialog';

interface SubmitSuccessModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function SubmitSuccessModal({ open, onClose, onConfirm }: SubmitSuccessModalProps) {
  return (
    <DialogRoot open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogPortal>
        <DialogOverlay className="bg-black/50" />
        <DialogContent className="w-[434px] rounded-2xl bg-white px-[20px] py-[28px] shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-title-2 text-grey-1000">회고가 제출되었어요!</DialogTitle>
            <DialogDescription className="mt-[4px] text-caption-5 text-grey-800">
              팀원들의 회고 내용을 함께 확인하러갈까요?
            </DialogDescription>
          </DialogHeader>

          <div className="mt-5 flex justify-center">
            <div className="h-[386px] w-[378px] rounded-lg bg-grey-100" />
          </div>

          <div className="mt-[32px] flex justify-end">
            <Button
              variant="primary"
              onClick={onConfirm}
              className="h-[32px] rounded-[8px] px-[10px] text-sub-title-2"
            >
              확인하기
            </Button>
          </div>
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
  );
}
