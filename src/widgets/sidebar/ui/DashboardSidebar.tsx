import { SidebarListHeader } from './SidebarListHeader';
import { SidebarTeamList } from './SidebarTeamList';

interface DashboardSidebarProps {
  className?: string;
  onAddTeam?: () => void;
  onJoinTeam?: () => void;
}

export function DashboardSidebar({ className, onAddTeam, onJoinTeam }: DashboardSidebarProps) {
  return (
    <aside className={`w-[240px] h-full shrink-0 pl-[34px] pr-[10px] py-[20px] ${className ?? ''}`}>
      <SidebarListHeader title="목록" onAddTeam={onAddTeam} onJoinTeam={onJoinTeam} />
      <nav className="mt-2">
        <SidebarTeamList />
      </nav>
    </aside>
  );
}
