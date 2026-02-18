import { Link } from 'react-router';
import type { RetroRoomListItem } from '@/features/team/model/schema';
import { cn } from '@/shared/lib/cn';

interface SidebarTeamItemProps {
  team: RetroRoomListItem;
  isActive: boolean;
}

export function SidebarTeamItem({ team, isActive }: SidebarTeamItemProps) {
  return (
    <li
      className={cn(
        'flex items-center pl-[14px] pr-4 h-10 rounded-[8px] transition-colors',
        isActive ? 'bg-gray-100' : 'hover:bg-gray-100'
      )}
    >
      <Link
        to={`/teams/${team.retroRoomId}`}
        title={team.retroRoomName}
        className="flex-1 min-w-0 text-sub-title-3 rounded text-[#3c3e48]"
      >
        <span className="truncate block">{team.retroRoomName}</span>
      </Link>
    </li>
  );
}
