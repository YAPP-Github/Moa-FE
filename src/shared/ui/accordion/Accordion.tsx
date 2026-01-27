/**
 * Accordion - Primitive 아코디언 컴포넌트
 *
 * 스타일이 없는 primitive 컴포넌트로, 사용처에서 className으로 스타일을 정의합니다.
 * `data-state="open" | "closed"` 속성을 활용하여 열림/닫힘 상태별 스타일을 적용할 수 있습니다.
 *
 * @example
 * <AccordionRoot>
 *   <AccordionItem value="item-1">
 *     <AccordionHeader className="flex items-center justify-between py-4">
 *       <span>섹션 제목</span>
 *       <AccordionTrigger className="p-1 data-[state=open]:rotate-180">
 *         <ChevronIcon />
 *       </AccordionTrigger>
 *     </AccordionHeader>
 *     <AccordionContent className="pb-4">
 *       내용 1
 *     </AccordionContent>
 *   </AccordionItem>
 * </AccordionRoot>
 */

import { createContext, forwardRef, useContext, useId, useState } from 'react';

// ============================================================================
// Types
// ============================================================================

interface AccordionRootProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 초기 열린 항목 */
  defaultValue?: string;
  children: React.ReactNode;
}

interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  children: React.ReactNode;
}

interface AccordionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

interface AccordionTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

interface AccordionContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

// ============================================================================
// Contexts
// ============================================================================

interface AccordionContextValue {
  value: string | undefined;
  onItemToggle: (itemValue: string) => void;
}

interface AccordionItemContextValue {
  value: string;
  isOpen: boolean;
  triggerId: string;
  contentId: string;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);
const AccordionItemContext = createContext<AccordionItemContextValue | null>(null);

function useAccordionContext() {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error('Accordion components must be used within an AccordionRoot');
  }
  return context;
}

function useAccordionItemContext() {
  const context = useContext(AccordionItemContext);
  if (!context) {
    throw new Error('AccordionTrigger/AccordionContent must be used within an AccordionItem');
  }
  return context;
}

// ============================================================================
// AccordionRoot
// ============================================================================

const AccordionRoot = forwardRef<HTMLDivElement, AccordionRootProps>((props, ref) => {
  const { defaultValue, className, children, ...restProps } = props;

  const [value, setValue] = useState<string | undefined>(defaultValue);

  const handleItemToggle = (itemValue: string) => {
    setValue((prev) => (prev === itemValue ? undefined : itemValue));
  };

  return (
    <AccordionContext.Provider value={{ value, onItemToggle: handleItemToggle }}>
      <div ref={ref} className={className} {...restProps}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
});

AccordionRoot.displayName = 'AccordionRoot';

// ============================================================================
// AccordionItem
// ============================================================================

const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ className, value, children, ...props }, ref) => {
    const context = useAccordionContext();
    const triggerId = useId();
    const contentId = useId();

    const isOpen = context.value === value;

    return (
      <AccordionItemContext.Provider value={{ value, isOpen, triggerId, contentId }}>
        <div ref={ref} data-state={isOpen ? 'open' : 'closed'} className={className} {...props}>
          {children}
        </div>
      </AccordionItemContext.Provider>
    );
  }
);

AccordionItem.displayName = 'AccordionItem';

// ============================================================================
// AccordionHeader
// ============================================================================

const AccordionHeader = forwardRef<HTMLDivElement, AccordionHeaderProps>(
  ({ className, children, ...props }, ref) => {
    const itemContext = useAccordionItemContext();

    return (
      <div
        ref={ref}
        data-state={itemContext.isOpen ? 'open' : 'closed'}
        className={className}
        {...props}
      >
        {children}
      </div>
    );
  }
);

AccordionHeader.displayName = 'AccordionHeader';

// ============================================================================
// AccordionTrigger
// ============================================================================

const AccordionTrigger = forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ className, children, onClick, ...props }, ref) => {
    const accordionContext = useAccordionContext();
    const itemContext = useAccordionItemContext();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      accordionContext.onItemToggle(itemContext.value);
      onClick?.(e);
    };

    return (
      <button
        ref={ref}
        type="button"
        id={itemContext.triggerId}
        aria-expanded={itemContext.isOpen}
        aria-controls={itemContext.contentId}
        data-state={itemContext.isOpen ? 'open' : 'closed'}
        onClick={handleClick}
        className={className}
        {...props}
      >
        {children}
      </button>
    );
  }
);

AccordionTrigger.displayName = 'AccordionTrigger';

// ============================================================================
// AccordionContent
// ============================================================================

const AccordionContent = forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ className, children, ...props }, ref) => {
    const itemContext = useAccordionItemContext();

    if (!itemContext.isOpen) {
      return null;
    }

    return (
      // biome-ignore lint/a11y/useSemanticElements: role="region"은 aria-labelledby와 함께 접근성 목적으로 사용
      <div
        ref={ref}
        id={itemContext.contentId}
        role="region"
        aria-labelledby={itemContext.triggerId}
        data-state="open"
        className={className}
        {...props}
      >
        {children}
      </div>
    );
  }
);

AccordionContent.displayName = 'AccordionContent';

// ============================================================================
// Exports
// ============================================================================

export {
  AccordionRoot,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionContent,
  type AccordionRootProps,
  type AccordionItemProps,
  type AccordionHeaderProps,
  type AccordionTriggerProps,
  type AccordionContentProps,
};
