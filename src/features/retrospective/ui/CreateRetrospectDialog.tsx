import { CreateRetrospectForm } from '@/features/retrospective/ui/CreateRetrospectForm';
import { DialogContent, DialogOverlay, DialogPortal, DialogRoot } from '@/shared/ui/dialog/Dialog';

interface CreateRetrospectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  retroRoomId: number;
  onSuccess?: () => void;
}

export function CreateRetrospectDialog({
  open,
  onOpenChange,
  retroRoomId,
  onSuccess,
}: CreateRetrospectDialogProps) {
  return (
    <DialogRoot open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="bg-black/50" />
        <DialogContent
          className="flex h-[620px] w-[434px] flex-col rounded-2xl bg-white p-6 shadow-xl"
          disableOutsideClick={true}
          hideCloseButton={true}
        >
          <CreateRetrospectForm
            retroRoomId={retroRoomId}
            onSuccess={onSuccess}
            onClose={() => onOpenChange(false)}
          />
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
  );
}
