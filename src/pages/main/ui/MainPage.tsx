import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useRetroRooms } from '@/features/team/api/team.queries';
import { NoTeamEmptyState } from '@/features/team/ui/NoTeamEmptyState';

export function MainPage() {
  const navigate = useNavigate();
  const { data, isLoading } = useRetroRooms();

  const teams = data?.result ?? [];
  const hasTeam = teams.length > 0;

  useEffect(() => {
    if (hasTeam) {
      navigate(`/teams/${teams[teams.length - 1].retroRoomId}`, { replace: true });
    }
  }, [hasTeam, teams, navigate]);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  /*
  if (isError) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <p className="text-body-1 text-grey-600 mb-4">팀 목록을 불러오는데 실패했습니다.</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="text-primary-500 hover:text-primary-600 font-medium"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }
  */

  // 팀이 있으면 useEffect에서 리다이렉트 처리
  if (hasTeam) {
    return null;
  }

  return <NoTeamEmptyState />;
}
