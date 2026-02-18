import { useState } from 'react';
import { CreateTeamDialog } from '@/features/team/ui/CreateTeamDialog';
import { IconButton } from '@/shared/ui/icon-button/IconButton';
import IcPlus from '@/shared/ui/icons/IcPlus';

interface SidebarListHeaderProps {
  title: string;
}

export function SidebarListHeader({ title }: SidebarListHeaderProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="h-[38px] px-[14px] py-[7px] flex items-center justify-between">
      <span className="text-sub-title-4 text-grey-600 truncate">{title}</span>
      <IconButton
        shape="square"
        variant="tertiary"
        size="xs"
        aria-label="팀 만들기"
        onClick={() => setIsDialogOpen(true)}
      >
        <IcPlus className="w-[10px] h-[10px] text-gray-700" />
      </IconButton>
      <CreateTeamDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
}
