import { useRef, useState } from 'react';
import { ResponseCard } from './ResponseCard';
import { useResponses } from '../../api/retrospective.queries';
import { QUESTION_CATEGORIES } from '../../model/constants';
import type { ResponseCategory, RetrospectQuestionItem } from '../../model/types';
import { cn } from '@/shared/lib/cn';

interface QuestionTabContentProps {
  retrospectId: number;
  questions: RetrospectQuestionItem[];
}

export function QuestionTabContent({ retrospectId, questions }: QuestionTabContentProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [openCommentId, setOpenCommentId] = useState<number | null>(null);
  const draftMapRef = useRef<Map<number, string>>(new Map());

  const handleToggleComment = (responseId: number) => {
    setOpenCommentId((prev) => (prev === responseId ? null : responseId));
  };

  const handleDraftChange = (responseId: number, content: string) => {
    draftMapRef.current.set(responseId, content);
  };
  const selectedCategory = QUESTION_CATEGORIES[selectedIndex] as ResponseCategory;

  const selectedQuestion = questions[selectedIndex];
  const { data } = useResponses(retrospectId, selectedCategory);
  const responses = data?.result?.responses ?? [];

  return (
    <div className="flex h-full gap-6 py-6 pl-6 pr-2">
      <nav className="flex w-[84px] shrink-0 flex-col gap-3">
        {questions.map((q, idx) => (
          <button
            key={q.index}
            type="button"
            className={cn(
              'cursor-pointer rounded-[8px] px-[25px] py-[8.5px] text-left text-sub-title-4 transition-colors',
              selectedIndex === idx ? 'bg-blue-200 text-blue-500' : 'bg-grey-100 text-grey-900'
            )}
            onClick={() => setSelectedIndex(idx)}
          >
            질문 {idx + 1}
          </button>
        ))}
      </nav>

      <div className="min-h-0 mt-6 flex-1 overflow-auto [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-grey-300">
        <div className="max-w-[840px]">
          {selectedQuestion && (
            <h2 className="text-title-3 text-grey-1000">{selectedQuestion.content}</h2>
          )}

          {responses.length === 0 && (
            <p className="py-8 text-center text-caption-3 text-grey-500">
              아직 작성된 응답이 없어요.
            </p>
          )}

          <div className="mt-4 flex flex-col">
            {responses.map((response) => (
              <ResponseCard
                key={response.responseId}
                response={response}
                openCommentId={openCommentId}
                onToggleComment={handleToggleComment}
                draft={draftMapRef.current.get(response.responseId) ?? ''}
                onDraftChange={handleDraftChange}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
