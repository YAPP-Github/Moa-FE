import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateRetroRoom } from '@/features/team/api/team.mutations';
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

  const handleSubmit = async (data: CreateTeamFormData) => {
    await createRetroRoom({ title: data.teamName });
    showToast({ variant: 'success', message: '새로운 팀이 생성되었습니다.' });
    onClose();
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
