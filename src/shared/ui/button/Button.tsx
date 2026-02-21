import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef } from 'react';
import { cn } from '@/shared/lib/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center cursor-pointer font-semibold leading-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3182F6]/30 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-[#3182F6] text-[#FFFFFF] hover:bg-[#2373EB] active:bg-[#0062BC]',
        secondary: 'bg-[#E6F2FF] text-[#3182F6] hover:bg-[#C1D9FD]',
        tertiary: 'bg-[#F3F4F5] text-[#333D4B] hover:bg-[#DEE0E4]',
        ghost: 'bg-transparent text-[#333D4B] hover:bg-[#F3F4F5]',
      },
      size: {
        xs: 'h-6 px-2 rounded',
        sm: 'h-[23px] rounded-[6px]',
        md: 'h-[32px] px-[16.5px] text-sub-title-5 rounded-[8px]',
        lg: 'h-[32px] px-[8px] text-sub-title-4 rounded-[8px]',
        xl: 'h-[48px] rounded-[6px]',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'lg',
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth = false, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), fullWidth && 'w-full', className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants, type ButtonProps };
