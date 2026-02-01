import { Button } from '@/shared/ui/button/Button';

interface CompleteStepProps {
  onClose: () => void;
}

export function CompleteStep({ onClose }: CompleteStepProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
          <svg
            aria-hidden="true"
            className="h-8 w-8 text-blue-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-title-2 text-grey-1000">회고가 생성되었어요!</span>
          <span className="text-body-2 text-grey-700">팀원들과 함께 회고를 진행해보세요</span>
        </div>
      </div>

      <div className="mt-8">
        <Button variant="primary" size="lg" onClick={onClose}>
          확인
        </Button>
      </div>
    </div>
  );
}
