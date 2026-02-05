/**
 * CompletedRetrospectiveView - 회고 완료 후 탭 뷰 컨테이너
 *
 * 회고 내용 탭과 회고 분석 탭을 전환하며 표시하는 컨테이너 컴포넌트
 */

import { useState } from 'react';
import type {
  CompletedRetrospectiveViewProps,
  RetrospectiveTabType,
} from '@/features/retrospective/model/types';
import { AnalysisEmptyState } from '@/features/retrospective/ui/AnalysisEmptyState';
import { RetrospectiveAnalysisResult } from '@/features/retrospective/ui/RetrospectiveAnalysisResult';
import { RetrospectiveContentTab } from '@/features/retrospective/ui/RetrospectiveContentTab';

function CompletedRetrospectiveView({
  projectName,
  participantCount,
  totalParticipants,
}: CompletedRetrospectiveViewProps) {
  const [activeTab, setActiveTab] = useState<RetrospectiveTabType>('content');
  const [isAnalyzed, setIsAnalyzed] = useState(false);

  const handleAnalyzeClick = () => {
    // TODO: AI 분석 API 호출
    setIsAnalyzed(true);
  };

  return (
    <div className="flex h-full flex-col">
      {/* 타이틀 + 탭 영역 */}
      <div className="mb-5 pl-5">
        {/* 회고 타이틀 */}
        <h1 className="text-title-2 text-grey-1000">{projectName}</h1>

        {/* 탭 버튼 */}
        <div className="mt-5 flex rounded-lg bg-grey-100 p-1" role="tablist">
          <button
            type="button"
            role="tab"
            onClick={() => setActiveTab('content')}
            className={`flex-1 cursor-pointer rounded-md px-4 py-2 text-sub-title-3 transition-colors ${activeTab === 'content' ? 'bg-grey-0 text-grey-1000' : 'text-grey-800'}`}
            aria-selected={activeTab === 'content'}
          >
            회고 내용
          </button>
          <button
            type="button"
            role="tab"
            onClick={() => setActiveTab('analysis')}
            className={`flex-1 cursor-pointer rounded-md px-4 py-2 text-sub-title-3 transition-colors ${activeTab === 'analysis' ? 'bg-grey-0 text-grey-1000' : 'text-grey-800'}`}
            aria-selected={activeTab === 'analysis'}
          >
            회고 분석
          </button>
        </div>
      </div>

      {/* 탭 콘텐츠 영역 */}
      <div className="flex flex-1 overflow-y-auto scrollbar-hide">
        {activeTab === 'content' && (
          <div className="w-full flex-1">
            <RetrospectiveContentTab />
          </div>
        )}

        {activeTab === 'analysis' && (
          <div className="flex w-full flex-1">
            {isAnalyzed ? (
              <RetrospectiveAnalysisResult />
            ) : (
              <AnalysisEmptyState
                participantCount={participantCount}
                totalParticipants={totalParticipants}
                onAnalyzeClick={handleAnalyzeClick}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export { CompletedRetrospectiveView, type CompletedRetrospectiveViewProps };
