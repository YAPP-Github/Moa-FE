import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef } from 'react';
import { cn } from '@/shared/lib/cn';

const iconButtonVariants = cva(
  'inline-flex items-center justify-center cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3182F6]/30 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-[#3182F6] text hover:bg-[#0062BC]',
        secondary: 'bg-[#E6F2FF] text-[#3182F6] hover:bg-[#C1D9FD]',
        tertiary: 'bg-[#F3F4F5] hover:bg-[#E9EBF1] disabled:bg-[#F3F4F5]',
        ghost: 'bg-transparent text-[#333D4B] hover:bg-[#F3F4F5]',
      },
      size: {
        xs: 'size-6', // 24px
        sm: 'size-7', // 28px
        md: 'size-8', // 32px
        lg: 'size-9', // 36px
        xl: 'size-12', // 48px
      },
      shape: {
        square: '',
        circle: 'rounded-full',
      },
    },
    compoundVariants: [
      // Square shapes with 6px border-radius
      { shape: 'square', size: 'xs', class: 'rounded-[6px]' },
      { shape: 'square', size: 'sm', class: 'rounded-[6px]' },
      { shape: 'square', size: 'md', class: 'rounded-[6px]' },
      { shape: 'square', size: 'lg', class: 'rounded-[6px]' },
      { shape: 'square', size: 'xl', class: 'rounded-[6px]' },
    ],
    defaultVariants: {
      variant: 'primary',
      size: 'lg',
      shape: 'square',
    },
  }
);

interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {}

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant, size, shape, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(iconButtonVariants({ variant, size, shape }), className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';

export { IconButton, iconButtonVariants, type IconButtonProps };
