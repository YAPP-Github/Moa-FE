import { useEffect, useRef } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import {
  MAX_QUESTIONS,
  RETROSPECT_METHOD_LABELS,
  RetrospectMethod,
} from '@/features/retrospective/model/constants';
import {
  type CreateRetrospectFormData,
  ERROR_MESSAGES,
} from '@/features/retrospective/model/schema';
import { Button } from '@/shared/ui/button/Button';
import { IconButton } from '@/shared/ui/icon-button/IconButton';
import IcBack from '@/shared/ui/icons/IcBack';
import SvgIcClose from '@/shared/ui/icons/IcClose';
import SvgIcPlusBlue from '@/shared/ui/icons/IcPlusBlue';
import { useToast } from '@/shared/ui/toast/Toast';

interface QuestionsEditStepProps {
  onClose: () => void;
  onComplete: () => void;
}

export function QuestionsEditStep({ onClose, onComplete }: QuestionsEditStepProps) {
  const { control, register, watch } = useFormContext<CreateRetrospectFormData>();
  const { showToast } = useToast();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questions' as never,
  });

  const textareaRefs = useRef<(HTMLTextAreaElement | null)[]>([]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: fields 변경 시 textarea 높이 재계산 필요
  useEffect(() => {
    textareaRefs.current.forEach((el) => {
      if (!el) return;
      el.style.height = 'auto';
      el.style.height = `${el.scrollHeight}px`;
    });
  }, [fields]);

  const questions = watch('questions') || [];
  const retrospectMethod = watch('retrospectMethod');
  const methodLabel = RETROSPECT_METHOD_LABELS[retrospectMethod];
  const isFree = retrospectMethod === RetrospectMethod.FREE;

  const handleRemoveQuestion = (index: number) => {
    if (fields.length <= 1) {
      showToast({
        variant: 'warning',
        message: ERROR_MESSAGES.NO_QUESTIONS,
      });
      return;
    }
    remove(index);
  };

  const handleAddQuestion = () => {
    if (fields.length >= MAX_QUESTIONS) {
      return;
    }
    append('');
  };

  const handleComplete = () => {
    if (questions.length === 0) {
      showToast({
        variant: 'warning',
        message: ERROR_MESSAGES.NO_QUESTIONS,
      });
      return;
    }

    const hasEmptyQuestion = questions.some((q) => q.trim() === '');
    if (hasEmptyQuestion) {
      showToast({
        variant: 'warning',
        message: ERROR_MESSAGES.EMPTY_QUESTION,
      });
      return;
    }

    onComplete();
  };

  return (
    <div className="flex h-full flex-col">
      <div className="mb-6 flex items-center justify-between">
        <IconButton
          type="button"
          variant="ghost"
          size="sm"
          onClick={onComplete}
          aria-label="돌아가기"
        >
          <IcBack className="size-6" />
        </IconButton>
        <IconButton type="button" variant="ghost" size="sm" onClick={onClose} aria-label="닫기">
          <SvgIcClose className="size-6" />
        </IconButton>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-6 px-2">
        <div>
          <div className="flex flex-col">
            <span className="text-sub-title-2 text-grey-500">
              {isFree ? '자유 회고' : `${methodLabel} 회고`}
            </span>
            <span className="mt-1 text-title-2 text-grey-1000">전체 질문</span>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {fields.map((field, index) => {
            const { ref: registerRef, ...registerProps } = register(`questions.${index}`);
            return (
              <div key={field.id} className="flex items-center gap-3">
                <span className="shrink-0 text-caption-4 text-grey-600">질문 {index + 1}</span>
                <div className="min-w-0 flex-1">
                  <textarea
                    {...registerProps}
                    ref={(el) => {
                      registerRef(el);
                      textareaRefs.current[index] = el;
                    }}
                    placeholder="질문을 입력해주세요"
                    rows={1}
                    onInput={(e) => {
                      const el = e.currentTarget;
                      el.style.height = 'auto';
                      el.style.height = `${el.scrollHeight}px`;
                    }}
                    className="w-full resize-none overflow-hidden rounded-md border border-[#EBEBEB] px-4 py-2 text-caption-2 placeholder:text-caption-2 placeholder:text-[#BEBFC6] focus:outline-none focus-visible:border-[#3182F6]"
                  />
                </div>
                <IconButton
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveQuestion(index)}
                >
                  <SvgIcClose className="size-5" />
                </IconButton>
              </div>
            );
          })}

          {fields.length < MAX_QUESTIONS && (
            <button
              type="button"
              onClick={handleAddQuestion}
              className="flex items-center w-fit cursor-pointer gap-2 hover:bg-none"
            >
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-200">
                <SvgIcPlusBlue className="h-2 w-2" />
              </div>
              <span className="text-sub-title-3 text-blue-500">추가하기</span>
            </button>
          )}
        </div>
      </div>

      <div className="shrink-0 flex justify-end pt-4 px-2">
        <Button
          type="button"
          variant="tertiary"
          size="md"
          onClick={handleComplete}
          className="rounded-[8px] bg-grey-800 px-3 py-2 text-sub-title-4 text-grey-0 hover:bg-grey-900"
        >
          편집 완료
        </Button>
      </div>
    </div>
  );
}
