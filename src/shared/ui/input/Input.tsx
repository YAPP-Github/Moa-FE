import { forwardRef } from 'react';
import { Button } from '../button';
import { svg } from '@/shared/assets';
import { cn } from '@/shared/lib';

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
      ...props
    },
    ref
  ) => {
    const hasValue = value !== undefined && value !== '';
    const currentLength = String(value ?? '').length;

    return (
      <div className="flex flex-col gap-2">
        <div className="relative">
          <input
            ref={ref}
            value={value}
            disabled={disabled}
            maxLength={maxLength}
            className={cn(
              'h-12 w-full rounded-md border-[1.5px] px-5 transition-colors',
              'focus:outline-none focus-visible:ring-[3px]',
              error
                ? 'border-destructive focus-visible:border-destructive focus-visible:ring-destructive/30'
                : 'border-[#EBEBEB] focus-visible:border-[#3182F6] focus-visible:ring-[#3182F6]/30',
              disabled && 'cursor-not-allowed bg-muted opacity-50',
              clearable && hasValue && 'pr-12',
              className
            )}
            aria-invalid={error ? 'true' : undefined}
            {...props}
          />
          {clearable && hasValue && !disabled && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onClear}
              className="absolute right-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 rounded-full"
              aria-label="입력 지우기"
            >
              <img src={svg.icDeleteMd} alt="" className="h-[18px] w-[18px]" />
            </Button>
          )}
        </div>
        {showCount && maxLength && (
          <span className="self-end text-sm text-[#A0A9B7]">
            {currentLength}/{maxLength}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input, type InputProps };
