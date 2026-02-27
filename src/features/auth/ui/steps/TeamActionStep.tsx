import { useFormContext } from 'react-hook-form';
import type { SigninFormData } from '@/features/auth/model/schema';
import { cn } from '@/shared/lib/cn';
import { Button } from '@/shared/ui/button/Button';
import { Field, FieldLabel } from '@/shared/ui/field/Field';
import { Input } from '@/shared/ui/input/Input';

export function TeamActionStep() {
  const {
    register,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useFormContext<SigninFormData>();

  const teamOption = watch('teamOption');
  const teamName = watch('teamName');
  const inviteLink = watch('inviteLink');

  if (teamOption === 'create') {
    return (
      <div className="w-[388px] flex flex-col">
        <div className="flex flex-col items-center mb-[70px]">
          <h1 className="text-title-1 text-center text-[#191F28]">
            생성할 팀 이름을
            <br />
            입력해 주세요
          </h1>
        </div>

        <Field>
          <FieldLabel htmlFor="teamName">팀 이름</FieldLabel>
          <div className="flex flex-col gap-[2px]">
            <Input
              id="teamName"
              type="text"
              placeholder="팀 이름을 입력해주세요"
              maxLength={10}
              {...register('teamName')}
              value={teamName ?? ''}
            />
            <div className="flex">
              <span className="ml-auto text-caption-3-medium text-[#C9C9C9]">
                <span className={cn((teamName?.length ?? 0) > 0 && 'text-[#333D4B]')}>
                  {teamName?.length ?? 0}
                </span>
                /10
              </span>
            </div>
          </div>
        </Field>

        <div className="mt-[clamp(24px,calc(100dvh-700px),260px)] flex justify-end">
          <Button type="submit" disabled={!teamName?.trim()} size="md">
            다음
          </Button>
        </div>
      </div>
    );
  }

  if (teamOption === 'join') {
    return (
      <div className="w-[388px] flex flex-col">
        <div className="flex flex-col items-center mb-[70px]">
          <h1 className="text-title-1 text-center text-[#191F28]">
            공유받은 링크를
            <br />
            입력해 주세요
          </h1>
        </div>

        <Field>
          <FieldLabel htmlFor="inviteLink">링크</FieldLabel>
          <Input
            id="inviteLink"
            type="text"
            placeholder="공유 링크를 입력해주세요"
            {...register('inviteLink', {
              onChange: () => trigger('inviteLink'),
            })}
            value={inviteLink ?? ''}
            clearable
            onClear={() => {
              setValue('inviteLink', '');
              trigger('inviteLink');
            }}
          />
        </Field>

        <div className="mt-[clamp(24px,calc(100dvh-700px),260px)] flex justify-end">
          <Button type="submit" disabled={!inviteLink?.trim() || !!errors.inviteLink} size="md">
            다음
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
