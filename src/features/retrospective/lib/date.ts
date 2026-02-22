import {
  differenceInCalendarDays,
  differenceInHours,
  differenceInMinutes,
  startOfDay,
} from 'date-fns';

/**
 * 회고 날짜를 기준으로 D-day 라벨을 반환한다.
 */
export function getDDayLabel(dateString: string): string | null {
  const today = startOfDay(new Date());
  const target = startOfDay(new Date(dateString));
  const diff = differenceInCalendarDays(target, today);

  if (diff < 0) return null;
  if (diff === 0) return '오늘';
  return `D-${diff}`;
}

export function formatRelativeTime(dateString?: string): string {
  if (!dateString) return '';

  const now = new Date();
  const target = new Date(dateString);
  const mins = differenceInMinutes(now, target);

  if (mins < 1) return '방금 전';
  if (mins < 60) return `${mins}분 전`;

  const hours = differenceInHours(now, target);
  if (hours < 24) return `${hours}시간 전`;

  const days = differenceInCalendarDays(now, target);
  if (days < 30) return `${days}일 전`;

  return target.toLocaleDateString('ko-KR');
}
