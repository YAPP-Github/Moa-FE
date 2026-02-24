import { useState } from 'react';
import { CreateRetrospectForm } from '@/features/retrospective/ui/CreateRetrospectForm';
import { DialogContent, DialogOverlay, DialogPortal, DialogRoot } from '@/shared/ui/dialog/Dialog';

interface CreateRetrospectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  retroRoomId: number;
  teamName: string;
  onSuccess?: () => void;
}

export function CreateRetrospectDialog({
  open,
  onOpenChange,
  retroRoomId,
  teamName,
  onSuccess,
}: CreateRetrospectDialogProps) {
  const [isComplete, setIsComplete] = useState(false);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) setIsComplete(false);
    onOpenChange(nextOpen);
  };

  return (
    <DialogRoot open={open} onOpenChange={handleOpenChange}>
      <DialogPortal>
        <DialogOverlay className="bg-black/50" />
        <DialogContent
          className={
            isComplete
              ? 'flex w-[300px] flex-col rounded-2xl bg-white p-6 shadow-xl'
              : 'flex h-[620px] w-[434px] flex-col rounded-2xl bg-white p-6 shadow-xl'
          }
          disableOutsideClick={true}
          hideCloseButton={true}
        >
          <CreateRetrospectForm
            retroRoomId={retroRoomId}
            teamName={teamName}
            onSuccess={onSuccess}
            onClose={() => handleOpenChange(false)}
            onCompleteChange={setIsComplete}
          />
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
  );
}
