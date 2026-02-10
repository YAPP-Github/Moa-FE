/**
 * Toast - 알림 토스트 컴포넌트
 *
 * 상단 중앙에서 등장하여 3초 후 자동으로 사라지는 알림 컴포넌트입니다.
 * success와 warning 두 가지 상태를 지원하며, 여러 토스트가 스택 형태로 쌓입니다.
 *
 * @example
 * // 1. 앱 최상위에 ToastContainer 추가
 * import { ToastContainer } from '@/shared/ui/toast/Toast';
 * <ToastContainer />
 *
 * // 2. useToast 훅으로 토스트 표시
 * import { useToast } from '@/shared/ui/toast/Toast';
 * const { showToast } = useToast();
 * showToast({ variant: 'success', message: '저장되었습니다!' });
 */

import { cva } from 'class-variance-authority';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { create } from 'zustand';
import { cn } from '@/shared/lib/cn';
import IcToastSuccess from '@/shared/ui/icons/IcToastSuccess';
import IcToastWarning from '@/shared/ui/icons/IcToastWarning';

// ============================================================================
// Types
// ============================================================================

type ToastVariant = 'success' | 'warning';

interface ToastData {
  id: string;
  variant: ToastVariant;
  message: string;
  duration?: number;
}

interface ToastStore {
  toasts: ToastData[];
  addToast: (toast: Omit<ToastData, 'id'>) => void;
  removeToast: (id: string) => void;
}

// ============================================================================
// Zustand Store
// ============================================================================

const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }],
    }));
  },
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },
}));

// ============================================================================
// useToast Hook
// ============================================================================

function useToast() {
  const addToast = useToastStore((state) => state.addToast);

  const showToast = (options: Omit<ToastData, 'id'>) => {
    addToast(options);
  };

  return { showToast };
}

// ============================================================================
// Variants
// ============================================================================

const toastVariants = cva(
  'flex w-[400px] items-center gap-2 rounded-[10px] bg-grey-1000 px-[14px] py-2',
  {
    variants: {
      variant: {
        success: '',
        warning: '',
      },
    },
    defaultVariants: {
      variant: 'success',
    },
  }
);

// ============================================================================
// Icon Config
// ============================================================================

const iconComponents = {
  success: IcToastSuccess,
  warning: IcToastWarning,
};

const iconColors = {
  success: 'text-green-500',
  warning: 'text-[#F59E0B]',
};

// ============================================================================
// ToastItem Component
// ============================================================================

interface ToastItemProps {
  toast: ToastData;
  onRemove: (id: string) => void;
}

function ToastItem({ toast, onRemove }: ToastItemProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const IconComponent = iconComponents[toast.variant];
  const duration = toast.duration ?? 3000;

  // Enter animation
  useEffect(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsAnimating(true);
      });
    });
  }, []);

  // Auto-dismiss
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsExiting(true);
        setIsAnimating(false);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration]);

  // Remove after exit animation
  useEffect(() => {
    if (isExiting) {
      const timer = setTimeout(() => {
        onRemove(toast.id);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isExiting, onRemove, toast.id]);

  return (
    <div
      role="alert"
      aria-live="polite"
      className={cn(
        toastVariants({ variant: toast.variant }),
        'transition-all duration-300 ease-out',
        isAnimating ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      )}
    >
      {/* Icon */}
      <div className="shrink-0">
        <IconComponent className={cn('h-4 w-4', iconColors[toast.variant])} />
      </div>

      {/* Message */}
      <span className="flex-1 text-caption-2 font-medium text-white">{toast.message}</span>
    </div>
  );
}

// ============================================================================
// ToastContainer Component
// ============================================================================

function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);

  if (toasts.length === 0) {
    return null;
  }

  return createPortal(
    <div className="fixed top-[54px] left-1/2 z-50 flex -translate-x-1/2 flex-col gap-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>,
    document.body
  );
}

// ============================================================================
// Exports
// ============================================================================

// React 외부에서 토스트 호출 (MutationCache 글로벌 에러 핸들러 등)
const toastStore = useToastStore;

export { ToastContainer, useToast, toastStore, toastVariants, type ToastData, type ToastVariant };
