import { forwardRef } from 'react';
import { cn } from '@/shared/lib';

interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Field = forwardRef<HTMLDivElement, FieldProps>(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={cn('flex flex-col gap-[10px]', className)} {...props}>
      {children}
    </div>
  );
});

Field.displayName = 'Field';

interface FieldLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

const FieldLabel = forwardRef<HTMLLabelElement, FieldLabelProps>(
  ({ className, children, required, ...props }, ref) => {
    return (
      // biome-ignore lint/a11y/noLabelWithoutControl: Compound Component pattern - htmlFor is passed via props
      <label
        ref={ref}
        className={cn('text-sm font-medium leading-none text-[#6B7684]', className)}
        {...props}
      >
        {children}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </label>
    );
  }
);

FieldLabel.displayName = 'FieldLabel';

interface FieldDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const FieldDescription = forwardRef<HTMLParagraphElement, FieldDescriptionProps>(
  ({ className, ...props }, ref) => {
    return <p ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />;
  }
);

FieldDescription.displayName = 'FieldDescription';

interface FieldErrorProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children?: React.ReactNode;
}

const FieldError = forwardRef<HTMLParagraphElement, FieldErrorProps>(
  ({ className, children, ...props }, ref) => {
    if (!children) return null;

    return (
      <p ref={ref} className={cn('text-sm text-destructive', className)} role="alert" {...props}>
        {children}
      </p>
    );
  }
);

FieldError.displayName = 'FieldError';

export {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  type FieldProps,
  type FieldLabelProps,
  type FieldDescriptionProps,
  type FieldErrorProps,
};
