import { useEffect, useState } from 'react';
import type { Retrospective } from '@/store/retrospective';
import { getProgressStatus } from '@/utils/format';

interface ActiveRetrospectiveCardProps {
  retrospective: Retrospective;
}

function useCountdown(endTime: string, retrospectiveId: string) {
  const [timeLeft, setTimeLeft] = useState({ minutes: 0, seconds: 0 });

  // biome-ignore lint/correctness/useExhaustiveDependencies: endTime is stable and retrospectiveId is intentionally excluded
  useEffect(() => {
    const calculateTime = () => {
      const now = Date.now();
      const end = new Date(endTime).getTime();
      const diff = end - now;

      if (diff <= 0) {
        return { minutes: 0, seconds: 0 };
      }

      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      return { minutes, seconds };
    };

    setTimeLeft(calculateTime());

    const interval = setInterval(() => {
      const time = calculateTime();
      setTimeLeft(time);

      if (time.minutes === 0 && time.seconds === 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [endTime, retrospectiveId]);

  return timeLeft;
}

export function ActiveRetrospectiveCard({ retrospective }: ActiveRetrospectiveCardProps) {
  const { minutes, seconds } = useCountdown(retrospective.endTime, retrospective.id);
  const participantCount = retrospective.participants.length;

  return (
    <div className="mb-4 flex flex-col gap-4 border-b border-[#E0E0E0] pb-4">
      <div>
        <h1 className="text-2xl font-bold text-[#1E1E1E]">
          남은 시간 {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </h1>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="truncate text-sm text-[#111111] font-semibold">
              {retrospective.title}
            </div>
          </div>
          <div className="ml-2 shrink-0 text-xs text-[#A0A0A9]">인원 {participantCount}</div>
        </div>
      </div>

      <div className="space-y-2">
        {retrospective.participants.map((participant) => (
          <div key={participant.id} className="flex items-center gap-2">
            <div className="flex size-6 items-center justify-center rounded-sm bg-[#C4C4C4]" />
            <div className="truncate text-base font-medium">{participant.name}</div>
            <div className="truncate text-sm text-[#666670]">
              {getProgressStatus(participant, retrospective.totalQuestions)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
