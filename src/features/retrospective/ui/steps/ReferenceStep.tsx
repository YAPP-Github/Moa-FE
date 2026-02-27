import { useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import type { CreateRetrospectFormData } from '@/features/retrospective/model/schema';
import { FormHeader } from '@/features/retrospective/ui/steps/FormHeader';
import { ReferenceUrlStep } from '@/features/retrospective/ui/steps/ReferenceUrlStep';
import { StepIndicator } from '@/features/retrospective/ui/steps/StepIndicator';
import { Button } from '@/shared/ui/button/Button';
import SvgIcCheckCircleActive from '@/shared/ui/icons/IcCheckCircleActive';
import SvgIcCheckCircleInactive from '@/shared/ui/icons/IcCheckCircleInactive';
import { RadioCardGroup, RadioCardItem } from '@/shared/ui/radio-card/RadioCard';

interface ReferenceStepProps {
  onClose: () => void;
}

type ReferenceChoice = 'yes' | 'no';

export function ReferenceStep({ onClose }: ReferenceStepProps) {
  const [choice, setChoice] = useState<ReferenceChoice | undefined>(undefined);
  const [isAddingUrls, setIsAddingUrls] = useState(false);
  const {
    setValue,
    formState: { isSubmitting },
  } = useFormContext<CreateRetrospectFormData>();
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  const handleConfirmClick = () => {
    if (choice === 'yes') {
      setIsAddingUrls(true);
    } else {
      setValue('referenceUrls', []);
      submitButtonRef.current?.click();
    }
  };

  if (isAddingUrls) {
    return <ReferenceUrlStep onClose={onClose} onBack={() => setIsAddingUrls(false)} />;
  }

  return (
    <div className="flex h-full flex-col">
      <FormHeader onClose={onClose} />

      <div className="flex min-h-0 flex-1 flex-col gap-6 px-2">
        <div>
          <StepIndicator />
          <div className="flex flex-col">
            <span className="text-title-2 text-grey-1000">회고에 참고할 자료가 있나요?</span>
            <span className="mt-1 text-caption-2 text-[#6e6e6e]">
              파일을 업로드하면 팀원들이 회고 작성에 참고할 수 있어요
            </span>
          </div>
        </div>

        <RadioCardGroup
          value={choice}
          onValueChange={(value) => setChoice(value as ReferenceChoice)}
          className="flex flex-col gap-3"
        >
          <RadioCardItem
            value="yes"
            className="rounded-[10px] border border-grey-200 bg-white px-4 py-[18px] data-[state=checked]:border-blue-500"
          >
            <div className="flex items-center gap-2.5">
              {choice === 'yes' ? (
                <SvgIcCheckCircleActive className="h-[16px] w-[16px] shrink-0" />
              ) : (
                <SvgIcCheckCircleInactive className="h-[16px] w-[16px] shrink-0" />
              )}
              <span
                className={`text-sub-title-2 ${choice === 'yes' ? 'text-blue-500' : 'text-grey-900'}`}
              >
                네, 있어요
              </span>
            </div>
          </RadioCardItem>

          <RadioCardItem
            value="no"
            className="rounded-[10px] border border-grey-200 bg-white px-4 py-[18px] data-[state=checked]:border-blue-500"
          >
            <div className="flex items-center gap-2.5">
              {choice === 'no' ? (
                <SvgIcCheckCircleActive className="h-[16px] w-[16px] shrink-0" />
              ) : (
                <SvgIcCheckCircleInactive className="h-[16px] w-[16px] shrink-0" />
              )}
              <span
                className={`text-sub-title-2 ${choice === 'no' ? 'text-blue-500' : 'text-grey-900'}`}
              >
                아니요, 없어요
              </span>
            </div>
          </RadioCardItem>
        </RadioCardGroup>
      </div>

      <div className="shrink-0 flex justify-end pt-4 px-2">
        <Button
          type="button"
          variant="primary"
          size="md"
          disabled={!choice || isSubmitting}
          onClick={handleConfirmClick}
          className="h-[32px] px-[18.5px] py-[7px] text-sub-title-5"
        >
          {choice === 'no' ? '완료' : '다음'}
        </Button>
        <button
          ref={submitButtonRef}
          type="submit"
          className="hidden"
          tabIndex={-1}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
