import { useFormContext } from 'react-hook-form';
import type { CreateRetrospectFormData } from '@/features/retrospective/model/schema';
import { FormHeader } from '@/features/retrospective/ui/steps/FormHeader';
import { StepIndicator } from '@/features/retrospective/ui/steps/StepIndicator';
import { Button } from '@/shared/ui/button/Button';
import { Field, FieldLabel } from '@/shared/ui/field/Field';
import { Input } from '@/shared/ui/input/Input';
import { useStepContext } from '@/shared/ui/multi-step-form/MultiStepForm';

interface ProjectNameStepProps {
  onClose: () => void;
}

export function ProjectNameStep({ onClose }: ProjectNameStepProps) {
  const { register, watch } = useFormContext<CreateRetrospectFormData>();
  const { goToNextStep } = useStepContext();

  const projectName = watch('projectName');

  return (
    <div className="flex h-full flex-col">
      <FormHeader onClose={onClose} />

      <div className="flex flex-col gap-[32px] px-2">
        <div>
          <StepIndicator />
          <div className="flex flex-col">
            <span className="text-title-2 text-grey-1000">어떤 프로젝트</span>
            <span className="text-title-2 text-grey-1000">회고를 진행하나요?</span>
          </div>
        </div>

        <Field>
          <FieldLabel htmlFor="projectName">프로젝트 이름</FieldLabel>
          <div className="flex flex-col gap-[2px]">
            <Input
              id="projectName"
              placeholder="프로젝트 이름을 입력해주세요"
              maxLength={20}
              {...register('projectName')}
            />
            <div className="flex">
              <span className="ml-auto text-caption-3-medium text-grey-400">
                <span
                  className={(projectName?.length ?? 0) > 0 ? 'text-grey-900' : 'text-grey-400'}
                >
                  {projectName?.length ?? 0}
                </span>
                /20
              </span>
            </div>
          </div>
        </Field>
      </div>

      <div className="mt-auto flex justify-end px-2">
        <Button
          type="button"
          variant="primary"
          onClick={goToNextStep}
          disabled={!projectName?.trim()}
          className="h-[32px] px-[18.5px] py-[7px]"
        >
          다음
        </Button>
      </div>
    </div>
  );
}
