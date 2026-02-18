/**
 * DropdownMenu - Primitive 드롭다운 메뉴 컴포넌트
 *
 * 스타일이 없는 primitive 컴포넌트로, 사용처에서 className으로 스타일을 정의합니다.
 * `data-state="open" | "closed"` 속성을 활용하여 열림/닫힘 상태별 스타일을 적용할 수 있습니다.
 * `data-highlighted` 속성을 활용하여 포커스된 아이템 스타일을 적용할 수 있습니다.
 *
 * @example
 * <DropdownMenuRoot>
 *   <DropdownMenuTrigger>
 *     <button>메뉴 열기</button>
 *   </DropdownMenuTrigger>
 *   <DropdownMenuPortal>
 *     <DropdownMenuContent className="bg-white rounded-lg shadow-lg border p-1">
 *       <DropdownMenuItem className="px-3 py-2 hover:bg-grey-100 rounded cursor-pointer">
 *         항목 1
 *       </DropdownMenuItem>
 *       <DropdownMenuSeparator className="h-px bg-grey-200 my-1" />
 *       <DropdownMenuItem className="px-3 py-2 hover:bg-grey-100 rounded cursor-pointer">
 *         항목 2
 *       </DropdownMenuItem>
 *     </DropdownMenuContent>
 *   </DropdownMenuPortal>
 * </DropdownMenuRoot>
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
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/shared/lib/cn';

// ============================================================================
// Types
// ============================================================================

interface DropdownMenuRootProps {
  /** 외부에서 open 상태 제어 (Controlled) */
  open?: boolean;
  /** open 상태 변경 핸들러 */
  onOpenChange?: (open: boolean) => void;
  /** 초기 open 상태 (Uncontrolled) */
  defaultOpen?: boolean;
  children: React.ReactNode;
}

interface DropdownMenuTriggerProps {
  /** 클릭 가능한 단일 React Element */
  children: React.ReactElement;
}

interface DropdownMenuPortalProps {
  /** Portal 렌더링 대상 (기본: document.body) */
  container?: HTMLElement;
  children: React.ReactNode;
}

interface DropdownMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 트리거 기준 수평 정렬 */
  align?: 'start' | 'center' | 'end';
  /** 트리거 기준 수직 위치 */
  side?: 'top' | 'bottom';
  /** 트리거와의 간격 (px) */
  sideOffset?: number;
  /** ESC 키 핸들러 */
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  children: React.ReactNode;
}

interface DropdownMenuItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 비활성화 여부 */
  disabled?: boolean;
  /** 아이템 선택 시 콜백 */
  onSelect?: () => void;
  children: React.ReactNode;
}

interface DropdownMenuSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {}

// ============================================================================
// Context
// ============================================================================

interface DropdownMenuContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  triggerId: string;
  contentId: string;
  triggerRef: React.RefObject<HTMLElement | null>;
}

interface DropdownMenuContentContextValue {
  highlightedIndex: number;
  setHighlightedIndex: (index: number) => void;
  itemsRef: React.MutableRefObject<(HTMLDivElement | null)[]>;
  registerItem: (element: HTMLDivElement | null, index: number) => void;
  closeMenu: () => void;
}

const DropdownMenuContext = createContext<DropdownMenuContextValue | null>(null);
const DropdownMenuContentContext = createContext<DropdownMenuContentContextValue | null>(null);

function useDropdownMenuContext() {
  const context = useContext(DropdownMenuContext);
  if (!context) {
    throw new Error('DropdownMenu components must be used within a DropdownMenuRoot');
  }
  return context;
}

function useDropdownMenuContentContext() {
  const context = useContext(DropdownMenuContentContext);
  if (!context) {
    throw new Error('DropdownMenuItem must be used within a DropdownMenuContent');
  }
  return context;
}

// ============================================================================
// DropdownMenuRoot
// ============================================================================

function DropdownMenuRoot({
  open: controlledOpen,
  onOpenChange,
  defaultOpen = false,
  children,
}: DropdownMenuRootProps) {
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

  const triggerId = useId();
  const contentId = useId();
  const triggerRef = useRef<HTMLElement | null>(null);

  return (
    <DropdownMenuContext.Provider
      value={{
        open,
        onOpenChange: handleOpenChange,
        triggerId,
        contentId,
        triggerRef,
      }}
    >
      {children}
    </DropdownMenuContext.Provider>
  );
}

DropdownMenuRoot.displayName = 'DropdownMenuRoot';

// ============================================================================
// DropdownMenuTrigger
// ============================================================================

