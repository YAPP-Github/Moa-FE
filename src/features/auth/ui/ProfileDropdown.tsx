import { useState } from 'react';
import { useNavigate } from 'react-router';
import { WithdrawModal } from './WithdrawModal';
import { useLogoutMutation, useWithdrawMutation } from '../api/auth.mutations';
import { useProfile } from '../api/auth.queries';
import { Avatar } from '@/shared/ui/avatar/Avatar';
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu/DropdownMenu';
import { IconButton } from '@/shared/ui/icon-button/IconButton';

export function ProfileDropdown() {
  const navigate = useNavigate();
  const { data: profileData } = useProfile();
  const { mutateAsync: logout } = useLogoutMutation();
  const { mutateAsync: withdraw } = useWithdrawMutation();
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const userName = profileData?.result.nickname ?? '';

  const handleLogout = async () => {
    await logout();
    navigate('/signin');
  };

  const handleWithdraw = async () => {
    await withdraw();
    navigate('/signin');
  };

  return (
    <DropdownMenuRoot>
      <DropdownMenuTrigger>
        <IconButton variant="ghost" size="md" shape="square" aria-label="프로필 메뉴">
          <Avatar size="md" alt={userName} className="rounded-md" />
        </IconButton>
      </DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuContent
          align="end"
          sideOffset={4}
          className="flex flex-col gap-4 p-4 rounded-[8px] border border-grey-200 bg-white shadow-[0px_4px_16px_0px_rgba(0,0,0,0.07)] min-w-[160px]"
        >
          <div className="flex items-center gap-2 min-w-0">
            <Avatar size="md" alt={userName} className="rounded-md" />
            <span className="text-sub-title-3 text-grey-1000 truncate flex-1 min-w-0">
              {userName}
            </span>
          </div>

          <div className="h-[1px] bg-grey-200" />

          <div className="flex flex-col gap-4">
            <DropdownMenuItem onSelect={handleLogout} className="flex items-center cursor-pointer">
              <span className="text-caption-2 text-grey-900">로그아웃</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => setWithdrawModalOpen(true)}
              className="flex items-center cursor-pointer"
            >
              <span className="text-caption-2 text-grey-900">서비스 탈퇴</span>
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenuPortal>
      <WithdrawModal
        open={withdrawModalOpen}
        onOpenChange={setWithdrawModalOpen}
        onConfirm={handleWithdraw}
      />
    </DropdownMenuRoot>
  );
}
