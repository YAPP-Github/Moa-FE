import { Link } from 'react-router';
import { ProfileDropdown } from '@/features/auth/ui/ProfileDropdown';
import IcMoa from '@/shared/ui/logos/IcMoa';

export function MainHeader() {
  return (
    <header className="h-[54px] bg-[#FFFFFF] border-b border-[#F3F4F5] flex items-center justify-between px-[36px]">
      <Link to="/">
        <IcMoa />
      </Link>
      <ProfileDropdown />
    </header>
  );
}
