import { useRetrospects } from '@/features/retrospective/api/retrospective.queries';
import { RetrospectListStatus } from '@/features/retrospective/model/constants';
import type { RetrospectListItem } from '@/features/retrospective/model/schema';
import { RetrospectColumn } from '@/features/retrospective/ui/RetrospectColumn';
import IcNote from '@/shared/ui/logos/IcNote';

interface DashboardContentProps {
  teamId: number;
}

function groupByStatus(retrospects: RetrospectListItem[]) {
  const inProgress: RetrospectListItem[] = [];
  const draft: RetrospectListItem[] = [];
  const completed: RetrospectListItem[] = [];

  for (const item of retrospects) {
    if (item.status === RetrospectListStatus.IN_PROGRESS) {
      inProgress.push(item);
    } else if (item.status === RetrospectListStatus.DRAFT) {
      draft.push(item);
    } else if (item.status === RetrospectListStatus.COMPLETED) {
      completed.push(item);
    }
  }

  return { inProgress, draft, completed };
}

function sortByDateAsc(items: RetrospectListItem[]) {
  return [...items].sort(
    (a, b) => new Date(a.retrospectDate).getTime() - new Date(b.retrospectDate).getTime()
  );
}

// TODO: UI 확인용 더미 데이터 - 확인 후 제거
const DUMMY_DRAFT_ITEMS: RetrospectListItem[] = Array.from({ length: 100 }, (_, i) => ({
  retrospectId: 9000 + i,
  projectName: `더미 임시저장 회고 ${i + 1}`,
  retrospectMethod: i % 2 === 0 ? 'KPT' : 'FOUR_L',
  retrospectDate: '2024-01-15',
  participantCount: 3,
  status: RetrospectListStatus.DRAFT,
}));

export function DashboardContent({ teamId }: DashboardContentProps) {
  const { data } = useRetrospects(teamId);

  const retrospects = data?.result ?? [];
  const { inProgress, draft, completed } = groupByStatus(retrospects);
  const draftWithDummy = [...draft, ...DUMMY_DRAFT_ITEMS];

  if (retrospects.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        <IcNote width={48} height={56} />
        <p className="text-caption-3-medium text-grey-700">회고 내역이 없어요</p>
      </div>
    );
  }

  return (
    <div className="mt-[40px] flex flex-1 min-h-0 gap-[54px]">
      <RetrospectColumn title="진행중" items={sortByDateAsc(inProgress)} teamId={teamId} />
      <RetrospectColumn title="임시저장" items={sortByDateAsc(draftWithDummy)} teamId={teamId} />
      <RetrospectColumn title="종료" items={sortByDateAsc(completed)} teamId={teamId} />
    </div>
  );
}
