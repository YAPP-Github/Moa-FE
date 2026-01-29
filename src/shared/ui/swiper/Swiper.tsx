/**
 * Swiper - 드래그 스크롤 컴포넌트
 *
 * 마우스/터치 드래그로 가로 스크롤이 가능한 primitive 컴포넌트입니다.
 * 스타일이 없으므로, 사용처에서 className으로 스타일을 정의합니다.
 *
 * @example
 * <SwiperRoot className="w-full">
 *   <SwiperContent className="gap-4">
 *     <SwiperItem className="w-[200px] flex-shrink-0">
 *       <Card>Item 1</Card>
 *     </SwiperItem>
 *     <SwiperItem className="w-[200px] flex-shrink-0">
 *       <Card>Item 2</Card>
 *     </SwiperItem>
 *   </SwiperContent>
 * </SwiperRoot>
 */

import { createContext, forwardRef, useCallback, useContext, useRef, useState } from 'react';
import { cn } from '@/shared/lib/cn';

// ============================================================================
// Types
// ============================================================================

interface SwiperRootProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

interface SwiperContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 좌우 여백 (Content Inset) - 숫자(px) 또는 CSS 값 */
  inset?: number | string;
  children: React.ReactNode;
}

interface SwiperItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

// ============================================================================
// Context
// ============================================================================

interface SwiperContextValue {
  isDragging: boolean;
  setIsDragging: (value: boolean) => void;
}

const SwiperContext = createContext<SwiperContextValue | null>(null);

function useSwiperContext() {
  const context = useContext(SwiperContext);
  if (!context) {
    throw new Error('Swiper components must be used within a SwiperRoot');
  }
  return context;
}

// ============================================================================
// SwiperRoot
// ============================================================================

const SwiperRoot = forwardRef<HTMLDivElement, SwiperRootProps>((props, ref) => {
  const { className, children, ...restProps } = props;

  const [isDragging, setIsDragging] = useState(false);

  return (
    <SwiperContext.Provider value={{ isDragging, setIsDragging }}>
      <div ref={ref} className={cn('relative overflow-hidden', className)} {...restProps}>
        {children}
      </div>
    </SwiperContext.Provider>
  );
});

SwiperRoot.displayName = 'SwiperRoot';

// ============================================================================
// SwiperContent
// ============================================================================

const SwiperContent = forwardRef<HTMLDivElement, SwiperContentProps>(
  ({ className, children, inset, style, ...props }, ref) => {
    const { isDragging, setIsDragging } = useSwiperContext();
    const containerRef = useRef<HTMLDivElement | null>(null);
    const dragState = useRef({
      isDown: false,
      startX: 0,
      scrollLeft: 0,
    });

    // Combine refs
    const setRefs = useCallback(
      (node: HTMLDivElement | null) => {
        containerRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref]
    );

    const handleMouseDown = useCallback(
      (e: React.MouseEvent) => {
        const container = containerRef.current;
        if (!container) return;

        dragState.current = {
          isDown: true,
          startX: e.pageX - container.offsetLeft,
          scrollLeft: container.scrollLeft,
        };
        setIsDragging(true);
      },
      [setIsDragging]
    );

    const handleMouseUp = useCallback(() => {
      dragState.current.isDown = false;
      setIsDragging(false);
    }, [setIsDragging]);

    const handleMouseLeave = useCallback(() => {
      if (dragState.current.isDown) {
        dragState.current.isDown = false;
        setIsDragging(false);
      }
    }, [setIsDragging]);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
      if (!dragState.current.isDown) return;
      e.preventDefault();

      const container = containerRef.current;
      if (!container) return;

      const x = e.pageX - container.offsetLeft;
      const walk = (x - dragState.current.startX) * 1.5; // 스크롤 속도 조절
      container.scrollLeft = dragState.current.scrollLeft - walk;
    }, []);

    // Touch events
    const handleTouchStart = useCallback(
      (e: React.TouchEvent) => {
        const container = containerRef.current;
        if (!container) return;

        const touch = e.touches[0];
        dragState.current = {
          isDown: true,
          startX: touch.pageX - container.offsetLeft,
          scrollLeft: container.scrollLeft,
        };
        setIsDragging(true);
      },
      [setIsDragging]
    );

    const handleTouchEnd = useCallback(() => {
      dragState.current.isDown = false;
      setIsDragging(false);
    }, [setIsDragging]);

    const handleTouchMove = useCallback((e: React.TouchEvent) => {
      if (!dragState.current.isDown) return;

      const container = containerRef.current;
      if (!container) return;

      const touch = e.touches[0];
      const x = touch.pageX - container.offsetLeft;
      const walk = (x - dragState.current.startX) * 1.5;
      container.scrollLeft = dragState.current.scrollLeft - walk;
    }, []);

    return (
      // biome-ignore lint/a11y/noStaticElementInteractions: 드래그는 보조 기능, 기본 스크롤과 내부 요소 Tab 접근 가능
      <div
        ref={setRefs}
        className={cn(
          'flex overflow-x-auto',
          // 네이티브 스크롤바 숨기기
          'scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none]',
          '[&::-webkit-scrollbar]:hidden',
          // 커서 상태
          isDragging ? 'cursor-grabbing' : 'cursor-grab',
          // 드래그 중 선택 방지
          isDragging && 'select-none',
          className
        )}
        style={{
          ...style,
          ...(inset !== undefined && {
            paddingInline: typeof inset === 'number' ? `${inset}px` : inset,
          }),
        }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchMove}
        {...props}
      >
        {children}
      </div>
    );
  }
);

SwiperContent.displayName = 'SwiperContent';

// ============================================================================
// SwiperItem
// ============================================================================

const SwiperItem = forwardRef<HTMLDivElement, SwiperItemProps>(
  ({ className, children, ...props }, ref) => {
    const { isDragging } = useSwiperContext();

    return (
      <div
        ref={ref}
        className={cn(
          'shrink-0',
          // 드래그 중 클릭 방지 (링크 등)
          isDragging && 'pointer-events-none',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

SwiperItem.displayName = 'SwiperItem';

// ============================================================================
// Exports
// ============================================================================

export {
  SwiperRoot,
  SwiperContent,
  SwiperItem,
  type SwiperRootProps,
  type SwiperContentProps,
  type SwiperItemProps,
};
