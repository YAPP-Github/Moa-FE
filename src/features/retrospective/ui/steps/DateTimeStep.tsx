import { Controller, useFormContext } from 'react-hook-form';
import type { CreateRetrospectFormData } from '@/features/retrospective/model/schema';
import { FormHeader } from '@/features/retrospective/ui/steps/FormHeader';
import { StepIndicator } from '@/features/retrospective/ui/steps/StepIndicator';
import { TimeSelector } from '@/features/retrospective/ui/steps/TimeSelector';
import { Button } from '@/shared/ui/button/Button';
import { Calendar } from '@/shared/ui/calendar/Calendar';
import { useStepContext } from '@/shared/ui/multi-step-form/MultiStepForm';

interface DateTimeStepProps {
  onClose: () => void;
}

export function DateTimeStep({ onClose }: DateTimeStepProps) {
  const { control, watch } = useFormContext<CreateRetrospectFormData>();
  const { goToNextStep } = useStepContext();

  const retrospectDate = watch('retrospectDate');
  const retrospectTime = watch('retrospectTime');

  const handleNext = async () => {
    await goToNextStep();
  };

  const isValid = retrospectDate && retrospectTime?.trim();

  return (
    <div className="flex h-full flex-col">
      <FormHeader onClose={onClose} />

      <div className="flex flex-1 flex-col justify-between">
        <div className="flex flex-col gap-6">
          <div>
            <StepIndicator />
            <div className="flex flex-col">
              <span className="text-title-2 text-grey-1000">회고를 하는 날짜와</span>
              <span className="text-title-2 text-grey-1000">시간을 선택해주세요</span>
            </div>
          </div>

          <Controller
            name="retrospectDate"
            control={control}
            render={({ field }) => (
              <Calendar
                selected={field.value}
                onSelect={field.onChange}
                minDate={new Date(new Date().setHours(0, 0, 0, 0))}
              />
            )}
          />
        </div>

        <Controller
          name="retrospectTime"
          control={control}
          render={({ field }) => <TimeSelector value={field.value} onChange={field.onChange} />}
        />
      </div>

      <div className="shrink-0 flex justify-end pt-4">
        <Button type="button" variant="primary" size="lg" onClick={handleNext} disabled={!isValid}>
          다음
        </Button>
      </div>
    </div>
  );
}
