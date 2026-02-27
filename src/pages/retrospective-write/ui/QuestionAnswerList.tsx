/**
 * QuestionAnswerList - 질문/답변 목록 (PreviewModal, SubmitConfirmModal 공용)
 */

interface QuestionAnswerListProps {
  questions: string[];
  answers: string[];
}

export function QuestionAnswerList({ questions, answers }: QuestionAnswerListProps) {
  return (
    <div className="flex flex-col gap-5">
      {questions.map((question, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: 질문 목록은 정렬 고정, 동일 내용 질문 가능
        <div key={index} className="flex flex-col gap-3">
          <div className="flex h-[34px] items-center rounded-[4px] bg-grey-100 px-2.5">
            <p className="text-title-6">
              <span className="text-blue-500">질문 {index + 1}.</span>{' '}
              <span className="text-grey-1000">{question}</span>
            </p>
          </div>
          <div className="flex gap-2.5">
            <div className="w-[2px] shrink-0 self-stretch rounded-[5px] bg-grey-200" />
            <p className="min-w-0 whitespace-pre-wrap break-words text-caption-2 text-grey-1000">
              {answers[index]}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
