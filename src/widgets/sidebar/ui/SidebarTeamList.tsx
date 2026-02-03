import { useState } from 'react';
import { useParams } from 'react-router';
import { SidebarTeamItem } from './SidebarTeamItem';
import type { RetroRoomListItem } from '@/shared/api/generated/index';
// import { useRetroRooms } from '@/features/team/api/team.queries';

export function SidebarTeamList() {
  const { teamId } = useParams<{ teamId: string }>();
  // const { data, isLoading } = useRetroRooms();
  const isLoading = false;

  const [teams, setTeams] = useState<RetroRoomListItem[]>([
    { retroRoomId: 1, retroRoomName: 'YAPP WEB 3팀 - 모아', orderIndex: 0 },
    { retroRoomId: 2, retroRoomName: 'SOPT', orderIndex: 1 },
  ]);

  if (isLoading) {
    return (
      <div className="px-4 py-2">
        <div className="h-8 w-full animate-pulse rounded-lg bg-gray-100" />
      </div>
    );
  }

  const handleEditTeamName = (teamId: number, newName: string) => {
    setTeams((prev) =>
      prev.map((team) => (team.retroRoomId === teamId ? { ...team, retroRoomName: newName } : team))
    );
  };

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
        />
      ))}
    </ul>
  );
}
