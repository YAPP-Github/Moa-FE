import { useRetrospects } from '@/features/retrospective/api/retrospective.queries';
import { RetrospectListStatus } from '@/features/retrospective/model/constants';
import type { RetrospectListItem } from '@/features/retrospective/model/schema';
import { RetrospectColumn } from '@/features/retrospective/ui/RetrospectColumn';

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

export function DashboardContent({ teamId }: DashboardContentProps) {
  const { data } = useRetrospects(teamId);

  const retrospects = data?.result ?? [];
  const { inProgress, draft, completed } = groupByStatus(retrospects);

  return (
    <div className="mt-[40px] flex gap-[54px]">
      <RetrospectColumn title="진행중" items={sortByDateAsc(inProgress)} />
      <RetrospectColumn title="임시저장" items={sortByDateAsc(draft)} />
      <RetrospectColumn title="종료" items={sortByDateAsc(completed)} />
    </div>
  );
}
