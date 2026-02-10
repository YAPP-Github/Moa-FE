import { cn } from '@/shared/lib/cn';
import IcNote from '@/shared/ui/logos/IcNote';

interface GlobalLoadingProps {
  className?: string;
  onTransitionEnd?: () => void;
}

export function GlobalLoading({ className, onTransitionEnd }: GlobalLoadingProps) {
  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex flex-col items-center justify-center bg-white transition-opacity duration-300',
        className
      )}
      onTransitionEnd={onTransitionEnd}
    >
      <div className="flex flex-col items-center gap-3">
        <IcNote width={48} height={56} className="animate-pulse" />
        <span className="text-title-2 text-grey-900">모아</span>
      </div>

      <div className="absolute bottom-0 h-0.5 w-48 overflow-hidden bg-grey-200">
        <div className="h-full w-12 animate-[loading-slide_1.5s_ease-in-out_infinite] bg-blue-500" />
      </div>
    </div>
  );
}
