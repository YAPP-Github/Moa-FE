import { useState } from 'react';
import { cn } from '@/shared/lib/cn';
import {
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
} from '@/shared/ui/dialog/Dialog';
import IcCheckCircleActive from '@/shared/ui/icons/IcCheckCircleActive';
import IcCheckCircleInactive from '@/shared/ui/icons/IcCheckCircleInactive';

interface LeaveTeamModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teamName: string;
  teamId: number;
  onConfirm?: (teamId: number) => void;
}

export function LeaveTeamModal({
  open,
  onOpenChange,
  teamName,
  teamId,
  onConfirm,
}: LeaveTeamModalProps) {
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleClose = () => {
    setIsConfirmed(false);
    onOpenChange(false);
  };

  const handleConfirm = () => {
    if (!isConfirmed) return;
    onConfirm?.(teamId);
    handleClose();
  };

  return (
    <DialogRoot open={open} onOpenChange={handleClose}>
      <DialogPortal>
        <DialogOverlay className="bg-black/50" />
        <DialogContent
          className="bg-white rounded-2xl p-5 shadow-xl w-[426px]"
          hideCloseButton={true}
        >
          {/* a11y용 숨김 제목 */}
          <DialogHeader className="sr-only">
            <DialogTitle>팀 나가기 확인</DialogTitle>
          </DialogHeader>

          {/* 제목 */}
          <h2 className="text-title-2 text-grey-1000">{teamName}팀을 탈퇴하시겠어요?</h2>

          {/* 설명 */}
          <p className="text-caption-1 text-grey-800 mt-1">
            팀을 나가면, 작성한 회고와 댓글들을 더이상 삭제할 수 없어요.
          </p>

          {/* 구분선 */}
          <div className="border-t border-grey-100 my-3" />

          {/* 체크박스 영역 */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsConfirmed(!isConfirmed)}
              className="cursor-pointer"
              aria-pressed={isConfirmed}
              aria-label="팀 탈퇴 확인"
            >
              {isConfirmed ? (
                <IcCheckCircleActive className="w-[18px] h-[18px]" />
              ) : (
                <IcCheckCircleInactive className="w-[18px] h-[18px]" />
              )}
            </button>
            <span className="text-sub-title-1 text-grey-900">
              확인했어요. 이 팀에서 탈퇴할게요.
            </span>
          </div>

          {/* 버튼 영역 */}
          <div className="flex justify-end gap-2.5 mt-6">
            <button
              type="button"
              onClick={handleClose}
              className="bg-grey-100 rounded-lg px-5 py-1.5 text-sub-title-2 text-grey-900 hover:bg-grey-200 transition-colors"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={!isConfirmed}
              className={cn(
                'rounded-lg px-5 py-1.5 text-sub-title-2 text-white transition-colors',
                isConfirmed
                  ? 'bg-blue-500 hover:bg-blue-600 cursor-pointer'
                  : 'bg-blue-300 cursor-not-allowed'
              )}
            >
              확인
            </button>
          </div>
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
  );
}
