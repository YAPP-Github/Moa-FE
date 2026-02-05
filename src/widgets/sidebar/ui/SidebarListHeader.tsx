import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu/DropdownMenu';
import { IconButton } from '@/shared/ui/icon-button/IconButton';
import IcEnter from '@/shared/ui/icons/IcEnter';
import IcMeatball from '@/shared/ui/icons/IcMeatball';
import IcPlusBlue from '@/shared/ui/icons/IcPlusBlue';

interface SidebarListHeaderProps {
  title: string;
  onAddTeam?: () => void;
  onJoinTeam?: () => void;
}

export function SidebarListHeader({ title, onAddTeam, onJoinTeam }: SidebarListHeaderProps) {
  return (
    <div className="h-9 px-4 py-2 flex items-center justify-between">
      <span className="text-sub-title-1 text-grey-900 truncate">{title}</span>
      <DropdownMenuRoot>
        <DropdownMenuTrigger>
          <IconButton
            variant="ghost"
            size="xs"
            aria-label="팀 메뉴"
            className="hover:bg-grey-200 data-[state=open]:bg-grey-300 data-[state=open]:rounded-[5px]"
          >
            <IcMeatball className="w-6 h-6" />
          </IconButton>
        </DropdownMenuTrigger>
        <DropdownMenuPortal>
          <DropdownMenuContent
            className="flex flex-col gap-3 p-3 rounded-[8px] border border-grey-200 bg-white shadow-[0px_4px_16px_0px_rgba(0,0,0,0.07)]"
            align="end"
            sideOffset={4}
          >
            <div className="text-caption-4 text-grey-700 font-medium">목록</div>
            <DropdownMenuItem
              className="flex items-center gap-2 cursor-pointer"
              onSelect={onAddTeam}
            >
              <div className="w-5 h-5 rounded-full bg-blue-200 flex items-center justify-center">
                <IcPlusBlue className="w-2 h-2 text-blue-500" />
              </div>
              <span className="text-sub-title-3 text-blue-500">새로운 팀 만들기</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex items-center gap-2 cursor-pointer"
              onSelect={onJoinTeam}
            >
              <div className="w-5 h-5 rounded-full bg-grey-200 flex items-center justify-center">
                <IcEnter className="w-3.5 h-3.5" />
              </div>
              <span className="text-sub-title-2 text-grey-900">기존 팀 입장하기</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenuRoot>
    </div>
  );
}
