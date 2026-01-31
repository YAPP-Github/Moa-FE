/**
 * Dialog - Primitive 다이얼로그 컴포넌트
 *
 * 스타일이 없는 primitive 컴포넌트로, 사용처에서 className으로 스타일을 정의합니다.
 * `data-state="open" | "closed"` 속성을 활용하여 열림/닫힘 상태별 스타일을 적용할 수 있습니다.
 *
 * @example
 * <DialogRoot>
 *   <DialogTrigger className="px-4 py-2 bg-blue-500 text-white rounded">
 *     열기
 *   </DialogTrigger>
 *   <DialogPortal>
 *     <DialogOverlay className="fixed inset-0 bg-black/50" />
 *     <DialogContent className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 sm:max-w-[400px]">
 *       <DialogHeader>
 *         <DialogTitle className="text-lg font-semibold">제목</DialogTitle>
 *         <DialogDescription className="text-sm text-gray-500">설명</DialogDescription>
 *       </DialogHeader>
 *       <div>내용</div>
 *       <DialogFooter className="flex justify-end gap-2">
 *         <DialogClose className="px-4 py-2">닫기</DialogClose>
 *       </DialogFooter>
 *     </DialogContent>
 *   </DialogPortal>
 * </DialogRoot>
 */

import {
  cloneElement,
  createContext,
  forwardRef,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useId,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/shared/lib/cn';
import { IconButton } from '@/shared/ui/icon-button/IconButton';
import IcClose from '@/shared/ui/icons/IcClose';

// ============================================================================
// Types
// ============================================================================

interface DialogRootProps {
  /** 외부에서 open 상태 제어 (Controlled) */
  open?: boolean;
  /** open 상태 변경 핸들러 */
  onOpenChange?: (open: boolean) => void;
  /** 초기 open 상태 (Uncontrolled) */
  defaultOpen?: boolean;
  children: React.ReactNode;
}

interface DialogTriggerProps {
  /** 클릭 가능한 단일 React Element */
  children: React.ReactElement;
}

interface DialogPortalProps {
  /** Portal 렌더링 대상 (기본: document.body) */
  container?: HTMLElement;
  children: React.ReactNode;
}

interface DialogOverlayProps extends React.HTMLAttributes<HTMLDivElement> {}

interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Overlay 클릭 시 닫기 비활성화 */
  disableOutsideClick?: boolean;
  /** ESC 키로 닫기 비활성화 */
  disableEscapeKey?: boolean;
  /** 우측 상단 닫기 버튼 숨김 */
  hideCloseButton?: boolean;
  children: React.ReactNode;
}

interface DialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

interface DialogFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

interface DialogTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

interface DialogDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

interface DialogCloseProps {
  /** 클릭 가능한 단일 React Element */
  children: React.ReactElement;
}

// ============================================================================
// Context
// ============================================================================

interface DialogContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  titleId: string;
  descriptionId: string;
  contentId: string;
}

const DialogContext = createContext<DialogContextValue | null>(null);

function useDialogContext() {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('Dialog components must be used within a DialogRoot');
  }
  return context;
}

// ============================================================================
// DialogRoot
// ============================================================================

function DialogRoot({
  open: controlledOpen,
  onOpenChange,
  defaultOpen = false,
  children,
}: DialogRootProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(newOpen);
      }
      onOpenChange?.(newOpen);
    },
    [isControlled, onOpenChange]
  );

  const titleId = useId();
  const descriptionId = useId();
  const contentId = useId();

  // body 스크롤 잠금
  useEffect(() => {
    if (open) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [open]);

  return (
    <DialogContext.Provider
      value={{
        open,
        onOpenChange: handleOpenChange,
        titleId,
        descriptionId,
        contentId,
      }}
    >
      {children}
    </DialogContext.Provider>
  );
}

DialogRoot.displayName = 'DialogRoot';

// ============================================================================
// DialogTrigger
// ============================================================================

function DialogTrigger({ children }: DialogTriggerProps) {
  const { open, onOpenChange, contentId } = useDialogContext();

  if (!isValidElement(children)) {
    throw new Error('DialogTrigger requires a single valid React element as children');
  }

  const handleClick = (e: React.MouseEvent) => {
    onOpenChange(true);
    // 기존 onClick 유지
    const childProps = children.props as {
      onClick?: (e: React.MouseEvent) => void;
    };
    childProps.onClick?.(e);
  };

  return cloneElement(children, {
    'aria-haspopup': 'dialog',
    'aria-expanded': open,
    'aria-controls': open ? contentId : undefined,
    'data-state': open ? 'open' : 'closed',
    onClick: handleClick,
  } as React.HTMLAttributes<HTMLElement>);
}

DialogTrigger.displayName = 'DialogTrigger';

// ============================================================================
// DialogPortal
// ============================================================================

