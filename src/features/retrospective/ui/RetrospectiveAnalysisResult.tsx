/**
 * RetrospectiveAnalysisResult - 회고 분석 결과 컴포넌트
 *
 * AI 분석이 완료된 후 표시되는 결과 UI
 */

import { useEffect, useRef, useState } from 'react';
import IcAiSpark from '@/shared/ui/icons/IcAiSpark';
import IcChevronDown from '@/shared/ui/icons/IcChevronDown';
import IcQuestionCircle from '@/shared/ui/icons/IcQuestionCircle';

// ============================================================================
// Mock Data
// ============================================================================

const MOCK_INSIGHT = {
  teamName: 'YAPP WEB 7팀',
  summary: [
    '이번 회고에서 팀은 목표 의식은 분명했지만,',
    '에너지 관리 측면에서 공통적인 아쉬움이 드러났어요.',
  ],
};

const MOCK_KEYWORDS = [
  {
    rank: 1,
    emotion: '피로',
    keyword: '짧은 스프린트 기간으로 인해 피로함을 느꼈어요',
    relatedCount: 6,
  },
  {
    rank: 2,
    emotion: '압박',
    keyword: '마이크로 매니징에 관해 압박감을 호소했어요',
    relatedCount: 6,
  },
  {
    rank: 3,
    emotion: '성취감',
    keyword: '적당한 작업범위로 성취감을 느꼈어요',
    relatedCount: 6,
  },
];

const MOCK_MISSIONS = [
  {
    missionNumber: 1,
    title: '타 파트에 의견 표현적 극적으로 하기',
    description: '즉각적인 응답과 활발한 협업툴 사용은 팀 운영의 안정성을 높여요',
  },
  {
    missionNumber: 2,
    title: '중간 점검에 대한 루틴 만들기',
    description: '규칙적으로 스크럼을 하면 작업 효율이 상승합니다',
  },
  {
    missionNumber: 3,
    title: '변동 사항 있을 때 미리 공유하기',
    description: '즉각적인 응답과 활발한 협업툴 사용은 팀 운영의 안정성을 높여요',
  },
  {
    missionNumber: 4,
    title: '팀원들과 정기적으로 1:1 미팅 진행하기',
    description:
      '개인적인 대화를 통해 팀원의 고민과 의견을 더 깊이 이해할 수 있어요. 신뢰 관계 형성에도 도움이 됩니다.',
  },
];

// ============================================================================
// Component
// ============================================================================

function RetrospectiveAnalysisResult() {
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

  return (
    <div className="flex flex-col gap-8 overflow-y-auto px-5 pt-4">
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
            {MOCK_INSIGHT.teamName}을 위한 AI 인사이트
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
          {MOCK_INSIGHT.summary.join('\n')}
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
          {MOCK_KEYWORDS.map((item) => (
            <div key={item.rank} className="flex items-center gap-4">
              {/* 넘버 섹션 */}
              <span className="text-title-6 text-blue-500">{item.rank}</span>
              {/* 키워드 박스 */}
              <span className="rounded-[10px] bg-grey-200 px-2 py-3 text-sub-title-5 text-grey-1000">
                {item.emotion}
              </span>
              {/* 메인 본문 섹션 */}
              <div className="flex flex-col gap-1">
                {/* 메인 텍스트 */}
                <span className="text-sub-title-3 text-grey-1000">{item.keyword}</span>
                {/* 응답 연관 영역 */}
                <div className="flex items-center">
                  {/* 겹치는 아바타 */}
                  <div className="flex w-7">
                    <span className="h-3 w-3 rounded-full border border-white bg-[#D9D9D9]" />
                    <span className="-ml-1 h-3 w-3 rounded-full border border-white bg-[#D9D9D9]" />
                    <span className="-ml-1 h-3 w-3 rounded-full border border-white bg-[#D9D9D9]" />
                  </div>
                  <span className="ml-0.5 text-caption-6 text-grey-600">
                    {item.relatedCount}개의 응답과 연관
                  </span>
                  <IcChevronDown className="ml-0.5 h-3 w-3 text-grey-600" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 팀원을 위한 미션 */}
      <div>
        <h2 className="text-title-4 text-grey-1000">소은님을 위한 미션</h2>
        <div className="mt-3 flex flex-wrap gap-2.5">
          {MOCK_MISSIONS.map((mission) => (
            <div
              key={mission.missionNumber}
              className="flex w-[calc((100%-20px)/3)] flex-col rounded-xl bg-[#F9FAFB] px-4 py-5"
            >
              <span className="text-title-7 text-[#3182F6]">미션 {mission.missionNumber}</span>
              <h3 className="mt-2.5 text-title-5 text-grey-900">{mission.title}</h3>
              <p className="mt-1 text-caption-3 font-medium text-grey-900">{mission.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export { RetrospectiveAnalysisResult };
