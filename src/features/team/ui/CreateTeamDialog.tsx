import { CreateTeamForm } from '@/features/team/ui/CreateTeamForm';
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
}

export function CreateTeamDialog({ open, onOpenChange }: CreateTeamDialogProps) {
  return (
    <DialogRoot open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="bg-black/50" />
        <DialogContent
          className="w-[400px] h-[232px] bg-white rounded-[12px] p-[20px]"
          disableOutsideClick
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">새로운 팀 생성하기</DialogTitle>
          </DialogHeader>

          <CreateTeamForm onClose={() => onOpenChange(false)} />
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
  );
}
