import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { useJoinRetroRoom } from '@/features/team/api/team.mutations';
import { teamQueryKeys } from '@/features/team/api/team.queries';
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
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { register, handleSubmit, setValue, watch } = useForm<JoinTeamFormData>({
    resolver: zodResolver(joinTeamSchema),
    defaultValues: { inviteUrl: '' },
  });

  const inviteUrl = watch('inviteUrl');

  const onSubmit = async (data: JoinTeamFormData) => {
    const response = await mutation.mutateAsync({ inviteUrl: data.inviteUrl });
    showToast({ variant: 'success', message: '팀 참여가 완료되었어요!' });
    onClose();
    onSuccess?.();
    await queryClient.invalidateQueries({ queryKey: teamQueryKeys.rooms });
    navigate(`/teams/${response.result.retroRoomId}`, { replace: true });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <Field>
        <FieldLabel htmlFor="inviteUrl" className="text-sub-title-4 text-grey-900">
          초대 링크
        </FieldLabel>
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
        <Button type="submit" disabled={!inviteUrl?.trim()} className="px-3 py-2">
          확인
        </Button>
      </div>
    </form>
  );
}
