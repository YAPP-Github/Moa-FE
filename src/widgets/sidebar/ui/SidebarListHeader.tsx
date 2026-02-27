import { useState } from 'react';
import { CreateTeamDialog } from '@/features/team/ui/CreateTeamDialog';
import { IconButton } from '@/shared/ui/icon-button/IconButton';
import IcPlusGrey from '@/shared/ui/icons/IcPlusGrey';
import IcTooltip from '@/shared/ui/icons/IcTooltip';

interface SidebarListHeaderProps {
  title: string;
}

export function SidebarListHeader({ title }: SidebarListHeaderProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="h-[38px] pl-[14px] py-[7px] flex items-center justify-between">
      <span className="text-sub-title-4 text-grey-600 truncate">{title}</span>
      <div className="relative group">
        <IcTooltip className="absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        <IconButton
          shape="square"
          variant="tertiary"
          size="xs"
          aria-label="팀 만들기"
          onClick={() => setIsDialogOpen(true)}
        >
          <IcPlusGrey className="w-[10px] h-[10px]" />
        </IconButton>
      </div>
      <CreateTeamDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
}
