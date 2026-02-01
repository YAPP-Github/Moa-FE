import { useStepContext } from '@/shared/ui/multi-step-form/MultiStepForm';

export function StepIndicator() {
  const { currentStep, totalSteps } = useStepContext();

  return (
    <span className="text-body-2 mb-1">
      <span className="text-blue-500">{currentStep + 1}</span>
      <span className="text-grey-700">/{totalSteps}</span>
    </span>
  );
}
