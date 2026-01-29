import { useState } from 'react';
import icDeleteMd from '@/shared/assets/svg/ic_delete_md.svg';

interface TeamNameStepProps {
  onSubmit: (teamName: string) => void;
}

export function TeamNameStep({ onSubmit }: TeamNameStepProps) {
  const [teamName, setTeamName] = useState('');

  const handleSubmit = () => {
    if (teamName.trim()) {
      onSubmit(teamName);
    }
  };

  const handleClear = () => {
    setTeamName('');
  };

  return (
    <div className="w-[368px] flex flex-col">
      {/* 제목 */}
      <h1 className="text-2xl font-bold text-center mb-16">팀 이름을 입력해주세요</h1>

      {/* 입력 필드 */}
      <div className="mb-28">
        <label htmlFor="teamName" className="block text-[14px] font-semibold text-[#6B7684] mb-2">
          팀 이름
        </label>
        <div className="relative">
          <input
            id="teamName"
            type="text"
            placeholder="팀 이름"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            className="w-full h-12 px-5 pr-12 border-[1.5px] border-[#EBEBEB] focus:border-[#191F28] rounded-[6px] focus:outline-none"
          />
          {teamName && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] flex items-center justify-center"
              aria-label="Clear input"
            >
              <img src={icDeleteMd} alt="Clear" className="w-full h-full" />
            </button>
          )}
        </div>
      </div>

      {/* 시작하기 버튼 */}
      <button
        onClick={handleSubmit}
        disabled={!teamName.trim()}
        className="w-full h-12 bg-[#3182F6] hover:bg-[#2563EB] text-white font-semibold rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        type="button"
      >
        시작하기
      </button>
    </div>
  );
}
