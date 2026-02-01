import { useNavigate } from 'react-router';
import { useAuthStore } from '@/features/auth/model/store';
import { getApi } from '@/shared/api/generated';

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  // 테스트용 계정 탈퇴 핸들러
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
      className={`h-[54px] bg-[#FFFFFF] border-b border-[#F3F4F5] flex items-center justify-between px-4 ${
        className ?? ''
      }`}
    >
      {/* TODO: 실제 로고와 프로필 아바타로 교체 */}
      <div className="w-8 h-8 rounded bg-gray-200" />
      <div className="flex items-center gap-2">
        {/* 테스트용 탈퇴 버튼 */}
        <button
          type="button"
          onClick={handleWithdraw}
          className="px-3 py-1 text-sm text-red-500 border border-red-500 rounded hover:bg-red-50"
        >
          탈퇴
        </button>
        <div className="w-8 h-8 rounded bg-gray-200" />
      </div>
    </header>
  );
}
