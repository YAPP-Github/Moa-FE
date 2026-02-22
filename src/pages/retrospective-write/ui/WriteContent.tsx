/**
 * WriteContent - 질문 네비게이션 + 텍스트 입력 + AI 어시스턴트
 */

import type { GuideItem } from '@/features/retrospective/model/types';
import { Button } from '@/shared/ui/button/Button';
import IcAiSpark from '@/shared/ui/icons/IcAiSpark';
import IcRefresh from '@/shared/ui/icons/IcRefresh';

interface WriteContentProps {
  questions: string[];
  currentQuestionIndex: number;
  currentAnswer: string;
  maxLength: number;
  onAnswerChange: (value: string) => void;
  onPrevQuestion: () => void;
  onNextQuestion: () => void;
  assistantGuides: GuideItem[] | undefined;
  isAssistantLoading: boolean;
  onAssistantGenerate: () => void;
}

const GRADIENT_BORDER_STYLE = {
  backgroundImage: 'linear-gradient(white, white), linear-gradient(to right, #98C1FA, #A6ECD5)',
  backgroundOrigin: 'padding-box, border-box',
  backgroundClip: 'padding-box, border-box',
  border: '1px solid transparent',
} as const;

function AssistantLabel({ children }: { children: string }) {
  return (
    <div className="flex items-center gap-[4px]">
      <IcAiSpark className="h-[18px] w-[18px]" />
      <span className="bg-linear-to-r from-[#3182F6] to-[#52E79D] bg-clip-text text-[13px] font-bold leading-[140%] text-transparent">
        {children}
      </span>
    </div>
  );
}

function AssistantSection({
  guides,
  isLoading,
  onGenerate,
}: {
  guides: GuideItem[] | undefined;
  isLoading: boolean;
  onGenerate: () => void;
}) {
  if (!guides && !isLoading) {
    return (
      <button
        type="button"
        onClick={onGenerate}
        className="flex h-[36px] cursor-pointer items-center rounded-[23px] border border-transparent bg-white px-[10px]"
        style={GRADIENT_BORDER_STYLE}
      >
        <AssistantLabel>회고 어시스턴트</AssistantLabel>
      </button>
    );
  }

  if (isLoading) {
    return (
      <div
        className="inline-flex h-[36px] items-center rounded-[23px] border border-transparent bg-white px-[10px]"
        style={GRADIENT_BORDER_STYLE}
      >
        <AssistantLabel>생성중</AssistantLabel>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-[10px] rounded-[10px] bg-grey-50 p-5">
        <AssistantLabel>회고 어시스턴트</AssistantLabel>
        <ul className="flex flex-col gap-4">
          {guides?.map((guide) => (
            <li key={guide.title} className="flex gap-2">
              <div className="mt-[6px] h-[6px] w-[6px] shrink-0 rounded-full bg-grey-900" />
              <div className="flex-1">
                <p className="text-[14px] font-bold leading-[140%] text-grey-900">{guide.title}</p>
                <p className="text-[14px] font-medium leading-[140%] text-grey-900">
                  {guide.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <button
        type="button"
        onClick={onGenerate}
        className="mt-3 flex cursor-pointer items-center gap-2 text-grey-500"
      >
        <IcRefresh width={12} height={12} />
        <span className="text-sub-title-6">다시 생성</span>
      </button>
    </>
  );
}

export function WriteContent({
  questions,
  currentQuestionIndex,
  currentAnswer,
  maxLength,
  onAnswerChange,
  onPrevQuestion,
  onNextQuestion,
  assistantGuides,
  isAssistantLoading,
  onAssistantGenerate,
}: WriteContentProps) {
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  return (
    <div className="pb-6">
      {/* Question Navigation */}
      <div className="flex items-center justify-between">
        <span className="flex h-[28px] items-center rounded-[6px] bg-grey-100 px-[10px] text-[13px] font-semibold leading-none text-grey-1000">
          질문 {currentQuestionIndex + 1}
        </span>

        <div className="flex items-center gap-[10px]">
          <Button
            variant="tertiary"
            onClick={onPrevQuestion}
            disabled={isFirstQuestion}
            className={`h-[28px] rounded-[6px] px-[10px] text-[13px] leading-none ${
              isFirstQuestion ? 'text-grey-400' : 'text-grey-1000'
            }`}
            aria-label="이전 질문"
          >
            &lt; 이전
          </Button>
          <Button
            variant="tertiary"
            onClick={onNextQuestion}
            disabled={isLastQuestion}
            className={`h-[28px] rounded-[6px] px-[10px] text-[13px] leading-none ${
              isLastQuestion ? 'text-grey-400' : 'text-grey-1000'
            }`}
            aria-label="다음 질문"
          >
            다음 &gt;
          </Button>
        </div>
      </div>

      {/* Question Text */}
      <h2 className="mt-4 text-[18px] font-bold leading-[150%] text-grey-1000">
        {questions[currentQuestionIndex]}
      </h2>

      {/* Textarea */}
      <div className="mt-3">
        <textarea
          value={currentAnswer}
          onChange={(e) => onAnswerChange(e.target.value)}
          maxLength={maxLength}
          placeholder="회고 내용을 입력해주세요"
          className="h-32 w-full resize-none rounded-md border border-grey-200 px-[16px] py-3 text-caption-2 text-grey-900 placeholder:text-caption-2 placeholder:text-grey-400 focus:border-blue-500 focus:outline-none"
        />
        <div className="text-right text-caption-3-medium text-grey-500">
          <span className={currentAnswer.length > 0 ? 'text-grey-900' : ''}>
            {currentAnswer.length}
          </span>
          /{maxLength}
        </div>
      </div>

      {/* AI Assistant */}
      <div className="mt-6">
        <AssistantSection
          guides={assistantGuides}
          isLoading={isAssistantLoading}
          onGenerate={onAssistantGenerate}
        />
      </div>
    </div>
  );
}
