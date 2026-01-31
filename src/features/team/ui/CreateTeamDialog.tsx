import { CreateTeamForm } from '@/features/team/ui/CreateTeamForm';
import type { RetroRoomCreateResponse } from '@/shared/api/generated/index';
import {
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
} from '@/shared/ui/dialog/Dialog';

interface CreateTeamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (result: RetroRoomCreateResponse) => void;
}

export function CreateTeamDialog({ open, onOpenChange, onSuccess }: CreateTeamDialogProps) {
  return (
    <DialogRoot open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="bg-black/50" />
        <DialogContent className="bg-white rounded-2xl p-5 shadow-xl" disableOutsideClick={false}>
          <DialogHeader className="mb-6">
            <DialogTitle className="text-xl font-bold">새로운 팀 생성하기</DialogTitle>
          </DialogHeader>

          <CreateTeamForm onSuccess={onSuccess} onClose={() => onOpenChange(false)} />
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
  );
}
