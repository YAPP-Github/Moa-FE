import { forwardRef, useId } from 'react';
import { cn } from '@/shared/lib';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** 체크박스 옆에 표시할 레이블 텍스트 */
  label?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, disabled, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
      <label
        htmlFor={inputId}
        className={cn(
          'inline-flex items-center gap-1.5 cursor-pointer',
          disabled && 'cursor-not-allowed opacity-50',
          className
        )}
      >
        <span className="relative inline-flex items-center justify-center w-5 h-5">
          <input
            type="checkbox"
            id={inputId}
            ref={ref}
            disabled={disabled}
            className="peer sr-only"
            {...props}
          />
          {/* 체크박스 박스 */}
          <span
            className={cn(
              'absolute inset-0 rounded-full border-[1.5px]',
              'border-[#D1D5DB] bg-white',
              'peer-checked:border-[#3182F6] peer-checked:bg-[#3182F6]',
              'peer-focus-visible:ring-[3px] peer-focus-visible:ring-[#3182F6]/30',
              'peer-disabled:cursor-not-allowed'
            )}
          />
          {/* 체크마크 */}
          <svg
            className={cn('relative w-3 h-3 text-white opacity-0', 'peer-checked:opacity-100')}
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M2.5 6L5 8.5L9.5 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        {label && <span className="text-sm font-medium leading-[150%] select-none">{label}</span>}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export { Checkbox, type CheckboxProps };
