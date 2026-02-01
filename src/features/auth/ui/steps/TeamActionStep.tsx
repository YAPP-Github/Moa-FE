import { useFormContext } from 'react-hook-form';
import type { SigninFormData } from '@/features/auth/model/schema';
import { Button } from '@/shared/ui/button/Button';
import { Field, FieldLabel } from '@/shared/ui/field/Field';
import { Input } from '@/shared/ui/input/Input';

export function TeamActionStep() {
  const { register, watch, setValue } = useFormContext<SigninFormData>();

  const teamOption = watch('teamOption');
  const teamName = watch('teamName');
  const inviteLink = watch('inviteLink');

  if (teamOption === 'create') {
    return (
      <div className="w-[368px] flex flex-col">
        <h1 className="text-2xl font-bold text-center mb-16">팀 이름을 입력해주세요</h1>

        <Field className="mb-28">
          <FieldLabel htmlFor="teamName">팀 이름</FieldLabel>
          <Input
            id="teamName"
            type="text"
            placeholder="팀 이름"
            maxLength={10}
            showCount
            {...register('teamName')}
            value={teamName ?? ''}
          />
        </Field>

        <Button type="submit" disabled={!teamName?.trim()} size="xl" fullWidth>
          시작하기
        </Button>
      </div>
    );
  }

  if (teamOption === 'join') {
    return (
      <div className="w-[368px] flex flex-col">
        <h1 className="text-2xl font-bold text-center mb-16">초대 링크를 입력해주세요</h1>

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

        <Button type="submit" disabled={!inviteLink?.trim()} size="xl" fullWidth>
          시작하기
        </Button>
      </div>
    );
  }

  return null;
}
