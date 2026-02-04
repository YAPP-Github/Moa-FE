/**
 * SidePanel - 우측 슬라이드 패널 컴포넌트
 *
 * 화면 우측에서 슬라이드인하여 등장하는 패널 컴포넌트입니다.
 * Portal을 사용하여 document.body에 렌더링됩니다.
 *
 * @example
 * <SidePanel open={isOpen} onOpenChange={setIsOpen}>
 *   <div>Panel Content</div>
 * </SidePanel>
 */

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/shared/lib/cn';

interface SidePanelProps {
  /** 패널 열림 상태 */
  open: boolean;
  /** 열림/닫힘 상태 변경 콜백 */
  onOpenChange: (open: boolean) => void;
  /** 패널 너비 (기본값: 640px) */
  width?: string;
  /** 상단 오프셋 (헤더 아래부터 시작, 기본값: 0) */
  topOffset?: string;
  /** 백드롭(오버레이) 표시 여부 (기본값: true) */
  showBackdrop?: boolean;
  /** 패널 내용 */
  children: React.ReactNode;
  /** 추가 클래스 */
  className?: string;
}

function SidePanel({
  open,
  onOpenChange,
  width = '640px',
  topOffset = '0px',
  showBackdrop = true,
  children,
  className,
}: SidePanelProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  // Handle open/close animation
  useEffect(() => {
    if (open) {
      setShouldRender(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(true);
        });
      });
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [open]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onOpenChange(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onOpenChange]);

  if (!shouldRender) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-50 pointer-events-none" style={{ top: topOffset }}>
      {/* Backdrop (optional) */}
      {showBackdrop && (
        <div
          className={cn(
            'absolute inset-0 bg-black/30 transition-opacity duration-300 pointer-events-auto',
            isAnimating ? 'opacity-100' : 'opacity-0'
          )}
          onClick={() => onOpenChange(false)}
          aria-hidden="true"
        />
      )}

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          'absolute top-0 right-0 h-full bg-white shadow-xl transition-transform duration-300 ease-out pointer-events-auto',
          isAnimating ? 'translate-x-0' : 'translate-x-full',
          className
        )}
        style={{ width }}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}

export { SidePanel, type SidePanelProps };
