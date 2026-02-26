import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu/DropdownMenu';
import { IconButton } from '@/shared/ui/icon-button/IconButton';
import IcMeatball from '@/shared/ui/icons/IcMeatball';

interface TeamMenuDropdownProps {
  teamName: string;
  onEditTeamName: () => void;
  onLeaveTeam?: () => void;
}

export function TeamMenuDropdown({ teamName, onEditTeamName, onLeaveTeam }: TeamMenuDropdownProps) {
  return (
    <DropdownMenuRoot>
      <DropdownMenuTrigger>
        <IconButton variant="ghost" size="xs" shape="square" aria-label="팀 메뉴">
          <IcMeatball width={24} height={24} />
        </IconButton>
      </DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuContent
          align="end"
          className="min-w-[118px] rounded-[8px] border border-grey-200 bg-white p-3 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.07)]"
        >
          <div className="flex flex-col gap-3">
            <span className="text-caption-4 text-grey-700">{teamName}</span>
            <DropdownMenuItem
              onSelect={onEditTeamName}
              className="flex items-center cursor-pointer"
            >
              <span className="text-sub-title-3 text-grey-900">팀 이름 편집하기</span>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={onLeaveTeam} className="flex items-center cursor-pointer">
              <span className="text-sub-title-3 text-red-300">팀 나가기</span>
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenuRoot>
  );
}
