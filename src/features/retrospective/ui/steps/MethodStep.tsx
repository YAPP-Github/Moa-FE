import { useRef, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { RETROSPECT_METHOD_DETAILS } from '@/features/retrospective/model/constants';
import type { CreateRetrospectFormData } from '@/features/retrospective/model/schema';
import { FormHeader } from '@/features/retrospective/ui/steps/FormHeader';
import { MethodSelector } from '@/features/retrospective/ui/steps/MethodSelector';
import { QuestionsEditStep } from '@/features/retrospective/ui/steps/QuestionsEditStep';
import { StepIndicator } from '@/features/retrospective/ui/steps/StepIndicator';
import { Button } from '@/shared/ui/button/Button';
import { useStepContext } from '@/shared/ui/multi-step-form/MultiStepForm';

interface MethodStepProps {
  onClose: () => void;
}

export function MethodStep({ onClose }: MethodStepProps) {
  const { control, watch, setValue, getValues } = useFormContext<CreateRetrospectFormData>();
  const { goToNextStep } = useStepContext();
  const [isEditingQuestions, setIsEditingQuestions] = useState(false);
  const questionsCache = useRef<Record<string, string[]>>({});

  const retrospectMethod = watch('retrospectMethod');

  const handleMethodChange = (method: string, fieldOnChange: (value: string) => void) => {
    // 현재 방식의 질문을 캐시에 저장
    const currentMethod = getValues('retrospectMethod');
    if (currentMethod) {
      questionsCache.current[currentMethod] = [...getValues('questions')];
    }

    fieldOnChange(method);

    // 캐시에 있으면 복원, 없으면 상수에서 초기화
    if (questionsCache.current[method]) {
      setValue('questions', [...questionsCache.current[method]]);
    } else {
      const defaultQuestions = RETROSPECT_METHOD_DETAILS[method] ?? [];
      setValue('questions', defaultQuestions.length > 0 ? [...defaultQuestions] : ['']);
    }
  };

  if (isEditingQuestions) {
    return <QuestionsEditStep onClose={onClose} onComplete={() => setIsEditingQuestions(false)} />;
  }

  return (
    <div className="flex h-full flex-col">
      <FormHeader onClose={onClose} />

      <div className="flex min-h-0 flex-1 flex-col gap-6">
        <div>
          <StepIndicator />
          <div className="flex flex-col">
            <span className="text-title-2 text-grey-1000">회고 방식을 선택해주세요</span>
          </div>
        </div>

        <Controller
          name="retrospectMethod"
          control={control}
          render={({ field }) => (
            <MethodSelector
              value={field.value}
              onChange={(value) => handleMethodChange(value, field.onChange)}
              onEditQuestions={() => setIsEditingQuestions(true)}
            />
          )}
        />
      </div>

      <div className="shrink-0 flex justify-end pt-4">
        <Button
          type="button"
          variant="primary"
          size="lg"
          onClick={goToNextStep}
          disabled={!retrospectMethod}
          className="h-[32px] px-[18.5px] py-[7px]"
        >
          다음
        </Button>
      </div>
    </div>
  );
}
