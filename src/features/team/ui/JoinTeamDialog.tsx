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
}

export function JoinTeamDialog({ open, onOpenChange }: JoinTeamDialogProps) {
  return (
    <DialogRoot open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="bg-black/50" />
        <DialogContent className="w-[400px] bg-white rounded-[12px] p-[20px]" disableOutsideClick>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">공유받은 링크 입력하기</DialogTitle>
          </DialogHeader>

          <JoinTeamForm onClose={() => onOpenChange(false)} />
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
  );
}
