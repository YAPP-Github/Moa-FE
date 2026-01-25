import { SidebarListHeader } from './SidebarListHeader';

interface DashboardSidebarProps {
  className?: string;
}

export function DashboardSidebar({ className }: DashboardSidebarProps) {
  return (
    <aside
      className={`w-[240px] bg-[#FFFFFF] h-full shrink-0 pl-[34px] py-[20px] ${className ?? ''}`}
    >
      <SidebarListHeader title="팀 목록" />
    </aside>
  );
}
