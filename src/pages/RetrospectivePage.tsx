import { useNavigate } from 'react-router';
import { RetrospectiveCard } from '@/components/RetrospectiveCard';
import { Button } from '@/components/ui/button';
import { generateUUID } from '@/lib/utils';
import { useRetrospectiveStore } from '@/store/retrospective';

export function RetrospectivePage() {
  const navigate = useNavigate();

  const retrospectives = useRetrospectiveStore((state) => state.retrospectives);
  const addRetrospective = useRetrospectiveStore((state) => state.addRetrospective);
  const setActiveRetrospective = useRetrospectiveStore((state) => state.setActiveRetrospective);

  const handleCreateRetrospective = () => {
    const nextSprint =
      retrospectives.length > 0 ? Math.max(...retrospectives.map((r) => r.sprint)) + 1 : 1;

    const endTime = new Date(Date.now() + 12 * 60 * 1000).toISOString();

    addRetrospective({
      title: `YAPP ${nextSprint}차 스프린트 회고`,
      description: '피드백 위주의 회고 진행',
      sprint: nextSprint,
      status: 'in_progress',
      retrospectiveType: 'KPT',
      totalQuestions: 3,
      answers: [],
      endTime,
      questions: [
        {
          title: '이번 작업/프로젝트에서 잘했던 점은 무엇인가요?',
        },
        {
          title: '진행 과정에서 아쉬웠던 점이나 문제가 있었나요?',
        },
        {
          title: '비효율적이거나 어려웠던 부분은 무엇이었나요?',
        },
      ],
      participants: [
        {
          id: generateUUID(),
          name: '홍길동',
          avatar: '홍',
          answeredQuestions: 0,
        },
        {
          id: generateUUID(),
          name: '김철수',
          avatar: '김',
          answeredQuestions: 2,
        },
        {
          id: generateUUID(),
          name: '이영희',
          avatar: '이',
          answeredQuestions: 5,
        },
        {
          id: generateUUID(),
          name: '박민수',
          avatar: '박',
          answeredQuestions: 1,
        },
      ],
    });
  };

  return (
    <div className="flex min-h-full flex-col space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">회고 라운지</h2>
        <Button onClick={handleCreateRetrospective} className="gap-2">
          만들기
        </Button>
      </div>

      <div className="grid gap-4 grid-cols-3">
        {retrospectives.map((retro) => (
          <RetrospectiveCard
            key={retro.id}
            retrospective={retro}
            onClick={() => {
              setActiveRetrospective(retro.id);
              navigate(`/retrospective/${retro.id}`);
            }}
          />
        ))}
      </div>

      {retrospectives.length === 0 && (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-center text-muted-foreground">회고 내역이 없어요</p>
        </div>
      )}
    </div>
  );
}
