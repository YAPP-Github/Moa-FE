import type { ReactNode } from 'react';
import { BaseLayout } from './BaseLayout';
import { DashboardSidebar } from '@/widgets/sidebar/ui/DashboardSidebar';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <BaseLayout>
      <div className="flex h-full">
        <DashboardSidebar />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </BaseLayout>
  );
}
