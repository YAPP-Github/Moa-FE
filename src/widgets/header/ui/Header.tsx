import { useNavigate } from 'react-router';
import { useAuthStore } from '@/features/auth/model/store';
import { getApi } from '@/shared/api/generated';
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
  const { logout } = useAuthStore();
  // TODO: API에서 사용자 이름 가져오기
  const userName = '사용자';

  // 로그아웃 핸들러
  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  // 계정 탈퇴 핸들러
  const handleWithdraw = async () => {
    try {
      await getApi().withdraw();
      logout();
      navigate('/signin');
    } catch (error) {
      console.error('탈퇴 실패:', error);
    }
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
            sideOffset={8}
            className="bg-white p-3 rounded-lg shadow-lg w-[160px]"
          >
            {/* 프로필 영역 */}
            <div className="flex items-center min-w-0">
              <Avatar size="md" alt={userName} className="rounded-md" />
              <span className="ml-2 text-title-4 text-grey-1000 truncate flex-1 min-w-0">
                {userName}
              </span>
            </div>

            <DropdownMenuSeparator className="border-t border-grey-100 my-3" />

            {/* 메뉴 항목 */}
            <div className="flex flex-col">
              <DropdownMenuItem
                onSelect={handleLogout}
                className="text-caption-2 text-grey-900 px-2 py-1.5 rounded-md hover:bg-grey-100 transition-colors cursor-pointer"
              >
                로그아웃
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={handleWithdraw}
                className="text-caption-2 text-grey-900 px-2 py-1.5 rounded-md hover:bg-grey-100 transition-colors cursor-pointer"
              >
                서비스 탈퇴
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenuRoot>
    </header>
  );
}
