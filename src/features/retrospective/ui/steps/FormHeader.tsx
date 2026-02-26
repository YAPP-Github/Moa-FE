import { IconButton } from '@/shared/ui/icon-button/IconButton';
import IcBack from '@/shared/ui/icons/IcBack';
import IcClose from '@/shared/ui/icons/IcClose';
import { useStepContext } from '@/shared/ui/multi-step-form/MultiStepForm';

interface FormHeaderProps {
  onClose: () => void;
}

export function FormHeader({ onClose }: FormHeaderProps) {
  const { isFirstStep, goToPrevStep } = useStepContext();

  return (
    <div className="mb-6 flex items-center justify-between">
      <IconButton
        variant="ghost"
        size="sm"
        onClick={goToPrevStep}
        className={isFirstStep ? 'invisible' : ''}
        aria-label="이전 단계"
      >
        <IcBack className="size-7" />
      </IconButton>
      <IconButton variant="ghost" size="sm" onClick={onClose} aria-label="닫기">
        <IcClose className="size-7" />
      </IconButton>
    </div>
  );
}
