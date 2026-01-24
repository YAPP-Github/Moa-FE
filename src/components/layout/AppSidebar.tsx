import { Link, useLocation } from 'react-router';
import { ActiveRetrospectiveCard } from '@/components/ActiveRetrospectiveCard';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useRetrospectiveStore } from '@/store/retrospective';

const menuItems = [
  {
    title: '회고 라운지',
    url: '/retrospective',
  },
  {
    title: '아카이빙',
    url: '/archive',
  },
];

export function AppSidebar() {
  const location = useLocation();
  const activeRetrospectiveId = useRetrospectiveStore((state) => state.activeRetrospectiveId);
  const retrospectives = useRetrospectiveStore((state) => state.retrospectives);

  const activeRetrospective = activeRetrospectiveId
    ? retrospectives.find((r) => r.id === activeRetrospectiveId)
    : null;

  return (
    <Sidebar collapsible="none" className="border-r border-sidebar-border px-6 py-8">
      <SidebarContent className="overflow-visible px-0">
        {activeRetrospective && (
          <SidebarHeader>
            <ActiveRetrospectiveCard retrospective={activeRetrospective} />
          </SidebarHeader>
        )}
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <SidebarMenu className="flex flex-col">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                    <Link to={item.url} className="h-6 text-base font-semibold">
                      {item.title}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="flex flex-col gap-4 p-0">
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-sm bg-[#C4C4C4]" />
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-sm font-medium">홍길동</span>
            <span className="truncate text-xs text-muted-foreground">hong@example.com</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