function DropdownMenuTrigger({ children }: DropdownMenuTriggerProps) {
  const { open, onOpenChange, contentId, triggerId, triggerRef } = useDropdownMenuContext();

  if (!isValidElement(children)) {
    throw new Error('DropdownMenuTrigger requires a single valid React element as children');
  }

  const handleClick = (e: React.MouseEvent) => {
    onOpenChange(!open);
    const childProps = children.props as {
      onClick?: (e: React.MouseEvent) => void;
    };
    childProps.onClick?.(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onOpenChange(true);
    }
    const childProps = children.props as {
      onKeyDown?: (e: React.KeyboardEvent) => void;
    };
    childProps.onKeyDown?.(e);
  };

  return cloneElement(children, {
    ref: (node: HTMLElement | null) => {
      triggerRef.current = node;
      const childRef = (children as React.ReactElement & { ref?: React.Ref<HTMLElement> }).ref;
      if (typeof childRef === 'function') {
        childRef(node);
      } else if (childRef && typeof childRef === 'object') {
        (childRef as React.MutableRefObject<HTMLElement | null>).current = node;
      }
    },
    id: triggerId,
    'aria-haspopup': 'menu',
    'aria-expanded': open,
    'aria-controls': open ? contentId : undefined,
    'data-state': open ? 'open' : 'closed',
    onClick: handleClick,
    onKeyDown: handleKeyDown,
  } as React.HTMLAttributes<HTMLElement>);
}

DropdownMenuTrigger.displayName = 'DropdownMenuTrigger';

// ============================================================================
// DropdownMenuPortal
// ============================================================================

function DropdownMenuPortal({ container, children }: DropdownMenuPortalProps) {
  const { open } = useDropdownMenuContext();

  if (!open) {
    return null;
  }

  return createPortal(children, container ?? document.body);
}

DropdownMenuPortal.displayName = 'DropdownMenuPortal';

// ============================================================================
// DropdownMenuContent
// ============================================================================

const DropdownMenuContent = forwardRef<HTMLDivElement, DropdownMenuContentProps>(
  (
    {
      className,
      align = 'start',
      side = 'bottom',
      sideOffset = 4,
      onEscapeKeyDown,
      children,
      ...props
    },
    ref
  ) => {
    const { open, onOpenChange, contentId, triggerId, triggerRef } = useDropdownMenuContext();
    const contentRef = useRef<HTMLDivElement>(null);
    const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [position, setPosition] = useState({ top: 0, left: 0 });

    // 아이템 등록
    const registerItem = useCallback((element: HTMLDivElement | null, index: number) => {
      itemsRef.current[index] = element;
    }, []);

    // 메뉴 닫기
    const closeMenu = useCallback(() => {
      onOpenChange(false);
      triggerRef.current?.focus();
    }, [onOpenChange, triggerRef]);

    // 포지션 계산
    useEffect(() => {
      if (!open || !triggerRef.current) return;

      const triggerRect = triggerRef.current.getBoundingClientRect();
      let top = 0;
      let left = 0;

      // 수직 위치
      if (side === 'bottom') {
        top = triggerRect.bottom + sideOffset;
      } else {
        top = triggerRect.top - sideOffset;
      }

      // 수평 정렬
      if (align === 'start') {
        left = triggerRect.left;
      } else if (align === 'center') {
        left = triggerRect.left + triggerRect.width / 2;
      } else {
        left = triggerRect.right;
      }

      setPosition({ top, left });
    }, [open, align, side, sideOffset, triggerRef]);

    // ESC 키 핸들링
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onEscapeKeyDown?.(e);
          if (!e.defaultPrevented) {
            closeMenu();
          }
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, [closeMenu, onEscapeKeyDown]);

    // Outside click 핸들링
    useEffect(() => {
      const handlePointerDown = (e: PointerEvent) => {
        const target = e.target as Node;
        if (
          contentRef.current &&
          !contentRef.current.contains(target) &&
          triggerRef.current &&
          !triggerRef.current.contains(target)
        ) {
          closeMenu();
        }
      };

      document.addEventListener('pointerdown', handlePointerDown);
      return () => document.removeEventListener('pointerdown', handlePointerDown);
    }, [closeMenu, triggerRef]);

    // 키보드 네비게이션
    const handleKeyDown = (e: React.KeyboardEvent) => {
      const enabledItems = itemsRef.current.filter(
        (item) => item && !item.hasAttribute('data-disabled')
      );
      const enabledIndices = itemsRef.current
        .map((item, index) => (item && !item.hasAttribute('data-disabled') ? index : -1))
        .filter((index) => index !== -1);

      if (enabledItems.length === 0) return;

      const currentEnabledIndex = enabledIndices.indexOf(highlightedIndex);

      switch (e.key) {
        case 'ArrowDown': {
          e.preventDefault();
          const nextIndex =
            currentEnabledIndex === -1 || currentEnabledIndex === enabledIndices.length - 1
              ? enabledIndices[0]
              : enabledIndices[currentEnabledIndex + 1];
          setHighlightedIndex(nextIndex);
          itemsRef.current[nextIndex]?.focus();
          break;
        }
        case 'ArrowUp': {
          e.preventDefault();
          const prevIndex =
            currentEnabledIndex === -1 || currentEnabledIndex === 0
              ? enabledIndices[enabledIndices.length - 1]
              : enabledIndices[currentEnabledIndex - 1];
          setHighlightedIndex(prevIndex);
          itemsRef.current[prevIndex]?.focus();
          break;
        }
        case 'Home': {
          e.preventDefault();
          const firstIndex = enabledIndices[0];
          setHighlightedIndex(firstIndex);
          itemsRef.current[firstIndex]?.focus();
          break;
        }
        case 'End': {
          e.preventDefault();
          const lastIndex = enabledIndices[enabledIndices.length - 1];
          setHighlightedIndex(lastIndex);
          itemsRef.current[lastIndex]?.focus();
          break;
        }
        case 'Tab': {
          e.preventDefault();
          closeMenu();
          break;
        }
      }
    };

    // 첫 번째 아이템에 포커스
    useEffect(() => {
      if (open) {
        const timer = setTimeout(() => {
          const enabledIndices = itemsRef.current
            .map((item, index) => (item && !item.hasAttribute('data-disabled') ? index : -1))
            .filter((index) => index !== -1);

          if (enabledIndices.length > 0) {
            const firstIndex = enabledIndices[0];
            setHighlightedIndex(firstIndex);
            itemsRef.current[firstIndex]?.focus();
          }
        }, 0);
        return () => clearTimeout(timer);
      }
      setHighlightedIndex(-1);
    }, [open]);

    const alignStyles = {
      start: 'translate-x-0',
      center: '-translate-x-1/2',
      end: '-translate-x-full',
    };

    const sideStyles = {
      top: '-translate-y-full',
      bottom: 'translate-y-0',
    };

    return (
      <DropdownMenuContentContext.Provider
        value={{
          highlightedIndex,
          setHighlightedIndex,
          itemsRef,
          registerItem,
          closeMenu,
        }}
      >
        <div
          ref={(node) => {
            contentRef.current = node;
            if (typeof ref === 'function') {
              ref(node);
            } else if (ref) {
              ref.current = node;
            }
          }}
          id={contentId}
          role="menu"
          aria-labelledby={triggerId}
          aria-orientation="vertical"
          data-state={open ? 'open' : 'closed'}
          tabIndex={-1}
          onKeyDown={handleKeyDown}
          className={cn('fixed z-50 outline-none', alignStyles[align], sideStyles[side], className)}
          style={{
            top: position.top,
            left: position.left,
          }}
          {...props}
        >
          {children}
        </div>
      </DropdownMenuContentContext.Provider>
    );
  }
);

