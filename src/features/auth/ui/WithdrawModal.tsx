import {
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
} from '@/shared/ui/dialog/Dialog';

interface WithdrawModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function WithdrawModal({ open, onOpenChange, onConfirm }: WithdrawModalProps) {
  return (
    <DialogRoot open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="bg-black/50" />
        <DialogContent
          className="bg-white rounded-xl p-5 shadow-xl w-[426px]"
          hideCloseButton={true}
        >
          <DialogHeader className="sr-only">
            <DialogTitle>서비스 탈퇴 확인</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-[4px]">
            <h2 className="text-title-2 text-grey-1000">정말 탈퇴하시겠어요?</h2>
            <p className="text-caption-1 text-grey-800">
              탈퇴하시면 회원님의 모든 정보와 활동 기록이 삭제됩니다.
              <br />
              삭제된 정보는 복구될 수 없으니 신중하게 결정해주세요.
            </p>
          </div>

          <div className="flex justify-end gap-[10px] mt-6">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="bg-grey-100 rounded-lg px-5 py-2 text-sub-title-2 text-grey-900 hover:bg-grey-200 transition-colors cursor-pointer"
            >
              취소
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="bg-red-300 rounded-lg px-5 py-2 text-sub-title-2 text-white hover:opacity-90 transition-opacity cursor-pointer"
            >
              탈퇴하기
            </button>
          </div>
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
  );
}
