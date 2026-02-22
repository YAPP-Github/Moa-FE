import { Suspense, useState } from 'react';
import { Link, useParams } from 'react-router';
import { ProfileDropdown } from '@/features/auth/ui/ProfileDropdown';
import { useRetrospectDetail } from '@/features/retrospective/api/retrospective.queries';
import type { RetrospectiveTabType } from '@/features/retrospective/model/types';
import { AnalysisTabContent } from '@/features/retrospective/ui/detail/AnalysisTabContent';
import { DetailHeader } from '@/features/retrospective/ui/detail/DetailHeader';
import { MemberTabContent } from '@/features/retrospective/ui/detail/MemberTabContent';
import { QuestionTabContent } from '@/features/retrospective/ui/detail/QuestionTabContent';
import { cn } from '@/shared/lib/cn';
import { ApiErrorBoundary } from '@/shared/ui/error-boundary/ApiErrorBoundary';
import IcFront from '@/shared/ui/icons/IcFront';
import IcMoa from '@/shared/ui/logos/IcMoa';

function DetailPageHeader({ teamId, title }: { teamId: number; title?: string }) {
  return (
    <header className="flex h-[54px] items-center justify-between border-b border-[#F3F4F5] bg-white px-[36px]">
      <div className="flex items-center gap-3">
        <IcMoa />
        <span className="text-caption-4 text-grey-300">|</span>
        <nav className="flex items-center gap-[2px] text-caption-3-medium leading-none text-grey-900">
          <span className="flex items-center">
            <Link to={`/teams/${teamId}`}>홈</Link>
          </span>
          {title && (
            <>
              <IcFront width={24} height={24} />
              <span className="flex items-center">{title}</span>
            </>
          )}
        </nav>
      </div>
      <ProfileDropdown />
    </header>
  );
}

function DetailContent({ retrospectId, teamId }: { retrospectId: number; teamId: number }) {
  const { data } = useRetrospectDetail(retrospectId);
  const [activeTab, setActiveTab] = useState<RetrospectiveTabType>('question');

  const detail = data.result;

  return (
    <>
      <DetailPageHeader teamId={teamId} title={detail.title} />
      <div className="flex h-[calc(100vh-54px)] flex-col overflow-auto bg-grey-50">
        <div className="mx-auto flex w-full max-w-[1096px] min-h-0 flex-1 flex-col">
          <DetailHeader activeTab={activeTab} onTabChange={setActiveTab} title={detail.title} />
          <div
            className={cn(
              'flex min-h-0 flex-col rounded-t-[20px] bg-white',
              activeTab === 'analysis' ? 'mb-12 flex-1 rounded-b-[20px]' : 'flex-1 overflow-hidden'
            )}
          >
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
              <Suspense fallback={null}>
                <AnalysisTabContent
                  retrospectId={retrospectId}
                  participantCount={detail.members.length}
                  totalParticipants={detail.members.length}
                />
              </Suspense>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export function RetrospectiveDetailPage() {
  const { teamId, retrospectId } = useParams<{ teamId: string; retrospectId: string }>();

  const numTeamId = Number(teamId);
  const numRetrospectId = Number(retrospectId);

  return (
    <div className="min-h-screen bg-white">
      <ApiErrorBoundary resetKeys={[numRetrospectId]}>
        <Suspense
          fallback={
            <>
              <DetailPageHeader teamId={numTeamId} />
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
