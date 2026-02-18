import { useParams } from 'react-router';
import { DashboardContent } from './DashboardContent';
import { DashboardHeader } from './DashboardHeader';
import { useRetroRooms } from '@/features/team/api/team.queries';

export function TeamDashboardPage() {
  const { teamId } = useParams<{ teamId: string }>();
  const { data } = useRetroRooms();

  const teams = data?.result ?? [];
  const currentTeam = teams.find((t) => t.retroRoomId === Number(teamId));
  const teamName = currentTeam?.retroRoomName ?? '';

  return (
    <div className="flex h-full flex-col bg-grey-50">
      <div className="mx-auto mt-[36px] flex min-h-0 w-full max-w-[960px] flex-1 flex-col">
        <DashboardHeader teamId={Number(teamId)} teamName={teamName} />
        <DashboardContent teamId={Number(teamId)} />
      </div>
    </div>
  );
}
