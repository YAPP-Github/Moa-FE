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

  const handleSubmit = async () => {
    const isValid = await goToNextStep();
    if (isValid) {
      console.log('Nickname submitted:', nickname);
    }
  };

  return (
    <div className="w-[368px] flex flex-col">
      {/* 제목 및 설명 */}
      <div className="flex flex-col items-center gap-3 mb-15">
        <h1 className="text-2xl font-bold text-center">
          안녕하세요
          <br />
          어떻게 불러드릴까요?
        </h1>
        <p className="text-[14px] font-medium leading-[150%] tracking-[-0.02em] text-[#000000]/42 text-center">
          프로필에 보일 닉네임이에요
        </p>
      </div>

      {/* 입력 필드 */}
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

      {/* 다음 버튼 */}
      <Button onClick={handleSubmit} disabled={!nickname?.trim()} size="xl" fullWidth>
        다음
      </Button>
    </div>
  );
}
