/**
 * RetrospectivePageHeader - 회고 상세/작성 페이지 공통 헤더
 *
 * 브레드크럼 네비게이션 (moa | 홈 > 회고 제목) + 프로필 드롭다운
 */

import { Link } from 'react-router';
import { ProfileDropdown } from '@/features/auth/ui/ProfileDropdown';
import IcFront from '@/shared/ui/icons/IcFront';
import IcMoa from '@/shared/ui/logos/IcMoa';

interface RetrospectivePageHeaderProps {
  teamId: number;
  title?: string;
}

export function RetrospectivePageHeader({ teamId, title }: RetrospectivePageHeaderProps) {
  return (
    <header className="flex h-[54px] items-center justify-between border-b border-[#F3F4F5] bg-white px-[36px]">
      <div className="flex items-center gap-3">
        <IcMoa />
        <span className="text-caption-4 text-grey-300">|</span>
        <nav className="flex items-center gap-[2px] text-caption-3-medium leading-none text-grey-900">
          <span className="flex items-center">
            <Link to={`/teams/${teamId}`}>홈</Link>
          </span>
          {title && (
            <>
              <IcFront width={24} height={24} />
              <span className="flex items-center">{title}</span>
            </>
          )}
        </nav>
      </div>
      <ProfileDropdown />
    </header>
  );
}
