import {
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
} from '@/shared/ui/dialog/Dialog';
import IcLink from '@/shared/ui/icons/IcLink';
import { useToast } from '@/shared/ui/toast/Toast';

interface InviteMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  retroRoomId: number;
}

export function InviteMemberDialog({ open, onOpenChange, retroRoomId }: InviteMemberDialogProps) {
  const { showToast } = useToast();

  // TODO: 실제 초대 링크를 가져오는 API 연동 필요
  const inviteLink = `${window.location.origin}/join/${retroRoomId}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      showToast({ variant: 'success', message: '초대 링크가 복사되었습니다.' });
      onOpenChange(false);
    } catch {
      showToast({ variant: 'warning', message: '링크 복사에 실패했습니다.' });
    }
  };

  return (
    <DialogRoot open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="bg-black/50" />
        <DialogContent
          className="bg-white rounded-2xl p-5 shadow-xl w-[384px]"
          disableOutsideClick={false}
        >
          <DialogHeader className="flex items-start justify-between mb-1">
            <DialogTitle className="text-title-3 text-grey-1000">
              멤버를 추가하시겠어요?
            </DialogTitle>
          </DialogHeader>

          <p className="text-body-2 text-grey-700 mb-5">링크를 복사하여 멤버를 초대할 수 있어요.</p>

          <button
            type="button"
            onClick={handleCopyLink}
            className="w-full h-12 bg-[#F3F4F5] rounded-lg cursor-pointer transition-colors"
          >
            <span className="flex items-center justify-center gap-2">
              <IcLink className="w-5 h-5 text-grey-700" />
              <span className="text-[15px] font-semibold text-grey-700">초대링크 복사</span>
            </span>
          </button>
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
  );
}
