/**
 * PreviewModal - 회고 미리보기 모달
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

interface PreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  questions: string[];
  answers: string[];
}

export function PreviewModal({ open, onOpenChange, questions, answers }: PreviewModalProps) {
  return (
    <DialogRoot open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="bg-black/50" />
        <DialogContent className="w-[680px] rounded-2xl bg-white p-[32px] shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-title-2 text-grey-1000">미리보기</DialogTitle>
            <DialogDescription className="sr-only">
              작성한 회고 내용을 미리 확인합니다.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-[36px] max-h-[60vh] overflow-y-auto scrollbar-hide">
            <QuestionAnswerList questions={questions} answers={answers} />
          </div>

          <div className="mt-6 flex justify-end">
            <DialogClose>
              <Button
                variant="tertiary"
                className="h-[36px] rounded-[8px] bg-grey-800 px-[19px] text-sub-title-2 text-white hover:bg-grey-900"
              >
                닫기
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
  );
}
