/**
 * SubmitConfirmModal - 회고 제출 확인 모달
 */

import { QuestionAnswerList } from './QuestionAnswerList';
import { Button } from '@/shared/ui/button/Button';
import {
  DialogClose,
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
  questions: string[];
  answers: string[];
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function SubmitConfirmModal({
  open,
  onOpenChange,
  questions,
  answers,
  onSubmit,
  isSubmitting,
}: SubmitConfirmModalProps) {
  return (
    <DialogRoot open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="bg-black/50" />
        <DialogContent
          className="w-[680px] rounded-2xl bg-white p-[32px] shadow-xl"
          hideCloseButton
        >
          <DialogHeader>
            <DialogTitle className="text-title-1 text-grey-1000">
              회고 내용을 확인해주세요
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="mt-2 text-caption-2 text-grey-900">
            작성하신 회고 내용을 다시 한번 확인해 주세요.
            <br />
            제출이 완료된 회고는 수정하실 수 없습니다.
          </DialogDescription>

          <div className="mt-[36px] max-h-[60vh] overflow-y-auto scrollbar-hide">
            <QuestionAnswerList questions={questions} answers={answers} />
          </div>

          <div className="mt-[32px] flex justify-end gap-2.5">
            <DialogClose>
              <Button
                variant="ghost"
                className="h-[36px] rounded-[8px] px-[19px] text-sub-title-2 text-grey-800"
              >
                취소
              </Button>
            </DialogClose>
            <Button
              variant="primary"
              onClick={onSubmit}
              disabled={isSubmitting}
              className="h-[36px] rounded-[8px] px-[19px] text-sub-title-2"
            >
              제출하기
            </Button>
          </div>
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
  );
}
