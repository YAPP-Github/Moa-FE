import {
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
} from '@/shared/ui/dialog/Dialog';

interface SaveDraftDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaveAndLeave: () => void;
  onLeave: () => void;
  isSaving: boolean;
}

export function SaveDraftDialog({
  open,
  onOpenChange,
  onSaveAndLeave,
  onLeave,
  isSaving,
}: SaveDraftDialogProps) {
  return (
    <DialogRoot open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="bg-black/50" />
        <DialogContent className="w-fit rounded-2xl bg-white p-5 shadow-xl">
          <DialogHeader className="sr-only">
            <DialogTitle>회고 임시저장</DialogTitle>
          </DialogHeader>

          <h2 className="mt-8 text-title-2 text-grey-1000">작성 중인 회고를 임시저장할까요?</h2>
          <p className="mt-1 text-caption-1 text-grey-800">
            임시저장하면 나중에 이어서 작성할 수 있어요.
          </p>

          <div className="mt-6 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onLeave}
              disabled={isSaving}
              className="cursor-pointer rounded-lg bg-grey-100 px-5 py-1.5 text-sub-title-2 text-grey-900 transition-colors hover:bg-grey-200 disabled:pointer-events-none disabled:opacity-50"
            >
              나가기
            </button>
            <button
              type="button"
              onClick={onSaveAndLeave}
              disabled={isSaving}
              className="cursor-pointer rounded-lg bg-[#3182F6] px-5 py-1.5 text-sub-title-2 text-white transition-colors hover:bg-[#2373EB] disabled:pointer-events-none disabled:opacity-50"
            >
              {isSaving ? '저장 중...' : '임시저장 후 나가기'}
            </button>
          </div>
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
  );
}
