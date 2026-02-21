import { differenceInCalendarDays, startOfDay } from 'date-fns';

/**
 * 회고 날짜를 기준으로 D-day 라벨을 반환한다.
 * - 오늘: "오늘"
 * - 내일: "D-1"
 * - N일 뒤: "D-N"
 * - 지난 날짜: null
 */
export function getDDayLabel(dateString: string): string | null {
  const today = startOfDay(new Date());
  const target = startOfDay(new Date(dateString));
  const diff = differenceInCalendarDays(target, today);

  if (diff < 0) return null;
  if (diff === 0) return '오늘';
  return `D-${diff}`;
}
