import { useFormContext } from 'react-hook-form';
import type { CreateTeamFormData } from '@/features/team/model/schema';
import { cn } from '@/shared/lib/cn';
import { Button } from '@/shared/ui/button/Button';
import { Field, FieldError, FieldLabel } from '@/shared/ui/field/Field';
import { Input } from '@/shared/ui/input/Input';

export function TeamNameStep() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<CreateTeamFormData>();

  const teamName = watch('teamName');
  const hasError = !!errors.teamName;

  return (
    <Field className="flex flex-col gap-[20px]">
      <div className="mt-[20px] flex flex-col gap-2">
        <FieldLabel htmlFor="teamName" error={hasError} className="text-sub-title-4 text-grey-900">
          팀 이름
        </FieldLabel>
        <div className="flex flex-col gap-[2px]">
          <Input
            id="teamName"
            type="text"
            placeholder="팀 이름을 입력해주세요"
            maxLength={10}
            error={hasError}
            clearable
            onClear={() => setValue('teamName', '', { shouldValidate: true })}
            {...register('teamName')}
            value={teamName ?? ''}
          />
          <div className="flex min-h-[20px]">
            <FieldError>{errors.teamName?.message}</FieldError>
            <span className="ml-auto text-caption-2 text-grey-400">
              <span className={cn((teamName?.length ?? 0) > 0 && 'text-[#333D4B]')}>
                {teamName?.length ?? 0}
              </span>
              /10
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" size="md" className="px-3 py-2 text-sub-title-5">
          만들기
        </Button>
      </div>
    </Field>
  );
}
