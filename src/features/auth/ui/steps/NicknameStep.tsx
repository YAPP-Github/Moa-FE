import { useFormContext } from 'react-hook-form';
import type { SigninFormData } from '@/features/auth/model/schema';
import { cn } from '@/shared/lib/cn';
import { Button } from '@/shared/ui/button/Button';
import { Field, FieldLabel } from '@/shared/ui/field/Field';
import { Input } from '@/shared/ui/input/Input';
import { useStepContext } from '@/shared/ui/multi-step-form/MultiStepForm';

export function NicknameStep() {
  const { register, watch, setValue } = useFormContext<SigninFormData>();
  const { goToNextStep } = useStepContext();

  const nickname = watch('nickname');

  return (
    <div className="w-[388px] h-[528px] flex flex-col">
      <div className="flex flex-col items-center mb-[70px]">
        <h1 className="text-title-1 text-center text-[#191F28]">
          안녕하세요
          <br />
          어떻게 불러드릴까요?
        </h1>
      </div>

      <Field>
        <FieldLabel htmlFor="nickname">닉네임</FieldLabel>
        <div className="flex flex-col gap-[2px]">
          <Input
            id="nickname"
            type="text"
            placeholder="닉네임을 입력해주세요"
            maxLength={10}
            clearable
            onClear={() => setValue('nickname', '')}
            {...register('nickname')}
            value={nickname ?? ''}
          />
          <div className="flex">
            <span className="ml-auto text-caption-3-medium text-[#C9C9C9]">
              <span className={cn((nickname?.length ?? 0) > 0 && 'text-[#333D4B]')}>
                {nickname?.length ?? 0}
              </span>
              /10
            </span>
          </div>
        </div>
      </Field>

      <div className="mt-auto flex justify-end">
        <Button onClick={goToNextStep} disabled={!nickname?.trim()} size="md">
          다음
        </Button>
      </div>
    </div>
  );
}
