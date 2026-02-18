import { useRetrospects } from '@/features/retrospective/api/retrospective.queries';
import IcNote from '@/shared/ui/logos/IcNote';

interface DashboardContentProps {
  teamId: number;
}

export function DashboardContent({ teamId }: DashboardContentProps) {
  const { data } = useRetrospects(teamId);

  const retrospects = data?.result ?? [];
  const hasRetrospectives = retrospects.length > 0;

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

  // TODO: 회고 목록 View 구현
  return null;
}
