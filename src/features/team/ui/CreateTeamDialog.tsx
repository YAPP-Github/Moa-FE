import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateRetroRoom } from '@/features/team/api/team.mutations';
import { type CreateTeamFormData, createTeamSchema } from '@/features/team/model/schema';
import { FormActions } from '@/features/team/ui/FormActions';
import { TeamNameStep } from '@/features/team/ui/TeamNameStep';
import type { RetroRoomCreateResponse } from '@/shared/api/generated/index';
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
} from '@/shared/ui/dialog/Dialog';
import { MultiStepForm } from '@/shared/ui/multi-step-form/MultiStepForm';

interface CreateTeamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (result: RetroRoomCreateResponse) => void;
}

export function CreateTeamDialog({ open, onOpenChange, onSuccess }: CreateTeamDialogProps) {
  const mutation = useCreateRetroRoom();

  const handleSubmit = async (data: CreateTeamFormData) => {
    try {
      const response = await mutation.mutateAsync({ title: data.teamName });
      onOpenChange(false);
      onSuccess?.(response.result);
    } catch {
      // 에러는 mutation.error에서 처리
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      mutation.reset();
    }
    onOpenChange(newOpen);
  };

  return (
    <DialogRoot open={open} onOpenChange={handleOpenChange}>
      <DialogPortal>
        <DialogOverlay className="bg-black/50" />
        <DialogContent className="bg-white rounded-2xl p-8 shadow-xl" disableOutsideClick={false}>
          <DialogHeader className="mb-6">
            <DialogTitle className="text-xl font-bold text-center">팀 생성하기</DialogTitle>
            <DialogDescription className="text-sm text-gray-500 text-center mt-2">
              함께 회고할 팀을 만들어보세요
            </DialogDescription>
          </DialogHeader>

          <MultiStepForm
            resolver={zodResolver(createTeamSchema)}
            defaultValues={{ teamName: '' }}
            onSubmit={handleSubmit}
          >
            <MultiStepForm.Step fields={['teamName']}>
              <TeamNameStep />
            </MultiStepForm.Step>

            <FormActions
              onCancel={() => handleOpenChange(false)}
              isPending={mutation.isPending}
              isError={mutation.isError}
            />
          </MultiStepForm>
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
  );
}
