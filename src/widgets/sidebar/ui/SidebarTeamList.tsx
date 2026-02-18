import { useParams } from 'react-router';
import { SidebarTeamItem } from './SidebarTeamItem';
import { useRetroRooms } from '@/features/team/api/team.queries';

export function SidebarTeamList() {
  const { teamId } = useParams<{ teamId: string }>();
  const { data } = useRetroRooms();

  const teams = data?.result ?? [];

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
