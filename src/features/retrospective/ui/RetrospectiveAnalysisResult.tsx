/**
 * RetrospectiveAnalysisResult - 회고 분석 결과 컴포넌트
 *
 * AI 분석이 완료된 후 표시되는 결과 UI
 */

import { useEffect, useRef, useState } from 'react';
import type { AnalysisResponse } from '@/shared/api/generated/index';
import IcAiSpark from '@/shared/ui/icons/IcAiSpark';
import IcChevronDown from '@/shared/ui/icons/IcChevronDown';
import IcQuestionCircle from '@/shared/ui/icons/IcQuestionCircle';

// ============================================================================
// Types
// ============================================================================

interface RetrospectiveAnalysisResultProps {
  analysisData: AnalysisResponse;
}

// ============================================================================
// Component
// ============================================================================

function RetrospectiveAnalysisResult({ analysisData }: RetrospectiveAnalysisResultProps) {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // 외부 클릭 시 툴팁 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipRef.current &&
        buttonRef.current &&
        !tooltipRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsTooltipOpen(false);
      }
    };

    if (isTooltipOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isTooltipOpen]);

  const { insight, emotionRank, personalMissions } = analysisData;

  return (
    <div className="flex flex-col gap-8 overflow-y-auto px-5">
      {/* AI 인사이트 배너 */}
      <div
        className="rounded-xl border border-blue-100 p-5"
        style={{
          background: 'linear-gradient(180deg, #F5F9FE 0%, #FBFCFD 100%)',
        }}
      >
        <div className="flex items-center gap-1">
          <IcAiSpark className="h-4 w-4" />
          <span
            className="text-sub-title-3"
            style={{
              background: 'linear-gradient(90deg, #3182F6 0%, #D76DC0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            AI 인사이트
          </span>
        </div>
        <p
          className="mt-3 whitespace-pre-line text-title-3"
          style={{
            background: 'linear-gradient(90deg, #191F28 0%, #3C80EF 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {insight}
        </p>
      </div>

      {/* 감정 키워드 랭킹 */}
      <div>
        <div className="flex items-center gap-1">
          <h2 className="text-title-4 text-grey-1000">감정 키워드 랭킹</h2>
          <div className="relative">
            <button
              ref={buttonRef}
              type="button"
              onClick={() => setIsTooltipOpen(!isTooltipOpen)}
              className="cursor-pointer"
              aria-label="감정 키워드 랭킹 설명"
            >
              <IcQuestionCircle className="h-4 w-4" />
            </button>
            {/* 툴팁 */}
            {isTooltipOpen && (
              <div
                ref={tooltipRef}
                className="absolute bottom-full left-1/2 mb-2 w-[262px] -translate-x-1/2 rounded-2xl border border-grey-200 bg-white p-5 shadow-lg"
              >
                <h3 className="text-title-3 text-grey-1000">감정키워드 랭킹은 무엇인가요?</h3>
                <p className="mt-2 text-caption-2 text-grey-800">
                  - 입력된 팀원들의 회고 내용을 분석해, 가장 많이 언급된 감정 키워드를 기준으로
                  정렬한 랭킹이에요.
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="mt-3 flex flex-col gap-4">
          {emotionRank.map((item) => (
            <div key={item.rank} className="flex items-center gap-4">
              <span className="text-title-6 text-blue-500">{item.rank}</span>
              <span className="rounded-[10px] bg-grey-200 px-2 py-3 text-sub-title-5 text-grey-1000">
                {item.label}
              </span>
              <div className="flex flex-col gap-1">
                <span className="text-sub-title-3 text-grey-1000">{item.description}</span>
                <div className="flex items-center">
                  <div className="flex w-7">
                    <span className="h-3 w-3 rounded-full border border-white bg-[#D9D9D9]" />
                    <span className="-ml-1 h-3 w-3 rounded-full border border-white bg-[#D9D9D9]" />
                    <span className="-ml-1 h-3 w-3 rounded-full border border-white bg-[#D9D9D9]" />
                  </div>
                  <span className="ml-0.5 text-caption-6 text-grey-600">
                    {item.count}개의 응답과 연관
                  </span>
                  <IcChevronDown className="ml-0.5 h-3 w-3 text-grey-600" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 팀원을 위한 미션 */}
      {personalMissions.map((member) => (
        <div key={member.userId}>
          <h2 className="text-title-4 text-grey-1000">{member.userName}님을 위한 미션</h2>
          <div className="mt-3 flex flex-wrap gap-2.5">
            {member.missions.map((mission, index) => (
              <div
                key={mission.missionTitle}
                className="flex w-[calc((100%-20px)/3)] flex-col rounded-xl bg-[#F9FAFB] px-4 py-5"
              >
                <span className="text-title-7 text-[#3182F6]">미션 {index + 1}</span>
                <h3 className="mt-2.5 text-title-5 text-grey-900">{mission.missionTitle}</h3>
                <p className="mt-1 text-caption-3 font-medium text-grey-900">
                  {mission.missionDesc}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export { RetrospectiveAnalysisResult };
