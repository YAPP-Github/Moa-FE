import { useFormContext } from 'react-hook-form';
import type { SigninFormData } from '@/features/auth/model/schema';
import { Button } from '@/shared/ui/button/Button';
import { Field, FieldLabel } from '@/shared/ui/field/Field';
import { Input } from '@/shared/ui/input/Input';
import { useStepContext } from '@/shared/ui/multi-step-form/MultiStepForm';

export function NicknameStep() {
  const { register, watch, setValue } = useFormContext<SigninFormData>();
  const { goToNextStep } = useStepContext();

  const nickname = watch('nickname');

  return (
    <div className="w-[368px] flex flex-col">
      <div className="flex flex-col items-center gap-3 mb-15">
        <h1 className="text-title-1 text-center">
          안녕하세요
          <br />
          어떻게 불러드릴까요?
        </h1>
      </div>

      <Field className="mb-30">
        <FieldLabel htmlFor="nickname">닉네임</FieldLabel>
        <Input
          id="nickname"
          type="text"
          placeholder="닉네임"
          {...register('nickname')}
          clearable
          onClear={() => setValue('nickname', '')}
        />
      </Field>

      <Button onClick={goToNextStep} disabled={!nickname?.trim()} size="xl" fullWidth>
        다음
      </Button>
    </div>
  );
}
