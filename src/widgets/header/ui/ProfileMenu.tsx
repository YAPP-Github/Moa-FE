import { useEffect, useRef } from 'react';

interface ProfileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  onWithdraw: () => void;
  userName?: string;
}

export function ProfileMenu({
  isOpen,
  onClose,
  onLogout,
  onWithdraw,
  userName = '박소은',
}: ProfileMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 감지
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="absolute top-[calc(100%+16px)] right-4 bg-white p-4 rounded-lg shadow-lg z-50 w-[200px]"
    >
      {/* 프로필 영역 */}
      <div className="flex items-center min-w-0">
        <div className="w-10 h-10 bg-[#E5E5E5] rounded-md shrink-0" />
        <span className="ml-3 text-base font-bold text-grey-1000 truncate flex-1 min-w-0">
          {userName}
        </span>
      </div>

      {/* 구분선 */}
      <div className="border-t border-grey-100 mt-5 mb-4" />

      {/* 메뉴 항목 */}
      <div className="flex flex-col gap-4">
        <button
          type="button"
          onClick={onLogout}
          className="text-caption-2 text-grey-900 text-left hover:text-grey-1000 transition-colors"
        >
          로그아웃
        </button>
        <button
          type="button"
          onClick={onWithdraw}
          className="text-caption-2 text-grey-900 text-left hover:text-grey-1000 transition-colors"
        >
          서비스 탈퇴
        </button>
      </div>
    </div>
  );
}
