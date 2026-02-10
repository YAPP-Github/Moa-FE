import { Controller, useFormContext } from 'react-hook-form';
import type { SigninFormData } from '@/features/auth/model/schema';
import { Button } from '@/shared/ui/button/Button';
import { useStepContext } from '@/shared/ui/multi-step-form/MultiStepForm';
import { RadioCardGroup, RadioCardItem } from '@/shared/ui/radio-card/RadioCard';

export function TeamStep() {
  const { control, watch } = useFormContext<SigninFormData>();
  const { goToNextStep } = useStepContext();

  const teamOption = watch('teamOption');

  return (
    <div className="w-[368px] flex flex-col">
      <div className="flex flex-col items-center gap-3 mb-25">
        <h1 className="text-title-1 text-center">
          환영합니다!
          <br />
          참여하실 팀이 있으신가요?
        </h1>
      </div>

      <Controller
        name="teamOption"
        control={control}
        render={({ field }) => (
          <RadioCardGroup
            value={field.value}
            onValueChange={field.onChange}
            className="flex gap-3 mb-30"
          >
            <RadioCardItem
              value="create"
              className="flex-1 py-5 text-center font-semibold rounded-[10px] transition-colors data-[state=checked]:bg-[#E6F2FF] data-[state=checked]:text-[#3182F6] data-[state=unchecked]:bg-[#F3F4F5] data-[state=unchecked]:text-[#333D4B]"
            >
              새로운 팀 생성
            </RadioCardItem>

            <RadioCardItem
              value="join"
              className="flex-1 py-5 text-center font-semibold rounded-[10px] transition-colors data-[state=checked]:bg-[#E6F2FF] data-[state=checked]:text-[#3182F6] data-[state=unchecked]:bg-[#F3F4F5] data-[state=unchecked]:text-[#333D4B]"
            >
              초대 받았어요
            </RadioCardItem>
          </RadioCardGroup>
        )}
      />

      <Button onClick={goToNextStep} disabled={!teamOption} size="xl" fullWidth>
        다음
      </Button>
    </div>
  );
}
