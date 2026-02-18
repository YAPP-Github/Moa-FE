import { Controller, useFormContext } from 'react-hook-form';
import type { SigninFormData } from '@/features/auth/model/schema';
import { Button } from '@/shared/ui/button/Button';
import SvgIcCheckCircleActive from '@/shared/ui/icons/IcCheckCircleActive';
import SvgIcCheckCircleInactive from '@/shared/ui/icons/IcCheckCircleInactive';
import { useStepContext } from '@/shared/ui/multi-step-form/MultiStepForm';
import { RadioCardGroup, RadioCardItem } from '@/shared/ui/radio-card/RadioCard';

const TEAM_OPTIONS = [
  { value: 'join', title: '네', description: '초대링크를 받았어요' },
  { value: 'create', title: '아니요', description: '새 팀을 만들게요' },
] as const;

export function TeamStep() {
  const { control, watch } = useFormContext<SigninFormData>();
  const { goToNextStep } = useStepContext();

  const teamOption = watch('teamOption');

  return (
    <div className="w-[388px] h-[528px] flex flex-col">
      <div className="flex flex-col items-center mb-[70px]">
        <h1 className="text-title-1 text-center text-[#191F28]">
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
            className="flex flex-col gap-[12px]"
          >
            {TEAM_OPTIONS.map((option) => {
              const isSelected = teamOption === option.value;
              return (
                <RadioCardItem
                  key={option.value}
                  value={option.value}
                  className="rounded-[10px] border border-grey-300 px-[19px] py-[14px] transition-colors duration-300 ease-out data-[state=checked]:border-blue-500"
                >
                  <div className="flex items-center gap-[16px]">
                    <div className="relative h-4 w-4 shrink-0">
                      <SvgIcCheckCircleActive
                        className={`absolute inset-0 h-4 w-4 transition-opacity duration-300 ease-out ${isSelected ? 'opacity-100' : 'opacity-0'}`}
                      />
                      <SvgIcCheckCircleInactive
                        className={`absolute inset-0 h-4 w-4 transition-opacity duration-300 ease-out ${isSelected ? 'opacity-0' : 'opacity-100'}`}
                      />
                    </div>
                    <div className="flex flex-col gap-[2px]">
                      <span
                        className={`text-sub-title-1 transition-colors duration-300 ease-out ${isSelected ? 'text-blue-500' : 'text-grey-900'}`}
                      >
                        {option.title}
                      </span>
                      <span
                        className={`text-caption-5 transition-colors duration-300 ease-out ${isSelected ? 'text-blue-500' : 'text-grey-900'}`}
                      >
                        {option.description}
                      </span>
                    </div>
                  </div>
                </RadioCardItem>
              );
            })}
          </RadioCardGroup>
        )}
      />

      <div className="mt-auto flex justify-end">
        <Button onClick={goToNextStep} disabled={!teamOption} size="md">
          다음
        </Button>
      </div>
    </div>
  );
}
