import { useInviteCode } from '../api/team.queries';
import { Button } from '@/shared/ui/button/Button';
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
  const { data } = useInviteCode(retroRoomId, open);

  const inviteLink = data?.result.inviteCode;

  const handleCopyLink = async () => {
    if (!inviteLink) return;

    await navigator.clipboard.writeText(inviteLink);
    showToast({ variant: 'success', message: '초대 링크가 복사되었습니다.' });
    onOpenChange(false);
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

          <Button variant="tertiary" size="xl" onClick={handleCopyLink} fullWidth>
            <span className="flex items-center justify-center gap-2">
              <IcLink width={20} height={20} className="text-grey-800" />
              <span className="text-sub-title-2 text-grey-1000">초대링크 복사</span>
            </span>
          </Button>
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
  );
}
