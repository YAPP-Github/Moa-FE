import { Suspense, useState } from 'react';
import { useParams } from 'react-router';
import { useRetrospectDetail } from '@/features/retrospective/api/retrospective.queries';
import type { RetrospectiveTabType } from '@/features/retrospective/model/types';
import { AnalysisTabContent } from '@/features/retrospective/ui/detail/AnalysisTabContent';
import { DetailHeader } from '@/features/retrospective/ui/detail/DetailHeader';
import { MemberTabContent } from '@/features/retrospective/ui/detail/MemberTabContent';
import { QuestionTabContent } from '@/features/retrospective/ui/detail/QuestionTabContent';
import { ApiErrorBoundary } from '@/shared/ui/error-boundary/ApiErrorBoundary';
import { RetrospectivePageHeader } from '@/widgets/header/ui/RetrospectivePageHeader';

function DetailContent({ retrospectId, teamId }: { retrospectId: number; teamId: number }) {
  const { data } = useRetrospectDetail(retrospectId);
  const [activeTab, setActiveTab] = useState<RetrospectiveTabType>('question');

  const detail = data.result;

  return (
    <div className="flex flex-col">
      <RetrospectivePageHeader teamId={teamId} title={detail.title} />
      <div className="flex flex-col bg-grey-50 min-h-[calc(100vh-54px)] pb-12">
        <div className="mx-auto flex w-full max-w-[1096px] flex-1 flex-col">
          <DetailHeader activeTab={activeTab} onTabChange={setActiveTab} title={detail.title} />
          <div className="mt-4 flex flex-1 flex-col rounded-[20px] bg-white">
            {activeTab === 'question' && (
              <Suspense fallback={null}>
                <QuestionTabContent retrospectId={retrospectId} questions={detail.questions} />
              </Suspense>
            )}
            {activeTab === 'member' && (
              <Suspense fallback={null}>
                <MemberTabContent
                  retrospectId={retrospectId}
                  members={detail.members}
                  questions={detail.questions}
                />
              </Suspense>
            )}
            {activeTab === 'analysis' && (
              <AnalysisTabContent
                retrospectId={retrospectId}
                participantCount={detail.members.filter((m) => m.status === 'SUBMITTED').length}
                totalParticipants={detail.members.length}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function RetrospectiveDetailPage() {
  const { teamId, retrospectId } = useParams<{ teamId: string; retrospectId: string }>();

  const numTeamId = Number(teamId);
  const numRetrospectId = Number(retrospectId);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <ApiErrorBoundary resetKeys={[numRetrospectId]}>
        <Suspense
          fallback={
            <>
              <RetrospectivePageHeader teamId={numTeamId} />
              <div className="h-[calc(100vh-54px)] bg-grey-50" />
            </>
          }
        >
          <DetailContent retrospectId={numRetrospectId} teamId={numTeamId} />
        </Suspense>
      </ApiErrorBoundary>
    </div>
  );
}
