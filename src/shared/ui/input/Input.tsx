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
      ...props
    },
    ref
  ) => {
    const hasValue = value !== undefined && value !== '';
    const currentLength = String(value ?? '').length;

    return (
      <div className="relative">
        <input
          ref={ref}
          value={value}
          disabled={disabled}
          maxLength={maxLength}
          autoComplete="off"
          className={cn(
            'h-12 w-full rounded-md border-[1.5px] px-5 transition-colors text-caption-2 placeholder:text-caption-2',
            'focus:outline-none focus-visible:ring-[3px]',
            error
              ? 'border-red-300 focus-visible:border-red-300 focus-visible:ring-red-300/30'
              : 'border-[#EBEBEB] focus-visible:border-[#3182F6] focus-visible:ring-[#3182F6]/30',
            disabled && 'cursor-not-allowed bg-grey-100 opacity-50',
            clearable && hasValue && 'pr-12',
            className
          )}
          aria-invalid={error ? 'true' : undefined}
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
