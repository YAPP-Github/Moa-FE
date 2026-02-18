import { forwardRef } from 'react';
import { IconButton } from '../icon-button/IconButton';
import { cn } from '@/shared/lib/cn';
import IcDelete from '@/shared/ui/icons/IcDelete';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  clearable?: boolean;
  onClear?: () => void;
  showCount?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      error,
      clearable = false,
      onClear,
      disabled,
      value,
      showCount,
      maxLength,
      onChange,
      ...props
    },
    ref
  ) => {
    const hasValue = value !== undefined && value !== '';
    const currentLength = String(value ?? '').length;

    // 한글 IME 조합 중 maxLength를 초과하는 문제 방지
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (maxLength && e.target.value.length > maxLength) {
        e.target.value = e.target.value.slice(0, maxLength);
      }
      onChange?.(e);
    };

    return (
      <div className="relative">
        <input
          ref={ref}
          value={value}
          disabled={disabled}
          maxLength={maxLength}
          autoComplete="off"
          className={cn(
            'h-[46px] w-full rounded-md border px-[16px] transition-colors text-caption-2 placeholder:text-caption-2 placeholder:text-[#BEBFC6]',
            'focus:outline-none',
            error
              ? 'border-red-300 focus-visible:border-red-300'
              : 'border-[#EBEBEB] focus-visible:border-[#3182F6]',
            disabled && 'cursor-not-allowed bg-grey-100 opacity-50',
            clearable && hasValue && 'pr-12',
            className
          )}
          aria-invalid={error ? 'true' : undefined}
          onChange={handleChange}
          {...props}
        />
        {clearable && hasValue && !disabled && (
          <IconButton
            type="button"
            variant="ghost"
            shape="circle"
            onClick={onClear}
            className="absolute right-4 top-1/2 size-[18px] -translate-y-1/2"
            aria-label="입력 지우기"
          >
            <IcDelete className="size-[18px]" />
          </IconButton>
        )}
        {showCount && maxLength && (
          <span className="absolute right-0.5 top-full mt-0.5 text-sm text-[#A0A9B7]">
            {currentLength}/{maxLength}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input, type InputProps };
