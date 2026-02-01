import { useParams } from 'react-router';

export function TeamDashboardPage() {
  const { teamId } = useParams<{ teamId: string }>();

  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center">
        <h1 className="text-heading-1 text-gray-900 mb-2">팀 대시보드</h1>
        <p className="text-body-1 text-gray-600">팀 ID: {teamId}</p>
        <p className="text-body-2 text-gray-500 mt-4">회고 목록 기능이 곧 추가됩니다.</p>
      </div>
    </div>
  );
}
