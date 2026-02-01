import { useParams } from 'react-router';
import { SidebarTeamItem } from './SidebarTeamItem';
import { useRetroRooms } from '@/features/team/api/team.queries';

export function SidebarTeamList() {
  const { teamId } = useParams<{ teamId: string }>();
  const { data, isLoading } = useRetroRooms();

  if (isLoading) {
    return (
      <div className="px-4 py-2">
        <div className="h-8 w-full animate-pulse rounded-lg bg-gray-100" />
      </div>
    );
  }

  const teams = data?.result ?? [];

  if (teams.length === 0) {
    return <div className="px-4 py-2 text-body-2 text-gray-500">팀이 없습니다</div>;
  }

  return (
    <ul className="flex flex-col gap-1">
      {teams.map((team) => (
        <SidebarTeamItem
          key={team.retroRoomId}
          team={team}
          isActive={team.retroRoomId === Number(teamId)}
        />
      ))}
    </ul>
  );
}