DropdownMenuContent.displayName = 'DropdownMenuContent';

// ============================================================================
// DropdownMenuItem
// ============================================================================

const DropdownMenuItem = forwardRef<HTMLDivElement, DropdownMenuItemProps>(
  ({ className, disabled = false, onSelect, children, onClick, ...props }, ref) => {
    const { highlightedIndex, setHighlightedIndex, itemsRef, registerItem, closeMenu } =
      useDropdownMenuContentContext();
    const itemRef = useRef<HTMLDivElement>(null);
    const [index, setIndex] = useState(-1);

    // 아이템 등록
    useEffect(() => {
      const currentItems = itemsRef.current;
      const itemIndex = currentItems.length;
      setIndex(itemIndex);
      registerItem(itemRef.current, itemIndex);

      return () => {
        currentItems[itemIndex] = null;
      };
    }, [registerItem, itemsRef]);

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (disabled) {
        e.preventDefault();
        return;
      }
      onClick?.(e);
      onSelect?.();
      closeMenu();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (disabled) return;

      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onSelect?.();
        closeMenu();
      }
    };

    const handlePointerEnter = () => {
      if (!disabled) {
        setHighlightedIndex(index);
      }
    };

    const handlePointerLeave = () => {
      setHighlightedIndex(-1);
    };

    const isHighlighted = highlightedIndex === index;

    return (
      <div
        ref={(node) => {
          itemRef.current = node;
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        role="menuitem"
        tabIndex={disabled ? undefined : -1}
        aria-disabled={disabled || undefined}
        data-disabled={disabled || undefined}
        data-highlighted={isHighlighted || undefined}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        className={cn('outline-none', disabled && 'pointer-events-none opacity-50', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

DropdownMenuItem.displayName = 'DropdownMenuItem';

// ============================================================================
// DropdownMenuSeparator
// ============================================================================

const DropdownMenuSeparator = forwardRef<HTMLDivElement, DropdownMenuSeparatorProps>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} aria-hidden="true" className={className} {...props} />;
  }
);

DropdownMenuSeparator.displayName = 'DropdownMenuSeparator';

// ============================================================================
// Exports
// ============================================================================

export {
  DropdownMenuRoot,
  DropdownMenuTrigger,
  DropdownMenuPortal,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  type DropdownMenuRootProps,
  type DropdownMenuTriggerProps,
  type DropdownMenuPortalProps,
  type DropdownMenuContentProps,
  type DropdownMenuItemProps,
  type DropdownMenuSeparatorProps,
};
