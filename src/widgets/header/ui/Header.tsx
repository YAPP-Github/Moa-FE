import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ProfileMenu } from './ProfileMenu';
import { useAuthStore } from '@/features/auth/model/store';
import { getApi } from '@/shared/api/generated';

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // 로그아웃 핸들러
  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  // 계정 탈퇴 핸들러
  const handleWithdraw = async () => {
    if (!confirm('정말 탈퇴하시겠습니까?')) return;

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
      className={`h-[54px] bg-[#FFFFFF] border-b border-[#F3F4F5] flex items-center justify-between px-4 relative ${
        className ?? ''
      }`}
    >
      {/* TODO: 실제 로고와 프로필 아바타로 교체 */}
      <div className="w-8 h-8 rounded bg-gray-200" />
      <button
        type="button"
        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
        className="w-8 h-8 rounded bg-gray-200 cursor-pointer hover:bg-gray-300 transition-colors"
        aria-label="프로필 메뉴"
      />

      <ProfileMenu
        isOpen={isProfileMenuOpen}
        onClose={() => setIsProfileMenuOpen(false)}
        onLogout={handleLogout}
        onWithdraw={handleWithdraw}
      />
    </header>
  );
}