function DialogPortal({ container, children }: DialogPortalProps) {
  const { open } = useDialogContext();

  if (!open) {
    return null;
  }

  return createPortal(children, container ?? document.body);
}

DialogPortal.displayName = 'DialogPortal';

// ============================================================================
// DialogOverlay
// ============================================================================

const DialogOverlay = forwardRef<HTMLDivElement, DialogOverlayProps>(
  ({ className, ...props }, ref) => {
    const { open } = useDialogContext();

    return (
      <div
        ref={ref}
        data-state={open ? 'open' : 'closed'}
        aria-hidden="true"
        className={cn('fixed inset-0 z-50', className)}
        {...props}
      />
    );
  }
);

DialogOverlay.displayName = 'DialogOverlay';

// ============================================================================
// DialogContent
// ============================================================================

const DialogContent = forwardRef<HTMLDivElement, DialogContentProps>(
  (
    {
      className,
      disableOutsideClick = true,
      disableEscapeKey = false,
      hideCloseButton = false,
      children,
      ...props
    },
    ref
  ) => {
    const { open, onOpenChange, titleId, descriptionId, contentId } = useDialogContext();

    // ESC 키 닫기
    useEffect(() => {
      if (disableEscapeKey) return;

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onOpenChange(false);
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, [disableEscapeKey, onOpenChange]);

    // Overlay 클릭 닫기
    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (disableOutsideClick) return;
      if (e.target === e.currentTarget) {
        onOpenChange(false);
      }
    };

    return (
      // biome-ignore lint/a11y/useKeyWithClickEvents: ESC 키 핸들러는 useEffect에서 처리
      // biome-ignore lint/a11y/noStaticElementInteractions: Overlay 클릭 닫기는 의도된 동작
      <div
        className="fixed inset-0 z-50 flex items-center justify-center"
        onClick={handleOverlayClick}
      >
        <div
          ref={ref}
          id={contentId}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
          data-state={open ? 'open' : 'closed'}
          className={cn('relative z-50 w-full max-w-[calc(100%-2rem)] sm:max-w-lg', className)}
          {...props}
        >
          {!hideCloseButton && (
            <IconButton
              variant="ghost"
              size="md"
              onClick={() => onOpenChange(false)}
              className="absolute right-5 top-5"
              aria-label="닫기"
            >
              <IcClose className="h-6 w-6" />
            </IconButton>
          )}
          {children}
        </div>
      </div>
    );
  }
);

DialogContent.displayName = 'DialogContent';

// ============================================================================
// DialogHeader
// ============================================================================

const DialogHeader = forwardRef<HTMLDivElement, DialogHeaderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={className} {...props}>
        {children}
      </div>
    );
  }
);

DialogHeader.displayName = 'DialogHeader';

// ============================================================================
// DialogFooter
// ============================================================================

const DialogFooter = forwardRef<HTMLDivElement, DialogFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={className} {...props}>
        {children}
      </div>
    );
  }
);

DialogFooter.displayName = 'DialogFooter';

// ============================================================================
// DialogTitle
// ============================================================================

const DialogTitle = forwardRef<HTMLHeadingElement, DialogTitleProps>(
  ({ className, children, ...props }, ref) => {
    const { titleId } = useDialogContext();

    return (
      <h2 ref={ref} id={titleId} className={className} {...props}>
        {children}
      </h2>
    );
  }
);

DialogTitle.displayName = 'DialogTitle';

// ============================================================================
// DialogDescription
// ============================================================================

const DialogDescription = forwardRef<HTMLParagraphElement, DialogDescriptionProps>(
  ({ className, children, ...props }, ref) => {
    const { descriptionId } = useDialogContext();

    return (
      <p ref={ref} id={descriptionId} className={className} {...props}>
        {children}
      </p>
    );
  }
);

DialogDescription.displayName = 'DialogDescription';

// ============================================================================
// DialogClose
// ============================================================================

function DialogClose({ children }: DialogCloseProps) {
  const { onOpenChange } = useDialogContext();

  if (!isValidElement(children)) {
    throw new Error('DialogClose requires a single valid React element as children');
  }

  const handleClick = (e: React.MouseEvent) => {
    onOpenChange(false);
    // 기존 onClick 유지
    const childProps = children.props as {
      onClick?: (e: React.MouseEvent) => void;
    };
    childProps.onClick?.(e);
  };

  return cloneElement(children, {
    onClick: handleClick,
  } as React.HTMLAttributes<HTMLElement>);
}

DialogClose.displayName = 'DialogClose';

// ============================================================================
// Exports
// ============================================================================

export {
  DialogRoot,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
  type DialogRootProps,
  type DialogTriggerProps,
  type DialogPortalProps,
  type DialogOverlayProps,
  type DialogContentProps,
  type DialogHeaderProps,
  type DialogFooterProps,
  type DialogTitleProps,
  type DialogDescriptionProps,
  type DialogCloseProps,
};
