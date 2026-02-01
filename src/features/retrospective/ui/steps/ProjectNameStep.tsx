import { useFormContext } from 'react-hook-form';
import type { CreateRetrospectFormData } from '@/features/retrospective/model/schema';
import { FormHeader } from '@/features/retrospective/ui/steps/FormHeader';
import { StepIndicator } from '@/features/retrospective/ui/steps/StepIndicator';
import { Button } from '@/shared/ui/button/Button';
import { Field, FieldError, FieldLabel } from '@/shared/ui/field/Field';
import { Input } from '@/shared/ui/input/Input';
import { useStepContext } from '@/shared/ui/multi-step-form/MultiStepForm';

interface ProjectNameStepProps {
  onClose: () => void;
}

export function ProjectNameStep({ onClose }: ProjectNameStepProps) {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<CreateRetrospectFormData>();
  const { goToNextStep } = useStepContext();

  const projectName = watch('projectName');

  const handleNext = async () => {
    await goToNextStep();
  };

  return (
    <div className="flex h-full flex-col">
      <FormHeader onClose={onClose} />

      <div className="flex flex-col gap-6">
        <div>
          <StepIndicator />
          <div className="flex flex-col">
            <span className="text-title-2 text-grey-1000">어떤 프로젝트</span>
            <span className="text-title-2 text-grey-1000">회고를 진행하나요?</span>
          </div>
        </div>

        <Field>
          <FieldLabel htmlFor="projectName" required>
            프로젝트 이름
          </FieldLabel>
          <div className="flex flex-col gap-0.5">
            <Input
              id="projectName"
              placeholder="프로젝트 이름을 입력해주세요"
              maxLength={20}
              error={!!errors.projectName}
              {...register('projectName')}
            />
            <div className="flex">
              <FieldError>{errors.projectName?.message}</FieldError>
              <span className="ml-auto text-sm text-[#A0A9B7]">{projectName?.length ?? 0}/20</span>
            </div>
          </div>
        </Field>
      </div>

      <div className="mt-auto flex justify-end pt-6">
        <Button
          type="button"
          variant="primary"
          size="lg"
          onClick={handleNext}
          disabled={!projectName?.trim()}
        >
          다음
        </Button>
      </div>
    </div>
  );
}
