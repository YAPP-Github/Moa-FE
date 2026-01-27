import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Calendar } from './Calendar';

describe('Calendar', () => {
  // 2026년 1월 15일 목요일 12:00:00으로 시간 고정
  const FIXED_DATE = new Date(2026, 0, 15, 12, 0, 0);

  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    vi.setSystemTime(FIXED_DATE);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // fake timers와 userEvent 함께 사용
  const setupUser = () =>
    userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    });

  describe('렌더링', () => {
    it('selected 없이 마운트하면 현재 월이 표시된다', () => {
      render(<Calendar />);

      expect(screen.getByText('2026년 1월')).toBeInTheDocument();
    });

    it('selected와 함께 마운트하면 해당 날짜의 월이 표시된다', () => {
      const marchDate = new Date(2026, 2, 20); // 2026년 3월 20일

      render(<Calendar selected={marchDate} />);

      expect(screen.getByText('2026년 3월')).toBeInTheDocument();
    });

    it('요일 헤더가 표시된다', () => {
      render(<Calendar />);

      const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
      for (const day of weekdays) {
        expect(screen.getByText(day)).toBeInTheDocument();
      }
    });

    it('월의 모든 날짜가 렌더링된다', () => {
      render(<Calendar selected={FIXED_DATE} />);

      // 2026년 1월은 31일까지
      for (let day = 1; day <= 31; day++) {
        expect(screen.getByText(String(day))).toBeInTheDocument();
      }
    });

    it('선택된 날짜가 하이라이트 된다', () => {
      render(<Calendar selected={FIXED_DATE} />);

      const selectedButton = screen.getByTitle('2026년 1월 15일');
      expect(selectedButton).toHaveAttribute('data-selected', 'true');
    });
  });

  describe('날짜 선택', () => {
    it('날짜 클릭 시 onSelect가 호출된다', async () => {
      const user = setupUser();
      const onSelect = vi.fn();

      render(<Calendar selected={FIXED_DATE} onSelect={onSelect} />);

      const dayButton = screen.getByTitle('2026년 1월 20일');
      await user.click(dayButton);

      expect(onSelect).toHaveBeenCalledTimes(1);
      expect(onSelect).toHaveBeenCalledWith(expect.any(Date));
      expect(onSelect.mock.calls[0][0].getDate()).toBe(20);
    });

    it('disabled 날짜는 클릭해도 onSelect가 호출되지 않는다', async () => {
      const user = setupUser();
      const onSelect = vi.fn();
      const isDisabled = (date: Date) => date.getDate() === 20;

      render(<Calendar selected={FIXED_DATE} onSelect={onSelect} disabled={isDisabled} />);

      const disabledButton = screen.getByTitle('2026년 1월 20일');
      expect(disabledButton).toBeDisabled();

      await user.click(disabledButton);
      expect(onSelect).not.toHaveBeenCalled();
    });

    it('disabled 날짜는 비활성화 스타일이 적용된다', () => {
      const isDisabled = (date: Date) => date.getDate() === 10;

      render(<Calendar selected={FIXED_DATE} disabled={isDisabled} />);

      const disabledButton = screen.getByTitle('2026년 1월 10일');
      expect(disabledButton).toBeDisabled();
      expect(disabledButton).toHaveClass('cursor-not-allowed');
    });
  });

  describe('월 네비게이션', () => {
    it('이전 달 버튼 클릭 시 이전 월로 이동한다', async () => {
      const user = setupUser();

      render(<Calendar selected={FIXED_DATE} />);

      const prevButton = screen.getByRole('button', { name: '이전 달' });
      await user.click(prevButton);

      expect(screen.getByText('2025년 12월')).toBeInTheDocument();
    });

    it('다음 달 버튼 클릭 시 다음 월로 이동한다', async () => {
      const user = setupUser();

      render(<Calendar selected={FIXED_DATE} />);

      const nextButton = screen.getByRole('button', { name: '다음 달' });
      await user.click(nextButton);

      expect(screen.getByText('2026년 2월')).toBeInTheDocument();
    });

    it('연속으로 월을 이동할 수 있다', async () => {
      const user = setupUser();

      render(<Calendar selected={FIXED_DATE} />);

      const nextButton = screen.getByRole('button', { name: '다음 달' });

      // 3개월 앞으로 이동
      await user.click(nextButton);
      await user.click(nextButton);
      await user.click(nextButton);

      expect(screen.getByText('2026년 4월')).toBeInTheDocument();
    });
  });

  describe('키보드 네비게이션', () => {
    it('Enter 키로 날짜를 선택할 수 있다', async () => {
      const user = setupUser();
      const onSelect = vi.fn();

      render(<Calendar selected={FIXED_DATE} onSelect={onSelect} />);

      const selectedButton = screen.getByTitle('2026년 1월 15일');
      selectedButton.focus();

      await user.keyboard('{Enter}');

      expect(onSelect).toHaveBeenCalledTimes(1);
    });

    it('Space 키로 날짜를 선택할 수 있다', async () => {
      const user = setupUser();
      const onSelect = vi.fn();

      render(<Calendar selected={FIXED_DATE} onSelect={onSelect} />);

      const selectedButton = screen.getByTitle('2026년 1월 15일');
      selectedButton.focus();

      await user.keyboard(' ');

      expect(onSelect).toHaveBeenCalledTimes(1);
    });

    it('ArrowRight로 다음 날짜로 이동한다', async () => {
      const user = setupUser();

      render(<Calendar selected={FIXED_DATE} />);

      const selectedButton = screen.getByTitle('2026년 1월 15일');
      selectedButton.focus();

      await user.keyboard('{ArrowRight}');

      const nextDayButton = screen.getByTitle('2026년 1월 16일');
      expect(document.activeElement).toBe(nextDayButton);
    });

    it('ArrowLeft로 이전 날짜로 이동한다', async () => {
      const user = setupUser();

      render(<Calendar selected={FIXED_DATE} />);

      const selectedButton = screen.getByTitle('2026년 1월 15일');
      selectedButton.focus();

      await user.keyboard('{ArrowLeft}');

      const prevDayButton = screen.getByTitle('2026년 1월 14일');
      expect(document.activeElement).toBe(prevDayButton);
    });

    it('ArrowDown으로 다음 주 같은 요일로 이동한다', async () => {
      const user = setupUser();

      render(<Calendar selected={FIXED_DATE} />);

      const selectedButton = screen.getByTitle('2026년 1월 15일');
      selectedButton.focus();

      await user.keyboard('{ArrowDown}');

      const nextWeekButton = screen.getByTitle('2026년 1월 22일');
      expect(document.activeElement).toBe(nextWeekButton);
    });

    it('ArrowUp으로 이전 주 같은 요일로 이동한다', async () => {
      const user = setupUser();

      render(<Calendar selected={FIXED_DATE} />);

      const selectedButton = screen.getByTitle('2026년 1월 15일');
      selectedButton.focus();

      await user.keyboard('{ArrowUp}');

      const prevWeekButton = screen.getByTitle('2026년 1월 8일');
      expect(document.activeElement).toBe(prevWeekButton);
    });

    it('ArrowLeft로 월 경계를 넘어 이전 달로 이동한다', async () => {
      const user = setupUser();
      const jan1 = new Date(2026, 0, 1, 12, 0, 0);

      render(<Calendar selected={jan1} />);

      const selectedButton = screen.getByTitle('2026년 1월 1일');
      selectedButton.focus();

      await user.keyboard('{ArrowLeft}');

      // 2025년 12월로 이동
      expect(screen.getByText('2025년 12월')).toBeInTheDocument();
      const dec31Button = screen.getByTitle('2025년 12월 31일');
      expect(document.activeElement).toBe(dec31Button);
    });

    it('ArrowRight로 월 경계를 넘어 다음 달로 이동한다', async () => {
      const user = setupUser();
      const jan31 = new Date(2026, 0, 31, 12, 0, 0);

      render(<Calendar selected={jan31} />);

      const selectedButton = screen.getByTitle('2026년 1월 31일');
      selectedButton.focus();

      await user.keyboard('{ArrowRight}');

      // 2026년 2월로 이동
      expect(screen.getByText('2026년 2월')).toBeInTheDocument();
      const feb1Button = screen.getByTitle('2026년 2월 1일');
      expect(document.activeElement).toBe(feb1Button);
    });
  });

  describe('Props', () => {
    it('selected 없이 렌더링할 수 있다', () => {
      expect(() => render(<Calendar />)).not.toThrow();
    });

    it('onSelect 없이 렌더링할 수 있다', async () => {
      const user = setupUser();
      render(<Calendar selected={FIXED_DATE} />);

      const dayButton = screen.getByTitle('2026년 1월 20일');

      // onSelect 없어도 에러 없이 클릭 가능
      await expect(user.click(dayButton)).resolves.not.toThrow();
    });
  });
});
