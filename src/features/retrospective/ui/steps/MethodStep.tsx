import { Controller, useFormContext } from 'react-hook-form';
import type { CreateRetrospectFormData } from '@/features/retrospective/model/schema';
import { FormHeader } from '@/features/retrospective/ui/steps/FormHeader';
import { MethodSelector } from '@/features/retrospective/ui/steps/MethodSelector';
import { StepIndicator } from '@/features/retrospective/ui/steps/StepIndicator';
import { Button } from '@/shared/ui/button/Button';
import { useStepContext } from '@/shared/ui/multi-step-form/MultiStepForm';

interface MethodStepProps {
  onClose: () => void;
  onMethodChange?: (method: string) => void;
}

export function MethodStep({ onClose, onMethodChange }: MethodStepProps) {
  const { control, watch } = useFormContext<CreateRetrospectFormData>();
  const { goToNextStep } = useStepContext();

  const retrospectMethod = watch('retrospectMethod');

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
              onChange={(value) => {
                field.onChange(value);
                onMethodChange?.(value);
              }}
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
