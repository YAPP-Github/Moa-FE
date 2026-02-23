import {
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
} from '@/shared/ui/dialog/Dialog';

interface DeleteRetrospectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function DeleteRetrospectDialog({
  open,
  onOpenChange,
  title,
  onConfirm,
  isLoading,
}: DeleteRetrospectDialogProps) {
  const handleClose = () => {
    if (isLoading) return;
    onOpenChange(false);
  };

  return (
    <DialogRoot open={open} onOpenChange={handleClose}>
      <DialogPortal>
        <DialogOverlay className="bg-black/50" />
        <DialogContent
          className="w-[426px] rounded-2xl bg-white p-5 shadow-xl"
          hideCloseButton={true}
        >
          <DialogHeader className="sr-only">
            <DialogTitle>회고 삭제 확인</DialogTitle>
          </DialogHeader>

          <h2 className="text-title-2 text-grey-1000">'{title}' 회고를 삭제하시겠어요?</h2>

          <p className="mt-1 text-caption-1 text-grey-800">삭제된 회고는 복구할 수 없어요.</p>

          <div className="mt-6 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="cursor-pointer rounded-lg bg-grey-100 px-5 py-1.5 text-sub-title-2 text-grey-900 transition-colors hover:bg-grey-200"
            >
              취소
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className="cursor-pointer rounded-lg bg-red-300 px-5 py-1.5 text-sub-title-2 text-white transition-colors hover:bg-red-400"
            >
              {isLoading ? '삭제 중...' : '삭제'}
            </button>
          </div>
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
  );
}
