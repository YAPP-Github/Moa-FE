import { IconButton } from '@/shared/ui/icon-button/IconButton';
import IcMeatball from '@/shared/ui/icons/IcMeatball';

interface SidebarListHeaderProps {
  title: string;
}

export function SidebarListHeader({ title }: SidebarListHeaderProps) {
  return (
    <div className="w-[196px] h-[38px] px-[16px] py-[8px] flex items-center justify-between">
      <span className="text-sub-title-1 text-gray-800 truncate">{title}</span>
      <IconButton variant="ghost" size="xs" aria-label="팀 메뉴">
        <IcMeatball className="w-6 h-6" />
      </IconButton>
    </div>
  );
}
