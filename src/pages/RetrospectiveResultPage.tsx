import { useState } from 'react';
import { Navigate, useParams } from 'react-router';
import { Button } from '@/components/ui/button';
import { useRetrospectiveStore } from '@/store/retrospective';

export function RetrospectiveResultPage() {
  const { id } = useParams<{ id: string }>();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const retrospectives = useRetrospectiveStore((state) => state.retrospectives);

  const retrospective = retrospectives.find((r) => r.id === id);
  if (!retrospective) {
    return <Navigate to="/retrospective" replace />;
  }

  const totalQuestions = retrospective.totalQuestions;
  const currentQuestion = currentQuestionIndex + 1;
  const currentQuestionData = retrospective.questions[currentQuestionIndex];

  const currentQuestionAnswers = retrospective.answers.filter(
    (answer) => answer.questionIndex === currentQuestionIndex
  );

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      window.location.href = '/retrospective';
    }
  };

  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  if (retrospective.answers.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="flex flex-col gap-3.5 items-center">
          <h1 className="text-3xl font-bold">회고 결과</h1>
          <p className="text-xl">아직 작성된 답변이 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-col gap-14 p-8">
      <div className="flex w-full justify-between">
        <div className="flex flex-col gap-3">
          <div>
            <span className="text-lg font-bold text-[#1C8AFF]">질문 {currentQuestion}</span>{' '}
            <span className="text-lg font-bold text-[#00000042]">/{totalQuestions}</span>
          </div>
          <h2 className="text-3xl font-bold">{currentQuestionData?.title}</h2>
        </div>
        <Button onClick={handleNext}>{isLastQuestion ? '완료' : '다음'}</Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {currentQuestionAnswers.map((answer) => {
          const participant = retrospective.participants.find((p) => p.id === answer.participantId);
          return (
            <div key={answer.participantId} className="flex flex-col rounded-[20px] bg-white p-6">
              <h3 className="text-lg font-bold text-black mb-4">답변 내용</h3>
              <p className="flex-1 text-base text-[#2C2C2C] whitespace-pre-wrap">
                {answer.content}
              </p>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm font-semibold text-[#1E1E1E]">{participant?.name}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
