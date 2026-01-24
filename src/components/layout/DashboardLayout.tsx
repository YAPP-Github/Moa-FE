import { Outlet } from 'react-router';
import { AppSidebar } from './AppSidebar';
import { Header } from './Header';
import { SidebarProvider } from '@/components/ui/sidebar';

export function DashboardLayout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full flex-col">
        <Header />
        <div className="flex flex-1">
          <AppSidebar />
          <main className="flex flex-1 flex-col gap-4 bg-[#F0F2F5] px-12 pt-12 pb-13">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
