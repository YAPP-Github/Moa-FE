import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef } from 'react';
import { cn } from '@/shared/lib/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center cursor-pointer font-semibold leading-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3182F6]/30 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-[#3182F6] text-[#FFFFFF] hover:bg-[#0062BC]',
        secondary: 'bg-[#E6F2FF] text-[#3182F6] hover:bg-[#C1D9FD]',
        tertiary: 'bg-[#F3F4F5] text-[#333D4B] hover:bg-[#DEE0E4]',
        ghost: 'bg-transparent text-[#6B7583] hover:bg-[#F9FAFB]',
      },
      size: {
        xs: 'h-6 px-2 text-xs rounded',
        sm: 'h-7 px-2.5 text-xs rounded',
        md: 'h-8 px-3 text-sm rounded-md',
        lg: 'h-9 px-4 text-sm rounded-md',
        xl: 'h-12 px-6 text-base rounded-lg',
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
