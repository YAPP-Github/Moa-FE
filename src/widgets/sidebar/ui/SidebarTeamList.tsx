import { useNavigate, useParams } from 'react-router';
import { SidebarTeamItem } from './SidebarTeamItem';
import {
  useDeleteRetroRoom,
  useRetroRooms,
  useUpdateRetroRoomName,
} from '@/features/team/api/team.queries';

export function SidebarTeamList() {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();
  const { data, isLoading } = useRetroRooms();
  const updateNameMutation = useUpdateRetroRoomName();
  const deleteRoomMutation = useDeleteRetroRoom();

  const teams = data?.result ?? [];

  const handleEditTeamName = (retroRoomId: number, newName: string) => {
    updateNameMutation.mutate({ retroRoomId, name: newName });
  };

  const handleLeaveTeam = (retroRoomId: number) => {
    deleteRoomMutation.mutate(retroRoomId, {
      onSuccess: () => {
        // 현재 보고 있는 팀이 삭제되면 다른 팀으로 이동
        if (Number(teamId) === retroRoomId) {
          const remainingTeams = teams.filter((t) => t.retroRoomId !== retroRoomId);
          if (remainingTeams.length > 0) {
            navigate(`/teams/${remainingTeams[0].retroRoomId}`);
          } else {
            navigate('/');
          }
        }
      },
    });
  };

  if (isLoading) {
    return (
      <div className="px-4 py-2">
        <div className="h-8 w-full animate-pulse rounded-lg bg-gray-100" />
      </div>
    );
  }

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
          onEditTeamName={handleEditTeamName}
          onLeaveTeam={handleLeaveTeam}
        />
      ))}
    </ul>
  );
}
