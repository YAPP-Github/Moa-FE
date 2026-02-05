import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateRetroRoom } from '@/features/team/api/team.mutations';
import { type CreateTeamFormData, createTeamSchema } from '@/features/team/model/schema';
import { FormActions } from '@/features/team/ui/FormActions';
import { TeamNameStep } from '@/features/team/ui/TeamNameStep';
import type { RetroRoomCreateResponse } from '@/shared/api/generated/index';
import { MultiStepForm } from '@/shared/ui/multi-step-form/MultiStepForm';
import { useToast } from '@/shared/ui/toast/Toast';

interface CreateTeamFormProps {
  onSuccess?: (result: RetroRoomCreateResponse) => void;
  onClose: () => void;
}

export function CreateTeamForm({ onSuccess, onClose }: CreateTeamFormProps) {
  const mutation = useCreateRetroRoom();
  const { showToast } = useToast();

  const handleSubmit = async (data: CreateTeamFormData) => {
    try {
      const response = await mutation.mutateAsync({ title: data.teamName });
      showToast({ variant: 'success', message: '새로운 팀이 생성되었습니다.' });
      onClose();
      onSuccess?.(response.result);
    } catch {
      showToast({ variant: 'warning', message: '팀 생성에 실패했습니다.' });
    }
  };

  return (
    <MultiStepForm
      resolver={zodResolver(createTeamSchema)}
      defaultValues={{ teamName: '' }}
      onSubmit={handleSubmit}
    >
      <MultiStepForm.Step fields={['teamName']}>
        <TeamNameStep />
      </MultiStepForm.Step>

      <FormActions isPending={mutation.isPending} />
    </MultiStepForm>
  );
}
