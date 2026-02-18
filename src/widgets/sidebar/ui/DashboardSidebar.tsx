import { Suspense } from 'react';
import { SidebarListHeader } from './SidebarListHeader';
import { SidebarTeamList } from './SidebarTeamList';

export function DashboardSidebar() {
  return (
    <aside className="w-[240px] h-full shrink-0 pl-[34px] pr-[10px] py-[20px] border-r border-grey-100">
      <SidebarListHeader title="목록" />
      <nav className="mt-2">
        <Suspense fallback={null}>
          <SidebarTeamList />
        </Suspense>
      </nav>
    </aside>
  );
}
