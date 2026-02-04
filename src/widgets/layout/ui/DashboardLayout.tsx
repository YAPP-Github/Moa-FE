import type { ReactNode } from 'react';
import { useState } from 'react';
import { BaseLayout } from './BaseLayout';
import { CreateTeamDialog } from '@/features/team/ui/CreateTeamDialog';
import { DashboardSidebar } from '@/widgets/sidebar/ui/DashboardSidebar';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isAddTeamDialogOpen, setIsAddTeamDialogOpen] = useState(false);

  const handleAddTeam = () => {
    setIsAddTeamDialogOpen(true);
  };

  return (
    <BaseLayout>
      <div className="flex h-full">
        <DashboardSidebar onAddTeam={handleAddTeam} />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>

      <CreateTeamDialog open={isAddTeamDialogOpen} onOpenChange={setIsAddTeamDialogOpen} />
    </BaseLayout>
  );
}
