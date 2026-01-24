import { useEffect } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router';
import { svg } from '@/assets';
import { useRetrospectiveStore } from '@/store/retrospective';

export function RetrospectiveSubmitPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const retrospectives = useRetrospectiveStore((state) => state.retrospectives);
  const completeOtherParticipants = useRetrospectiveStore(
    (state) => state.completeOtherParticipants
  );
  const generateMockAnswers = useRetrospectiveStore((state) => state.generateMockAnswers);
  const completeRetrospective = useRetrospectiveStore((state) => state.completeRetrospective);

  const retrospective = retrospectives.find((r) => r.id === id);
  const currentUser = retrospective?.participants[0];
  const userId = currentUser?.id;

  useEffect(() => {
    if (!id || !userId) return;

    const timer = setTimeout(() => {
      completeOtherParticipants(id, userId);
      generateMockAnswers(id, userId);
      completeRetrospective(id);
      navigate(`/retrospective/${id}/result`);
    }, 5000);

    return () => clearTimeout(timer);
  }, [completeOtherParticipants, completeRetrospective, generateMockAnswers, id, navigate, userId]);

  if (!retrospective) {
    return <Navigate to="/retrospective" replace />;
  }

  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="flex flex-col gap-3.5 items-center">
        <img src={svg.bigCheck} alt="big-check" className="w-11 h-11" />
        <p className="text-3xl font-bold text-[#2C2C2C]">최종 제출이 완료되었습니다</p>
        <p className="text-xl font-medium text-[#767676]">
          모든 참여자가 회고를 완료할 때까지 대기해 주세요.
        </p>
      </div>
    </div>
  );
}
