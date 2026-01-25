import type { ReactNode } from 'react';
import { Header } from '@/widgets/header';
import { DashboardSidebar } from '@/widgets/sidebar';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-[#FFFFFF]">
      <Header />
      <div className="flex h-[calc(100vh-54px)]">
        <DashboardSidebar />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
