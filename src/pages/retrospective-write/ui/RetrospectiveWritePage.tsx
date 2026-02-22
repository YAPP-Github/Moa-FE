import { Suspense } from 'react';
import { Navigate, useParams } from 'react-router';
import { WritePageContent } from './WritePageContent';
import { useRetrospectDetail } from '@/features/retrospective/api/retrospective.queries';
import { ApiErrorBoundary } from '@/shared/ui/error-boundary/ApiErrorBoundary';
import { RetrospectivePageHeader } from '@/widgets/header/ui/RetrospectivePageHeader';

function WritePageLoader({ retrospectId, teamId }: { retrospectId: number; teamId: number }) {
  const { data } = useRetrospectDetail(retrospectId);
  const detail = data.result;

  // 이미 제출한 유저는 기존 detail 페이지로 redirect
  if (detail.currentUserStatus === 'SUBMITTED') {
    return <Navigate to={`/teams/${teamId}/retrospects/${retrospectId}`} replace />;
  }

  return (
    <>
      <RetrospectivePageHeader teamId={teamId} title={detail.title} />
      <WritePageContent retrospectId={retrospectId} teamId={teamId} detail={detail} />
    </>
  );
}

export function RetrospectiveWritePage() {
  const { teamId, retrospectId } = useParams<{ teamId: string; retrospectId: string }>();

  const numTeamId = Number(teamId);
  const numRetrospectId = Number(retrospectId);

  return (
    <div className="min-h-screen bg-white">
      <ApiErrorBoundary resetKeys={[numRetrospectId]}>
        <Suspense
          fallback={
            <>
              <RetrospectivePageHeader teamId={numTeamId} />
              <div className="h-[calc(100vh-54px)] bg-grey-50" />
            </>
          }
        >
          <WritePageLoader retrospectId={numRetrospectId} teamId={numTeamId} />
        </Suspense>
      </ApiErrorBoundary>
    </div>
  );
}
