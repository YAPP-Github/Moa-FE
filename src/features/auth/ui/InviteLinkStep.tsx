import { useFormContext } from 'react-hook-form';
import type { SigninFormData } from '@/features/auth/model/schema';
import { Button } from '@/shared/ui/button/Button';
import { Field, FieldLabel } from '@/shared/ui/field/Field';
import { Input } from '@/shared/ui/input/Input';

export function InviteLinkStep() {
  const { register, watch, setValue } = useFormContext<SigninFormData>();

  const inviteLink = watch('inviteLink');

  return (
    <div className="w-[368px] flex flex-col">
      {/* 제목 */}
      <h1 className="text-2xl font-bold text-center mb-16">초대 링크를 입력해주세요</h1>

      {/* 입력 필드 */}
      <Field className="mb-28">
        <FieldLabel htmlFor="inviteLink">초대링크</FieldLabel>
        <Input
          id="inviteLink"
          type="text"
          placeholder="초대 링크"
          {...register('inviteLink')}
          clearable
          onClear={() => setValue('inviteLink', '')}
        />
      </Field>

      {/* 시작하기 버튼 - type="submit"으로 폼 제출 */}
      <Button type="submit" disabled={!inviteLink?.trim()} size="xl" fullWidth>
        시작하기
      </Button>
    </div>
  );
}
