/**
 * RadioCard - Primitive 라디오 카드 컴포넌트
 *
 * 스타일이 없는 primitive 컴포넌트로, 사용처에서 className으로 스타일을 정의합니다.
 * `data-state="checked" | "unchecked"` 속성을 활용하여 선택 상태별 스타일을 적용할 수 있습니다.
 *
 * @example
 * // 기본 사용법
 * <RadioCardGroup value={value} onValueChange={setValue} className="flex flex-col gap-3">
 *   <RadioCardItem
 *     value="option1"
 *     className="rounded-lg p-4 data-[state=checked]:bg-blue-100 data-[state=unchecked]:bg-gray-100"
 *   >
 *     옵션 1
 *   </RadioCardItem>
 * </RadioCardGroup>
 *
 * @example
 * // react-hook-form과 함께 사용
 * <Controller
 *   name="plan"
 *   control={control}
 *   render={({ field }) => (
 *     <RadioCardGroup value={field.value} onValueChange={field.onChange}>
 *       <RadioCardItem value="free">무료</RadioCardItem>
 *       <RadioCardItem value="pro">프로</RadioCardItem>
 *     </RadioCardGroup>
 *   )}
 * />
 */

import { createContext, forwardRef, useContext, useId } from 'react';
import { cn } from '@/shared/lib/cn';

interface RadioCardContextValue {
  name: string;
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
}

const RadioCardContext = createContext<RadioCardContextValue | null>(null);

function useRadioCardContext() {
  const context = useContext(RadioCardContext);
  if (!context) {
    throw new Error('RadioCard components must be used within a RadioCardGroup');
  }
  return context;
}

// ============================================================================
// RadioCardGroup
// ============================================================================

interface RadioCardGroupProps extends React.HTMLAttributes<HTMLFieldSetElement> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  children: React.ReactNode;
}

const RadioCardGroup = forwardRef<HTMLFieldSetElement, RadioCardGroupProps>(
  (
    { className, value, defaultValue, onValueChange, disabled = false, children, ...props },
    ref
  ) => {
    const generatedName = useId();

    return (
      <RadioCardContext.Provider
        value={{
          name: generatedName,
          value,
          onValueChange,
          disabled,
        }}
      >
        <fieldset ref={ref} className={className} disabled={disabled} {...props}>
          {children}
        </fieldset>
      </RadioCardContext.Provider>
    );
  }
);

RadioCardGroup.displayName = 'RadioCardGroup';

// ============================================================================
// RadioCardItem
// ============================================================================

interface RadioCardItemProps extends Omit<React.LabelHTMLAttributes<HTMLLabelElement>, 'onChange'> {
  value: string;
  disabled?: boolean;
  children: React.ReactNode;
}

const RadioCardItem = forwardRef<HTMLLabelElement, RadioCardItemProps>(
  ({ className, value, disabled = false, children, ...props }, ref) => {
    const context = useRadioCardContext();
    const inputId = useId();
    const isDisabled = disabled || context.disabled;
    const isChecked = context.value === value;

    const handleChange = () => {
      if (!isDisabled && context.onValueChange) {
        context.onValueChange(value);
      }
    };

    return (
      <label
        ref={ref}
        htmlFor={inputId}
        data-state={isChecked ? 'checked' : 'unchecked'}
        data-disabled={isDisabled ? '' : undefined}
        className={cn(
          'relative cursor-pointer',
          'has-[input:focus]:outline-none',
          'has-disabled:cursor-not-allowed has-disabled:opacity-50',
          className
        )}
        {...props}
      >
        <input
          type="radio"
          id={inputId}
          name={context.name}
          value={value}
          checked={isChecked}
          disabled={isDisabled}
          onChange={handleChange}
          className="absolute inset-0 opacity-0 pointer-events-none"
        />
        {children}
      </label>
    );
  }
);

RadioCardItem.displayName = 'RadioCardItem';

// ============================================================================
// Exports
// ============================================================================

export { RadioCardGroup, RadioCardItem, type RadioCardGroupProps, type RadioCardItemProps };
