import { AnalysisEmptyState } from './AnalysisEmptyState';
import { AnalysisResult } from './AnalysisResult';
import { useAnalysisResult } from '../../api/retrospective.queries';

interface AnalysisTabContentProps {
  retrospectId: number;
  participantCount: number;
  totalParticipants: number;
}

export function AnalysisTabContent({
  retrospectId,
  participantCount,
  totalParticipants,
}: AnalysisTabContentProps) {
  const { data } = useAnalysisResult(retrospectId);
  const analysis = data?.result;

  if (!analysis || (!analysis.emotionRank.length && !analysis.insight)) {
    return (
      <AnalysisEmptyState
        retrospectId={retrospectId}
        participantCount={participantCount}
        totalParticipants={totalParticipants}
      />
    );
  }

  return (
    <div className="px-6">
      <AnalysisResult analysis={analysis} />
    </div>
  );
}
