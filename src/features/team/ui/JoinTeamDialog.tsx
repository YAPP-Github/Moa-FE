import { JoinTeamForm } from '@/features/team/ui/JoinTeamForm';
import {
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
} from '@/shared/ui/dialog/Dialog';

interface JoinTeamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function JoinTeamDialog({ open, onOpenChange, onSuccess }: JoinTeamDialogProps) {
  return (
    <DialogRoot open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="bg-black/50" />
        <DialogContent className="bg-white rounded-2xl p-5 shadow-xl" disableOutsideClick={false}>
          <DialogHeader className="mb-6">
            <DialogTitle className="text-xl font-bold">기존 팀 입장하기</DialogTitle>
          </DialogHeader>

          <JoinTeamForm onSuccess={onSuccess} onClose={() => onOpenChange(false)} />
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
  );
}
