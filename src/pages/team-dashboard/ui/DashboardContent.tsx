import { useMemo } from 'react';
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

/**
 * 진행중 회고를 오늘과 가까운 순으로 정렬 (날짜 오름차순)
 */
function sortByDateAsc(items: RetrospectListItem[]) {
  return [...items].sort(
    (a, b) => new Date(a.retrospectDate).getTime() - new Date(b.retrospectDate).getTime()
  );
}

export function DashboardContent({ teamId }: DashboardContentProps) {
  const { data } = useRetrospects(teamId);

  const retrospects = data?.result ?? [];
  const hasRetrospectives = retrospects.length > 0;

  const { inProgress, draft, completed } = useMemo(() => groupByStatus(retrospects), [retrospects]);

  const sortedInProgress = useMemo(() => sortByDateAsc(inProgress), [inProgress]);

  if (!hasRetrospectives) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center justify-center py-16">
          <IcNote width={29} height={34} className="mb-[16px]" />
          <p className="text-caption-3-medium text-grey-700">회고 내역이 없어요</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-[54px] mt-4">
      <RetrospectColumn title="진행중" items={sortedInProgress} />
      <RetrospectColumn title="임시저장" items={draft} />
      <RetrospectColumn title="종료" items={completed} />
    </div>
  );
}
