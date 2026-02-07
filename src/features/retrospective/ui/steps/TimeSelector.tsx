import { isSameDay } from 'date-fns';
import { RadioCardGroup, RadioCardItem } from '@/shared/ui/radio-card/RadioCard';
import { SwiperContent, SwiperItem, SwiperRoot } from '@/shared/ui/swiper/Swiper';

interface TimeSelectorProps {
  value?: string;
  onChange: (value: string) => void;
  selectedDate?: Date;
}

// 1시간 단위 시간 옵션 생성 (09:00 ~ 23:00)
const TIME_OPTIONS = Array.from({ length: 15 }, (_, i) => {
  const hour = i + 9;
  return `${hour.toString().padStart(2, '0')}:00`;
});

function getAvailableTimeOptions(selectedDate?: Date): string[] {
  if (!selectedDate) return TIME_OPTIONS;

  const now = new Date();
  const isToday = isSameDay(selectedDate, now);

  if (!isToday) return TIME_OPTIONS;

  const currentHour = now.getHours();
  return TIME_OPTIONS.filter((time) => {
    const [hours] = time.split(':').map(Number);
    return hours > currentHour;
  });
}

export function TimeSelector({ value, onChange, selectedDate }: TimeSelectorProps) {
  const availableOptions = getAvailableTimeOptions(selectedDate);

  return (
    <SwiperRoot className="-mx-6">
      <SwiperContent inset={24} className="gap-2 py-4">
        <RadioCardGroup value={value} onValueChange={onChange} className="flex gap-2">
          {availableOptions.map((time) => (
            <SwiperItem key={time}>
              <RadioCardItem
                value={time}
                className="rounded-lg px-[16.5px] py-[8.5px] bg-grey-100 text-sub-title-4 text-grey-900 transition-colors hover:bg-blue-300 hover:text-blue-500 data-[state=checked]:bg-blue-200 data-[state=checked]:text-blue-500"
              >
                {time}
              </RadioCardItem>
            </SwiperItem>
          ))}
        </RadioCardGroup>
      </SwiperContent>
    </SwiperRoot>
  );
}
