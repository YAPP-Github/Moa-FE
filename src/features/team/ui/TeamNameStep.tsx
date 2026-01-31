import { useFormContext } from 'react-hook-form';
import type { CreateTeamFormData } from '@/features/team/model/schema';
import { Field, FieldError, FieldLabel } from '@/shared/ui/field/Field';
import { Input } from '@/shared/ui/input/Input';

export function TeamNameStep() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<CreateTeamFormData>();
  const teamName = watch('teamName');

  const maxLength = 10;
  const currentLength = teamName?.length ?? 0;

  return (
    <Field className="mb-6">
      <FieldLabel htmlFor="teamName">팀 이름</FieldLabel>
      <div className="flex flex-col gap-0.5">
        <Input
          id="teamName"
          type="text"
          placeholder="팀 이름을 입력해주세요"
          maxLength={maxLength}
          error={!!errors.teamName}
          {...register('teamName')}
          value={teamName ?? ''}
        />
        <div className="flex">
          <FieldError>{errors.teamName?.message}</FieldError>
          <span className="ml-auto text-sm text-[#A0A9B7]">
            {currentLength}/{maxLength}
          </span>
        </div>
      </div>
    </Field>
  );
}
