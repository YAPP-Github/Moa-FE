import { Link } from 'react-router';
import type { RetroRoomListItem } from '@/shared/api/generated/index';
import { cn } from '@/shared/lib/cn';

interface SidebarTeamItemProps {
  team: RetroRoomListItem;
  isActive: boolean;
}

export function SidebarTeamItem({ team, isActive }: SidebarTeamItemProps) {
  return (
    <li>
      <Link
        to={`/teams/${team.retroRoomId}`}
        className={cn(
          'block w-full px-4 py-2 text-body-2 rounded-[8px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3182F6]/30',
          isActive ? 'bg-gray-100 text-gray-800 font-medium' : 'text-gray-700 hover:bg-gray-100'
        )}
      >
        {team.retroRoomName}
      </Link>
    </li>
  );
}
