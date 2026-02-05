/**
 * AnalysisEmptyState - 회고 분석 전 상태 컴포넌트
 *
 * AI 분석이 아직 진행되지 않았을 때 표시되는 빈 상태 UI
 */

import IcAiSpark from '@/shared/ui/icons/IcAiSpark';
import IcUserProfileSm from '@/shared/ui/icons/IcUserProfileSm';
import IcNote from '@/shared/ui/logos/IcNote';

interface AnalysisEmptyStateProps {
  participantCount: number;
  totalParticipants: number;
  onAnalyzeClick?: () => void;
}

function AnalysisEmptyState({
  participantCount,
  totalParticipants,
  onAnalyzeClick,
}: AnalysisEmptyStateProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      {/* 아이콘 */}
      <IcNote className="h-[34px] w-[29px]" />

      {/* 안내 텍스트 */}
      <p className="mt-4 text-center text-sub-title-4 text-grey-800">
        현재까지 작성된 회고를 기준으로
        <br />
        인사이트가 생성돼요
      </p>

      {/* 참여자 수 */}
      <div className="mt-4 flex items-center gap-1">
        <IcUserProfileSm className="h-4 w-4" />
        <span className="text-caption-3 font-medium text-grey-700">
          {participantCount}/{totalParticipants}명 참여
        </span>
      </div>

      {/* AI 분석 버튼 */}
      <button
        type="button"
        onClick={onAnalyzeClick}
        className="mt-5 flex cursor-pointer items-center gap-1 rounded-md border border-blue-100 px-3 py-[10px]"
        style={{
          background: 'linear-gradient(90deg, #EEF5FF 0%, #FFF6FF 100%)',
        }}
      >
        <IcAiSpark className="h-[18px] w-[18px]" />
        <span
          className="text-[14px] font-semibold"
          style={{
            background: 'linear-gradient(90deg, #3182F6 0%, #D76DC0 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          AI 회고 분석 하기
        </span>
      </button>
    </div>
  );
}

export { AnalysisEmptyState, type AnalysisEmptyStateProps };
