import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, useState } from 'react';
import { cn } from '@/shared/lib/cn';

const toggleButtonVariants = cva(
  'inline-flex items-center justify-center cursor-pointer font-semibold leading-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3182F6]/30 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: '',
        secondary: '',
        tertiary: '',
        ghost: '',
      },
      size: {
        xs: 'h-6 px-2 text-xs rounded',
        sm: 'h-7 px-2.5 text-xs rounded',
        md: 'h-8 px-3 text-sm rounded-md',
        lg: 'h-9 px-4 text-sm rounded-md',
        xl: 'h-12 px-6 text-base rounded-lg',
      },
      pressed: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      // Primary - pressed
      {
        variant: 'primary',
        pressed: true,
        class: 'bg-[#3182F6] text-[#FFFFFF] hover:bg-[#0062BC]',
      },
      // Primary - not pressed
      {
        variant: 'primary',
        pressed: false,
        class: 'bg-[#E6F2FF] text-[#3182F6] hover:bg-[#C1D9FD]',
      },
      // Secondary - pressed
      {
        variant: 'secondary',
        pressed: true,
        class: 'bg-[#3182F6] text-[#FFFFFF] hover:bg-[#0062BC]',
      },
      // Secondary - not pressed
      {
        variant: 'secondary',
        pressed: false,
        class: 'bg-[#F3F4F5] text-[#333D4B] hover:bg-[#DEE0E4]',
      },
      // Tertiary - pressed
      {
        variant: 'tertiary',
        pressed: true,
        class: 'bg-[#E6F2FF] text-[#3182F6] hover:bg-[#C1D9FD]',
      },
      // Tertiary - not pressed
      {
        variant: 'tertiary',
        pressed: false,
        class: 'bg-[#F3F4F5] text-[#333D4B] hover:bg-[#DEE0E4]',
      },
      // Ghost - pressed
      {
        variant: 'ghost',
        pressed: true,
        class: 'bg-[#F9FAFB] text-[#3182F6] hover:bg-[#E6F2FF]',
      },
      // Ghost - not pressed
      {
        variant: 'ghost',
        pressed: false,
        class: 'bg-transparent text-[#6B7583] hover:bg-[#F9FAFB]',
      },
    ],
    defaultVariants: {
      variant: 'primary',
      size: 'lg',
      pressed: false,
    },
  }
);

interface ToggleButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'>,
    Omit<VariantProps<typeof toggleButtonVariants>, 'pressed'> {
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
}

const ToggleButton = forwardRef<HTMLButtonElement, ToggleButtonProps>(
  (
    {
      className,
      variant,
      size,
      pressed: controlledPressed,
      defaultPressed = false,
      onPressedChange,
      children,
      ...props
    },
    ref
  ) => {
    const [internalPressed, setInternalPressed] = useState(defaultPressed);
    const isControlled = controlledPressed !== undefined;
    const pressed = isControlled ? controlledPressed : internalPressed;

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!isControlled) {
        setInternalPressed(!pressed);
      }
      onPressedChange?.(!pressed);
      props.onClick?.(e);
    };

    return (
      <button
        ref={ref}
        type="button"
        aria-pressed={pressed}
        className={cn(toggleButtonVariants({ variant, size, pressed }), className)}
        onClick={handleClick}
        {...props}
      >
        {children}
      </button>
    );
  }
);

ToggleButton.displayName = 'ToggleButton';

export { ToggleButton, toggleButtonVariants, type ToggleButtonProps };
