import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Controller, useFormContext } from 'react-hook-form';
import type { CreateRetrospectFormData } from '@/features/retrospective/model/schema';
import { FormHeader } from '@/features/retrospective/ui/steps/FormHeader';
import { StepIndicator } from '@/features/retrospective/ui/steps/StepIndicator';
import { Button } from '@/shared/ui/button/Button';
import { Calendar } from '@/shared/ui/calendar/Calendar';
import SvgIcCalendar from '@/shared/ui/icons/IcCalendar';
import { useStepContext } from '@/shared/ui/multi-step-form/MultiStepForm';

interface DateTimeStepProps {
  onClose: () => void;
}

export function DateTimeStep({ onClose }: DateTimeStepProps) {
  const { control, watch } = useFormContext<CreateRetrospectFormData>();
  const { goToNextStep } = useStepContext();

  const retrospectDate = watch('retrospectDate');

  const isValid = !!retrospectDate;
  const selectedDateText = retrospectDate
    ? format(retrospectDate, 'yyyy년 M월 d일 (EEE)', { locale: ko })
    : null;

  return (
    <div className="flex h-full flex-col">
      <FormHeader onClose={onClose} />

      <div className="flex flex-1 flex-col justify-between">
        <div className="flex flex-col gap-6">
          <div>
            <StepIndicator />
            <div className="flex flex-col">
              <span className="text-title-2 text-grey-1000">회고를 하는 날짜를</span>
              <span className="text-title-2 text-grey-1000">선택해주세요</span>
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
      </div>

      <div className="flex justify-between">
        <div className="flex items-center gap-[6px]">
          {selectedDateText && (
            <>
              <SvgIcCalendar className="h-[18px] w-[18px]" />
              <span className="text-caption-2 text-grey-800">{selectedDateText}</span>
            </>
          )}
        </div>
        <Button
          type="button"
          variant="primary"
          size="lg"
          onClick={goToNextStep}
          disabled={!isValid}
          className="h-[32px] px-[18.5px] py-[7px]"
        >
          다음
        </Button>
      </div>
    </div>
  );
}
