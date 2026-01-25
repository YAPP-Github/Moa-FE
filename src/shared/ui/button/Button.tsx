import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef } from 'react';
import { cn } from '@/shared/lib';

const buttonVariants = cva(
  'inline-flex items-center justify-center cursor-pointer text-[14px] font-semibold leading-none transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[#3182F6]/30 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-[#3182F6] text-[#FFFFFF] hover:bg-[#1B64DA]',
        ghost: 'text-[#6B7583] hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        sm: 'h-8 px-3 rounded-md',
        md: 'h-9 px-4 rounded-md',
        lg: 'h-12 px-6 rounded-lg',
        icon: 'h-9 w-9 rounded-md',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
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
