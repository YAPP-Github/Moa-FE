import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useJoinRetroRoom } from '@/features/team/api/team.mutations';
import { type JoinTeamFormData, joinTeamSchema } from '@/features/team/model/schema';
import { Button } from '@/shared/ui/button/Button';
import { Field, FieldLabel } from '@/shared/ui/field/Field';
import { Input } from '@/shared/ui/input/Input';
import { useToast } from '@/shared/ui/toast/Toast';

interface JoinTeamFormProps {
  onSuccess?: () => void;
  onClose: () => void;
}

export function JoinTeamForm({ onSuccess, onClose }: JoinTeamFormProps) {
  const mutation = useJoinRetroRoom();
  const { showToast } = useToast();

  const { register, handleSubmit, setValue, watch } = useForm<JoinTeamFormData>({
    resolver: zodResolver(joinTeamSchema),
    defaultValues: { inviteUrl: '' },
  });

  const inviteUrl = watch('inviteUrl');

  const onSubmit = async (data: JoinTeamFormData) => {
    try {
      await mutation.mutateAsync({ inviteUrl: data.inviteUrl });
      showToast({ variant: 'success', message: '팀에 입장했습니다.' });
      onClose();
      onSuccess?.();
    } catch {
      showToast({ variant: 'warning', message: '팀 입장에 실패했습니다.' });
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
        />
      </Field>

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={!inviteUrl?.trim()}>
          확인
        </Button>
      </div>
    </form>
  );
}
