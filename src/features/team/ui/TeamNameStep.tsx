import { useFormContext } from 'react-hook-form';
import type { CreateTeamFormData } from '@/features/team/model/schema';
import { Field, FieldLabel } from '@/shared/ui/field/Field';
import { Input } from '@/shared/ui/input/Input';

export function TeamNameStep() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<CreateTeamFormData>();
  const teamName = watch('teamName');

  return (
    <Field className="mb-6">
      <FieldLabel htmlFor="teamName">팀 이름</FieldLabel>
      <Input
        id="teamName"
        type="text"
        placeholder="팀 이름을 입력해주세요"
        maxLength={10}
        showCount
        {...register('teamName')}
        value={teamName ?? ''}
      />
      {errors.teamName && <p className="text-sm text-red-500 mt-1">{errors.teamName.message}</p>}
    </Field>
  );
}
