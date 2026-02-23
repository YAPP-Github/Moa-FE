import { useAnalyzeRetrospective } from '../../api/retrospective.mutations';
import IcAiSpark from '@/shared/ui/icons/IcAiSpark';
import IcUser from '@/shared/ui/icons/IcUser';
import IcNote from '@/shared/ui/logos/IcNote';

interface AnalysisEmptyStateProps {
  retrospectId: number;
  participantCount: number;
  totalParticipants: number;
}

export function AnalysisEmptyState({
  retrospectId,
  participantCount,
  totalParticipants,
}: AnalysisEmptyStateProps) {
  const mutation = useAnalyzeRetrospective(retrospectId);

  const handleAnalyze = () => {
    mutation.mutate();
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4">
      <IcNote width={28.5} />
      <p className="text-center text-sub-title-4 text-grey-800">
        {mutation.isPending ? 'AI가 회고를 분석하고 있어요' : '현재까지 작성된 회고를 기반으로'}
        <br />
        {mutation.isPending ? '잠시만 기다려주세요' : '인사이트가 생성돼요'}
      </p>
      <div className="flex items-center gap-1 text-caption-3-medium text-grey-700">
        <IcUser width={16} height={16} />
        <span>
          {participantCount}/{totalParticipants}명 참여
        </span>
      </div>
      <button
        type="button"
        className="flex h-[36px] cursor-pointer items-center justify-center gap-1 rounded-[6px] border border-blue-100 bg-linear-to-r from-[#EEF5FF] to-[#F2FFFB] py-[7px] pr-[14px] pl-[10px] disabled:cursor-not-allowed disabled:opacity-50"
        onClick={handleAnalyze}
        disabled={mutation.isPending}
      >
        {mutation.isPending ? (
          <div className="h-[18px] w-[18px] animate-spin rounded-full border-2 border-blue-200 border-t-blue-500" />
        ) : (
          <IcAiSpark width={18} height={18} />
        )}
        <span className="bg-linear-to-r from-[#3182F6] to-[#52E79D] bg-clip-text text-[14px] font-semibold leading-none text-transparent">
          {mutation.isPending ? '분석 중...' : 'AI 회고 분석 하기'}
        </span>
      </button>
    </div>
  );
}
