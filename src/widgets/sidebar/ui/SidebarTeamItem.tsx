import { Link } from 'react-router';
import type { RetroRoomListItem } from '@/shared/api/generated/index';
import { cn } from '@/shared/lib/cn';
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu/DropdownMenu';
import { IconButton } from '@/shared/ui/icon-button/IconButton';
import IcMeatball from '@/shared/ui/icons/IcMeatball';

interface SidebarTeamItemProps {
  team: RetroRoomListItem;
  isActive: boolean;
  onEditTeamName?: (teamId: number) => void;
  onLeaveTeam?: (teamId: number) => void;
}

export function SidebarTeamItem({
  team,
  isActive,
  onEditTeamName,
  onLeaveTeam,
}: SidebarTeamItemProps) {
  return (
    <li
      className={cn(
        'group flex items-center justify-between px-4 py-2 rounded-[8px] transition-colors',
        isActive ? 'bg-gray-100' : 'hover:bg-gray-100'
      )}
    >
      <Link
        to={`/teams/${team.retroRoomId}`}
        className={cn(
          'flex-1 min-w-0 text-body-2 rounded',
          isActive ? 'text-gray-900 font-medium' : 'text-gray-700'
        )}
      >
        <span className="truncate block">{team.retroRoomName}</span>
      </Link>
      <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <DropdownMenuRoot>
          <DropdownMenuTrigger>
            <IconButton
              variant="ghost"
              size="xs"
              aria-label={`${team.retroRoomName} 메뉴`}
              onClick={(e) => e.preventDefault()}
            >
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
                onSelect={() => onEditTeamName?.(team.retroRoomId)}
              >
                팀 이름 편집하기
              </DropdownMenuItem>
              <DropdownMenuItem
                className="px-3 py-1.5 text-sm text-[#FF5959] rounded-md cursor-pointer hover:bg-red-50 data-highlighted:bg-red-50"
                onSelect={() => onLeaveTeam?.(team.retroRoomId)}
              >
                팀 나가기
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenuPortal>
        </DropdownMenuRoot>
      </div>
    </li>
  );
}
