import { SidebarListHeader } from './SidebarListHeader';
import { SidebarTeamList } from './SidebarTeamList';

interface DashboardSidebarProps {
  className?: string;
}

export function DashboardSidebar({ className }: DashboardSidebarProps) {
  return (
    <aside
      className={`w-[240px] bg-[#FFFFFF] h-full shrink-0 pl-[34px] py-[20px] ${className ?? ''}`}
    >
      <SidebarListHeader title="목록" />
      <nav className="mt-2 pr-[34px]">
        <SidebarTeamList />
      </nav>
    </aside>
  );
}
