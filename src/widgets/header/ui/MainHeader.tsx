import { Link } from 'react-router';
import { ProfileDropdown } from '@/features/auth/ui/ProfileDropdown';
import IcLogoMain from '@/shared/ui/icons/IcLogoMain';

export function MainHeader() {
  return (
    <header className="h-[54px] bg-[#FFFFFF] border-b border-[#F3F4F5] flex items-center justify-between px-[36px]">
      <Link to="/">
        <IcLogoMain />
      </Link>
      <ProfileDropdown />
    </header>
  );
}
