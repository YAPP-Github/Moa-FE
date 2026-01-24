import { Navigate, useParams } from 'react-router';
import { useRetrospectiveStore } from '@/store/retrospective';

export function RetrospectiveWaitingPage() {
  const { id } = useParams<{ id: string }>();

  const retrospectives = useRetrospectiveStore((state) => state.retrospectives);

  const retrospective = retrospectives.find((r) => r.id === id);
  if (!retrospective) {
    return <Navigate to="/retrospective" replace />;
  }

  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="flex flex-col gap-3.5 items-center">
        <h1 className="text-3xl font-bold text-[#2C2C2C]">회고 대기 중</h1>
        <p className="text-xl font-medium text-[#767676]">
          모든 참여자가 회고를 완료할 때까지 대기해 주세요.
        </p>
      </div>
    </div>
  );
}
