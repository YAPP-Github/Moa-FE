import { useNavigate } from 'react-router';
import { useLogoutMutation, useWithdrawMutation } from '@/features/auth/api/auth.mutations';
import { useProfile } from '@/features/auth/api/auth.queries';
import { Avatar } from '@/shared/ui/avatar/Avatar';
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu/DropdownMenu';
import { IconButton } from '@/shared/ui/icon-button/IconButton';

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const navigate = useNavigate();
  const { data: profileData } = useProfile();
  const { mutateAsync: logout } = useLogoutMutation();
  const { mutateAsync: withdraw } = useWithdrawMutation();
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
    <header
      className={`h-[54px] bg-[#FFFFFF] border-b border-[#F3F4F5] flex items-center justify-between px-4 ${
        className ?? ''
      }`}
    >
      {/* TODO: 실제 로고로 교체 */}
      <div className="w-8 h-8 rounded bg-gray-200" />

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
            className="flex flex-col gap-3 p-3 rounded-[8px] border border-grey-200 bg-white shadow-[0px_4px_16px_0px_rgba(0,0,0,0.07)] min-w-[160px]"
          >
            {/* 프로필 영역 */}
            <div className="flex items-center gap-2 min-w-0">
              <Avatar size="md" alt={userName} className="rounded-md" />
              <span className="text-sub-title-3 text-grey-1000 truncate flex-1 min-w-0">
                {userName}
              </span>
            </div>

            <DropdownMenuSeparator className="border-t border-grey-200 -mx-3" />

            {/* 메뉴 항목 */}
            <div className="flex flex-col gap-3">
              <DropdownMenuItem
                onSelect={handleLogout}
                className="flex items-center cursor-pointer"
              >
                <span className="text-sub-title-3 text-grey-900">로그아웃</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={handleWithdraw}
                className="flex items-center cursor-pointer"
              >
                <span className="text-sub-title-3 text-grey-900">서비스 탈퇴</span>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenuRoot>
    </header>
  );
}
