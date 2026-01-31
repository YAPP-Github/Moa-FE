import { cva, type VariantProps } from 'class-variance-authority';
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isSameDay,
  isSameMonth,
  startOfMonth,
  subMonths,
} from 'date-fns';
import { ko } from 'date-fns/locale';
import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/shared/lib/cn';

const dayVariants = cva(
  'inline-flex items-center justify-center size-[27px] rounded-full text-[15px] font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3182F6]/30',
  {
    variants: {
      state: {
        default: 'cursor-pointer hover:bg-blue-100 hover:text-blue-600',
        selected: 'bg-[#3182F6] text-white hover:bg-[#1B64DA] cursor-pointer',
        disabled: 'text-grey-600 opacity-50 cursor-not-allowed',
        outside: 'text-grey-600 opacity-50 cursor-pointer hover:bg-blue-100',
      },
    },
    defaultVariants: {
      state: 'default',
    },
  }
);

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

export interface CalendarProps {
  selected?: Date;
  onSelect?: (date: Date) => void;
  disabled?: (date: Date) => boolean;
}

type DayState = VariantProps<typeof dayVariants>['state'];

const Calendar = forwardRef<HTMLDivElement, CalendarProps>(
  ({ selected, onSelect, disabled }, ref) => {
    const [currentMonth, setCurrentMonth] = useState(() => selected ?? new Date());
    const [focusedDate, setFocusedDate] = useState<Date | null>(null);
    const gridRef = useRef<HTMLDivElement>(null);

    // 포커스된 날짜가 변경되면 해당 버튼으로 포커스 이동
    useEffect(() => {
      if (focusedDate && gridRef.current) {
        const dateStr = focusedDate.toISOString().split('T')[0];
        const button = gridRef.current.querySelector(
          `[data-date="${dateStr}"]`
        ) as HTMLButtonElement | null;
        button?.focus();
      }
    }, [focusedDate]);

    // 월의 모든 날짜 계산
    const days = useMemo(() => {
      const start = startOfMonth(currentMonth);
      const end = endOfMonth(currentMonth);
      return eachDayOfInterval({ start, end });
    }, [currentMonth]);

    // 월의 시작 요일 (빈 셀 계산용)
    const startDayOfWeek = useMemo(() => {
      return getDay(startOfMonth(currentMonth));
    }, [currentMonth]);

    // 빈 셀 배열
    const emptyCells = useMemo(() => {
      return Array.from({ length: startDayOfWeek }, (_, i) => i);
    }, [startDayOfWeek]);

    // 이전 월로 이동
    const handlePrevMonth = useCallback(() => {
      setCurrentMonth((prev) => subMonths(prev, 1));
    }, []);

    // 다음 월로 이동
    const handleNextMonth = useCallback(() => {
      setCurrentMonth((prev) => addMonths(prev, 1));
    }, []);

    // 날짜 선택
    const handleSelectDate = useCallback(
      (date: Date) => {
        if (disabled?.(date)) return;
        onSelect?.(date);
      },
      [disabled, onSelect]
    );

    // 날짜 상태 결정
    const getDayState = useCallback(
      (date: Date): DayState => {
        if (disabled?.(date)) return 'disabled';
        if (selected && isSameDay(date, selected)) return 'selected';
        if (!isSameMonth(date, currentMonth)) return 'outside';
        return 'default';
      },
      [disabled, selected, currentMonth]
    );

    // 키보드 네비게이션
    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent, date: Date) => {
        let newDate: Date | null = null;

        switch (e.key) {
          case 'ArrowLeft':
            newDate = new Date(date);
            newDate.setDate(date.getDate() - 1);
            break;
          case 'ArrowRight':
            newDate = new Date(date);
            newDate.setDate(date.getDate() + 1);
            break;
          case 'ArrowUp':
            newDate = new Date(date);
            newDate.setDate(date.getDate() - 7);
            break;
          case 'ArrowDown':
            newDate = new Date(date);
            newDate.setDate(date.getDate() + 7);
            break;
          case 'Enter':
          case ' ':
            e.preventDefault();
            handleSelectDate(date);
            return;
          default:
            return;
        }

        if (newDate) {
          e.preventDefault();
          setFocusedDate(newDate);

          // 월이 바뀌면 currentMonth도 변경
          if (!isSameMonth(newDate, currentMonth)) {
            setCurrentMonth(newDate);
          }
        }
      },
      [currentMonth, handleSelectDate]
    );

    return (
      <div ref={ref} className="p-3 w-full">
        {/* Header: 월/년 + 네비게이션 */}
        <div className="flex items-center justify-between">
          <span className="text-xl font-semibold">
            {format(currentMonth, 'yyyy년 M월', { locale: ko })}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="inline-flex items-center justify-center size-8 rounded-md hover:bg-blue-100 transition-colors"
              aria-label="이전 달"
            >
              <ChevronLeftIcon />
            </button>
            <button
              type="button"
              onClick={handleNextMonth}
              className="inline-flex items-center justify-center size-8 rounded-md hover:bg-blue-100 transition-colors"
              aria-label="다음 달"
            >
              <ChevronRightIcon />
            </button>
          </div>
        </div>

        {/* 요일 헤더 */}
        <div className="grid grid-cols-7">
          {WEEKDAYS.map((day) => (
            <div
              key={day}
              className="flex items-center justify-center aspect-square w-full text-[13px] font-medium leading-[150%] text-[#8791A0]"
            >
              {day}
            </div>
          ))}
        </div>

        {/* 날짜 그리드 */}
        <div ref={gridRef} className="grid grid-cols-7">
          {/* 빈 셀 */}
          {emptyCells.map((i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}

          {/* 날짜 셀 */}
          {days.map((date, index) => {
            const state = getDayState(date);
            const isDisabled = state === 'disabled';
            const isFocused = focusedDate && isSameDay(date, focusedDate);
            const isSelected = state === 'selected';
            const isFirstDay = index === 0;

            // tabIndex 결정: focusedDate > selected > 첫 번째 날
            const shouldBeTabbable =
              isFocused ||
              (!focusedDate && isSelected) ||
              (!focusedDate && !selected && isFirstDay);

            return (
              <div
                key={date.toISOString()}
                className="aspect-square flex items-center justify-center"
              >
                <button
                  type="button"
                  data-date={date.toISOString().split('T')[0]}
                  data-selected={isSelected || undefined}
                  title={format(date, 'yyyy년 M월 d일', { locale: ko })}
                  tabIndex={shouldBeTabbable ? 0 : -1}
                  className={cn(dayVariants({ state }))}
                  onClick={() => handleSelectDate(date)}
                  onKeyDown={(e) => handleKeyDown(e, date)}
                  disabled={isDisabled}
                >
                  {format(date, 'd')}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);

Calendar.displayName = 'Calendar';

// Chevron Icons
function ChevronLeftIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M10 12L6 8L10 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M6 4L10 8L6 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export { Calendar, dayVariants };
