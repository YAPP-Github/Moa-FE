import { cva, type VariantProps } from 'class-variance-authority';
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isBefore,
  isSameDay,
  isSameMonth,
  startOfMonth,
  subMonths,
} from 'date-fns';
import { ko } from 'date-fns/locale';
import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/shared/lib/cn';
import { IconButton } from '@/shared/ui/icon-button/IconButton';

const dayVariants = cva(
  'inline-flex items-center justify-center size-[28px] rounded-full text-sub-title-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3182F6]/30',
  {
    variants: {
      state: {
        default: 'text-grey-900 cursor-pointer hover:bg-blue-100 hover:text-blue-600',
        selected: 'bg-blue-500 text-white hover:bg-blue-300 cursor-pointer',
        disabled: 'text-grey-400 cursor-not-allowed',
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
  /** 선택 가능한 최소 날짜 (이 날짜 이전은 선택 불가, 이전 월 이동도 제한) */
  minDate?: Date;
}

type DayState = VariantProps<typeof dayVariants>['state'];

const Calendar = forwardRef<HTMLDivElement, CalendarProps>(
  ({ selected, onSelect, disabled, minDate }, ref) => {
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

    // 이전 월 이동 가능 여부 (minDate가 있으면 해당 월 이전으로 이동 불가)
    const canGoPrevMonth = useMemo(() => {
      if (!minDate) return true;
      const prevMonth = subMonths(currentMonth, 1);
      return !isBefore(endOfMonth(prevMonth), startOfMonth(minDate));
    }, [currentMonth, minDate]);

    // 이전 월로 이동
    const handlePrevMonth = useCallback(() => {
      if (!canGoPrevMonth) return;
      setCurrentMonth((prev) => subMonths(prev, 1));
    }, [canGoPrevMonth]);

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
        if (minDate && isBefore(date, minDate)) return 'disabled';
        if (disabled?.(date)) return 'disabled';
        if (selected && isSameDay(date, selected)) return 'selected';
        if (!isSameMonth(date, currentMonth)) return 'outside';
        return 'default';
      },
      [disabled, selected, currentMonth, minDate]
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
      <div ref={ref} className="w-full">
        {/* Header: 월/년 + 네비게이션 */}
        <div className="grid grid-cols-7 items-center px-[20px]">
          <span className="col-span-5 text-sub-title-0 text-grey-1000 truncate">
            {format(currentMonth, 'yyyy년 M월', { locale: ko })}
          </span>
          <div className="col-span-2 flex items-center justify-end gap-[8px]">
            <IconButton
              variant="tertiary"
              size="sm"
              onClick={handlePrevMonth}
              disabled={!canGoPrevMonth}
              aria-label="이전 달"
            >
              <ChevronLeftIcon />
            </IconButton>
            <IconButton variant="tertiary" size="sm" onClick={handleNextMonth} aria-label="다음 달">
              <ChevronRightIcon />
            </IconButton>
          </div>
        </div>

        {/* 요일 헤더 */}
        <div className="grid grid-cols-7 mt-[18px]">
          {WEEKDAYS.map((day) => (
            <div
              key={day}
              className="flex h-[28px] items-center justify-center text-caption-3-medium text-grey-400"
            >
              {day}
            </div>
          ))}
        </div>

        {/* 날짜 그리드 */}
        <div ref={gridRef} className="grid grid-cols-7 mt-[10px] gap-y-[10px]">
          {/* 빈 셀 */}
          {emptyCells.map((i) => (
            <div key={`empty-${i}`} className="h-[28px]" />
          ))}

          {/* 날짜 셀 */}
          {days.map((date, index) => {
            const state = getDayState(date);
            const isDisabled = state === 'disabled';
            const isFocused = focusedDate && isSameDay(date, focusedDate);
            const isSelected = state === 'selected';
            const isToday = isSameDay(date, new Date());
            const isFirstDay = index === 0;

            // tabIndex 결정: focusedDate > selected > 첫 번째 날
            const shouldBeTabbable =
              isFocused ||
              (!focusedDate && isSelected) ||
              (!focusedDate && !selected && isFirstDay);

            return (
              <div key={date.toISOString()} className="flex h-[28px] items-center justify-center">
                <button
                  type="button"
                  data-date={date.toISOString().split('T')[0]}
                  data-selected={isSelected || undefined}
                  title={format(date, 'yyyy년 M월 d일', { locale: ko })}
                  tabIndex={shouldBeTabbable ? 0 : -1}
                  className={cn(dayVariants({ state }), isToday && !isSelected && 'text-blue-500')}
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
