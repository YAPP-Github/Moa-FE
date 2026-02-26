import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { useCreateRetroRoom } from '@/features/team/api/team.mutations';
import { teamQueryKeys } from '@/features/team/api/team.queries';
import { type CreateTeamFormData, createTeamSchema } from '@/features/team/model/schema';
import { TeamNameStep } from '@/features/team/ui/TeamNameStep';
import { MultiStepForm } from '@/shared/ui/multi-step-form/MultiStepForm';
import { useToast } from '@/shared/ui/toast/Toast';

interface CreateTeamFormProps {
  onClose: () => void;
}

export function CreateTeamForm({ onClose }: CreateTeamFormProps) {
  const { mutateAsync: createRetroRoom } = useCreateRetroRoom();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleSubmit = async (data: CreateTeamFormData) => {
    const response = await createRetroRoom({ title: data.teamName });
    showToast({ variant: 'success', message: '팀 생성이 완료되었어요!' });
    onClose();
    await queryClient.invalidateQueries({ queryKey: teamQueryKeys.rooms });
    navigate(`/teams/${response.result.retroRoomId}`, { replace: true });
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
    </MultiStepForm>
  );
}
