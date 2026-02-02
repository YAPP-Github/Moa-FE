import { SidebarListHeader } from './SidebarListHeader';
import { SidebarTeamList } from './SidebarTeamList';

interface DashboardSidebarProps {
  className?: string;
}

export function DashboardSidebar({ className }: DashboardSidebarProps) {
  return (
    <aside className={`w-[240px] h-full shrink-0 pl-[34px] pr-[10px] py-[20px] ${className ?? ''}`}>
      <SidebarListHeader title="목록" />
      <nav className="mt-2">
        <SidebarTeamList />
      </nav>
    </aside>
  );
}
