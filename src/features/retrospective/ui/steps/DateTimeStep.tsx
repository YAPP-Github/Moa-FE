import { format, isSameDay, setHours, setMinutes } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useEffect } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import type { CreateRetrospectFormData } from '@/features/retrospective/model/schema';
import { FormHeader } from '@/features/retrospective/ui/steps/FormHeader';
import { StepIndicator } from '@/features/retrospective/ui/steps/StepIndicator';
import { TimeSelector } from '@/features/retrospective/ui/steps/TimeSelector';
import { Button } from '@/shared/ui/button/Button';
import { Calendar } from '@/shared/ui/calendar/Calendar';
import SvgIcCalendar from '@/shared/ui/icons/IcCalendar';
import { useStepContext } from '@/shared/ui/multi-step-form/MultiStepForm';

interface DateTimeStepProps {
  onClose: () => void;
}

function formatSelectedDateTime(date?: Date, time?: string): string | null {
  if (!date) return null;

  if (!time?.trim()) {
    return format(date, 'yyyy년 M월 d일 (EEE)', { locale: ko });
  }

  // 날짜와 시간을 합쳐서 하나의 Date 객체로 만들기
  const [hours, minutes] = time.split(':').map(Number);
  const dateTime = setMinutes(setHours(date, hours), minutes);

  // date-fns format으로 한 번에 포맷팅 (a = 오전/오후, h = 12시간제)
  return format(dateTime, 'yyyy년 M월 d일 (EEE) a hh:mm', { locale: ko });
}

export function DateTimeStep({ onClose }: DateTimeStepProps) {
  const { control, watch, setValue } = useFormContext<CreateRetrospectFormData>();
  const { goToNextStep } = useStepContext();

  const retrospectDate = watch('retrospectDate');
  const retrospectTime = watch('retrospectTime');

  // 오늘 날짜 선택 시 이미 지나간 시간이 선택되어 있으면 초기화
  useEffect(() => {
    if (!retrospectDate || !retrospectTime) return;

    const now = new Date();
    const isToday = isSameDay(retrospectDate, now);

    if (isToday) {
      const [hours] = retrospectTime.split(':').map(Number);
      const currentHour = now.getHours();

      if (hours <= currentHour) {
        setValue('retrospectTime', '');
      }
    }
  }, [retrospectDate, retrospectTime, setValue]);

  const handleNext = async () => {
    await goToNextStep();
  };

  const isValid = retrospectDate && retrospectTime?.trim();
  const selectedDateTimeText = formatSelectedDateTime(retrospectDate, retrospectTime);

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
          render={({ field }) => (
            <TimeSelector
              value={field.value}
              onChange={field.onChange}
              selectedDate={retrospectDate}
            />
          )}
        />
      </div>

      <div className="shrink-0 flex items-center justify-between pt-4">
        <div className="flex items-center gap-1.5">
          {selectedDateTimeText && (
            <>
              <SvgIcCalendar className="h-[18px] w-[18px]" />
              <span className="text-caption-2 text-grey-800">{selectedDateTimeText}</span>
            </>
          )}
        </div>
        <Button type="button" variant="primary" size="lg" onClick={handleNext} disabled={!isValid}>
          다음
        </Button>
      </div>
    </div>
  );
}
