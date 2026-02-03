import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu/DropdownMenu';
import { IconButton } from '@/shared/ui/icon-button/IconButton';
import IcMeatball from '@/shared/ui/icons/IcMeatball';

interface SidebarListHeaderProps {
  title: string;
  onAddTeam?: () => void;
}

export function SidebarListHeader({ title, onAddTeam }: SidebarListHeaderProps) {
  return (
    <div className="h-9 px-4 py-2 flex items-center justify-between">
      <span className="text-sub-title-1 text-grey-900 truncate">{title}</span>
      <DropdownMenuRoot>
        <DropdownMenuTrigger>
          <IconButton variant="ghost" size="xs" aria-label="팀 메뉴">
            <IcMeatball className="w-6 h-6" />
          </IconButton>
        </DropdownMenuTrigger>
        <DropdownMenuPortal>
          <DropdownMenuContent
            className="min-w-28 rounded-lg border border-[#E5E8EB] bg-white p-1 shadow-lg"
            align="end"
          >
            <DropdownMenuItem
              className="px-3 py-1.5 text-sm text-[#191F28] rounded-md cursor-pointer hover:bg-[#F9FAFB] data-highlighted:bg-[#F9FAFB]"
              onSelect={onAddTeam}
            >
              팀 추가
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenuRoot>
    </div>
  );
}
