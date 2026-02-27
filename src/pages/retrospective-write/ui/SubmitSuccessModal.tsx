/**
 * SubmitSuccessModal - 회고 제출 완료 모달
 */

import { Button } from '@/shared/ui/button/Button';
import { DialogContent, DialogOverlay, DialogPortal, DialogRoot } from '@/shared/ui/dialog/Dialog';
import IcCheckBlueBgLightblue from '@/shared/ui/icons/IcCheckBlueBgLightblue';

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
        <DialogContent hideCloseButton className="w-[300px] rounded-2xl bg-white p-5 shadow-xl">
          <div className="flex flex-col items-center">
            <IcCheckBlueBgLightblue />

            <div className="mt-3 flex flex-col items-center gap-1">
              <h2 className="text-title-2 text-grey-1000">회고가 제출되었어요</h2>
              <p className="text-caption-4 text-grey-800">팀원들의 회고 내용을 확인할까요?</p>
            </div>

            <div className="mt-7 flex w-full justify-end gap-2">
              <Button
                variant="tertiary"
                onClick={onClose}
                className="rounded-[8px] px-[10px] py-[8px] text-sub-title-4 leading-[140%]"
              >
                닫기
              </Button>
              <Button
                variant="primary"
                onClick={onConfirm}
                className="rounded-[8px] px-[10px] py-[8px] text-sub-title-4 leading-[140%]"
              >
                확인하기
              </Button>
            </div>
          </div>
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
  );
}
