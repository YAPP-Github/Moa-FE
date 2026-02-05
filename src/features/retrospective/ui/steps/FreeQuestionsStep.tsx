import { useEffect } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import {
  type CreateRetrospectFormData,
  ERROR_MESSAGES,
} from '@/features/retrospective/model/schema';
import { FormHeader } from '@/features/retrospective/ui/steps/FormHeader';
import { StepIndicator } from '@/features/retrospective/ui/steps/StepIndicator';
import { Button } from '@/shared/ui/button/Button';
import { IconButton } from '@/shared/ui/icon-button/IconButton';
import SvgIcClose from '@/shared/ui/icons/IcClose';
import SvgIcPlusBlue from '@/shared/ui/icons/IcPlusBlue';
import { Input } from '@/shared/ui/input/Input';
import { useStepContext } from '@/shared/ui/multi-step-form/MultiStepForm';
import { useToast } from '@/shared/ui/toast/Toast';

interface FreeQuestionsStepProps {
  onClose: () => void;
}

const MAX_QUESTIONS = 5;

export function FreeQuestionsStep({ onClose }: FreeQuestionsStepProps) {
  const { control, register, setValue, watch } = useFormContext<CreateRetrospectFormData>();
  const { goToNextStep } = useStepContext();
  const { showToast } = useToast();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'freeQuestions' as never,
  });

  const freeQuestions = watch('freeQuestions') || [];

  // 스텝 마운트 시 질문 초기화 (최초 1회만 실행)
  // biome-ignore lint/correctness/useExhaustiveDependencies: 마운트 시 1회만 실행
  useEffect(() => {
    setValue('freeQuestions', ['']);
  }, []);

  const handleAddQuestion = () => {
    if (fields.length >= MAX_QUESTIONS) {
      return;
    }
    append('');
  };

  const handleNext = async () => {
    // 질문이 하나도 없는 경우
    if (freeQuestions.length === 0) {
      showToast({
        variant: 'warning',
        message: ERROR_MESSAGES.NO_QUESTIONS,
      });
      return;
    }

    // 빈 문자열 필드가 있는 경우
    const hasEmptyQuestion = freeQuestions.some((q) => q.trim() === '');
    if (hasEmptyQuestion) {
      showToast({
        variant: 'warning',
        message: ERROR_MESSAGES.EMPTY_QUESTION,
      });
      return;
    }

    await goToNextStep();
  };

  return (
    <div className="flex h-full flex-col">
      <FormHeader onClose={onClose} />

      <div className="flex min-h-0 flex-1 flex-col gap-6">
        <div>
          <StepIndicator />
          <div className="flex flex-col">
            <span className="text-title-2 text-grey-1000">자유 회고 질문을 입력해주세요</span>
            <span className="mt-1 text-body-2 text-grey-700">
              팀원들이 답변할 질문을 직접 만들어보세요
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-3">
              <span className="shrink-0 text-caption-4 text-grey-600">질문 {index + 1}</span>
              <div className="min-w-0 flex-1">
                <Input {...register(`freeQuestions.${index}`)} placeholder="질문을 입력해주세요" />
              </div>
              <IconButton variant="ghost" size="sm" onClick={() => remove(index)}>
                <SvgIcClose className="size-5" />
              </IconButton>
            </div>
          ))}

          {fields.length < MAX_QUESTIONS && (
            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={handleAddQuestion}
              className="w-fit gap-2 text-blue-500 hover:bg-blue-50"
            >
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-200">
                <SvgIcPlusBlue className="h-2 w-2" />
              </div>
              <span>질문 추가하기</span>
            </Button>
          )}
        </div>
      </div>

      <div className="shrink-0 flex justify-end pt-4">
        <Button type="button" variant="primary" size="lg" onClick={handleNext}>
          다음
        </Button>
      </div>
    </div>
  );
}
