import type { AnalysisResponse } from '../../model/types';
import IcAiSpark from '@/shared/ui/icons/IcAiSpark';

interface AnalysisResultProps {
  analysis: AnalysisResponse;
}

function KeywordItem({
  rank,
  label,
  description,
  count,
}: {
  rank: number;
  label: string;
  description: string;
  count: number;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-title-6 text-blue-500">{rank}</span>
      <span className="flex min-w-[40px] shrink-0 items-center justify-center rounded-[10px] bg-grey-200 px-[9.5px] py-[12px] text-sub-title-5 text-grey-1000">
        {label}
      </span>
      <div className="flex flex-col gap-1">
        <p className="text-sub-title-3 text-grey-1000">{description}</p>
        <span className="text-caption-6 text-grey-600">{count}개의 응답과 연관 &darr;</span>
      </div>
    </div>
  );
}

export function AnalysisResult({ analysis }: AnalysisResultProps) {
  const currentUser = analysis.personalMissions[0];

  return (
    <div className="flex flex-col gap-[68px]">
      {/* AI 인사이트 */}
      {analysis.insight && (
        <section>
          <div className="flex items-center gap-1">
            <IcAiSpark width={18} height={18} />
            <span className="bg-linear-to-r from-[#3182F6] to-[#52E79D] bg-clip-text text-sub-title-2 text-transparent">
              {currentUser ? `${currentUser.userName}팀을 위한 AI 인사이트` : 'AI 인사이트'}
            </span>
          </div>
          <p className="mt-2 whitespace-pre-wrap bg-linear-to-r from-[#191919] to-[#1B57AB] bg-clip-text text-title-2 text-transparent">
            {analysis.insight}
          </p>
        </section>
      )}

      {/* 회고 키워드 */}
      {analysis.emotionRank.length > 0 && (
        <section>
          <div className="grid grid-cols-2 gap-10">
            {/* 팀 회고 키워드 */}
            <div>
              <h3 className="text-title-4 text-grey-1000">팀 회고 키워드</h3>
              <div className="mt-2 flex flex-col gap-4">
                {analysis.emotionRank.map((item) => (
                  <KeywordItem
                    key={item.rank}
                    rank={item.rank}
                    label={item.label}
                    description={item.description}
                    count={item.count}
                  />
                ))}
              </div>
            </div>

            {/* TODO: 개인 회고 키워드 API 추가 시 별도 데이터로 분리 (현재는 팀 키워드와 동일 데이터 표시) */}
            <div>
              <h3 className="text-title-4 text-grey-1000">
                {currentUser ? `${currentUser.userName}님 회고 키워드` : '내 회고 키워드'}
              </h3>
              <div className="mt-2 flex flex-col gap-4">
                {analysis.emotionRank.map((item) => (
                  <KeywordItem
                    key={item.rank}
                    rank={item.rank}
                    label={item.label}
                    description={item.description}
                    count={item.count}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 개인 미션 */}
      {currentUser && currentUser.missions.length > 0 && (
        <section>
          <h3 className="text-title-4 text-grey-1000">{currentUser.userName}님을 위한 미션</h3>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {currentUser.missions.map((mission, idx) => (
              <div
                key={mission.missionTitle}
                className="flex flex-col gap-2 rounded-[12px] bg-[#F9FAFB] p-5"
              >
                <span className="text-title-6 text-blue-500">미션 {idx + 1}</span>
                <h4 className="text-title-4 text-grey-900">{mission.missionTitle}</h4>
                <p className="text-caption-2 text-grey-900">{mission.missionDesc}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
