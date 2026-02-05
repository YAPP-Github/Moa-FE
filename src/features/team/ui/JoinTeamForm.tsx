import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useJoinRetroRoom } from '@/features/team/api/team.mutations';
import { type JoinTeamFormData, joinTeamSchema } from '@/features/team/model/schema';
import { Button } from '@/shared/ui/button/Button';
import { Field, FieldLabel } from '@/shared/ui/field/Field';
import { Input } from '@/shared/ui/input/Input';

interface JoinTeamFormProps {
  onSuccess?: () => void;
  onClose: () => void;
}

export function JoinTeamForm({ onSuccess, onClose }: JoinTeamFormProps) {
  const mutation = useJoinRetroRoom();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<JoinTeamFormData>({
    resolver: zodResolver(joinTeamSchema),
    defaultValues: { inviteUrl: '' },
  });

  const inviteUrl = watch('inviteUrl');

  const onSubmit = async (data: JoinTeamFormData) => {
    try {
      await mutation.mutateAsync({ inviteUrl: data.inviteUrl });
      onClose();
      onSuccess?.();
    } catch {
      // 에러는 mutation.error에서 처리
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <Field>
        <FieldLabel htmlFor="inviteUrl">초대 링크</FieldLabel>
        <Input
          id="inviteUrl"
          type="text"
          placeholder="초대 링크를 입력해주세요"
          {...register('inviteUrl')}
          clearable
          onClear={() => setValue('inviteUrl', '')}
          error={!!errors.inviteUrl}
        />
        {errors.inviteUrl && (
          <p className="text-sm text-red-500 mt-1">{errors.inviteUrl.message}</p>
        )}
      </Field>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onClose}>
          취소
        </Button>
        <Button type="submit" disabled={!inviteUrl?.trim() || mutation.isPending}>
          {mutation.isPending ? '입장 중...' : '입장하기'}
        </Button>
      </div>
    </form>
  );
}
