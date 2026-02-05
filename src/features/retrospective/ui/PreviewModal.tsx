/**
 * PreviewModal - 회고 미리보기 모달
 *
 * 미리보기 버튼 클릭 시 모든 질문과 답변을 한눈에 확인할 수 있는 모달입니다.
 */

import {
  DialogContent,
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
  const handleConfirm = () => {
    onOpenChange(false);
  };

  return (
    <DialogRoot open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="bg-black/50" />
        <DialogContent
          className="w-[680px] max-w-none sm:max-w-none rounded-2xl bg-white p-8 shadow-xl"
          hideCloseButton
        >
          {/* 접근성용 숨김 제목 */}
          <DialogHeader className="sr-only">
            <DialogTitle>회고 미리보기</DialogTitle>
          </DialogHeader>

          {/* 제목 */}
          <h2 className="text-title-1 text-grey-1000">미리보기</h2>

          {/* 질문 목록 */}
          <div className="mt-7 flex flex-col gap-6">
            {questions.map((question, index) => {
              const answer = answers[index]?.trim();
              const hasAnswer = !!answer;

              return (
                <div
                  key={`preview-question-${question.slice(0, 20)}`}
                  className="flex flex-col gap-3"
                >
                  {/* 질문 */}
                  <div>
                    <span className="text-title-6 text-blue-500">질문 {index + 1} </span>
                    <span className="text-title-6 text-grey-1000">{question}</span>
                  </div>

                  {/* 답변 (있을 때만 표시) */}
                  {hasAnswer && (
                    <div className="flex">
                      {/* 좌측 세로선 */}
                      <div className="w-0.5 shrink-0 rounded-full bg-grey-200" />
                      {/* 답변 텍스트 */}
                      <p className="ml-3.5 whitespace-pre-wrap text-caption-2 text-grey-1000">
                        {answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* 확인 버튼 */}
          <div className="mt-6 flex justify-end">
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
