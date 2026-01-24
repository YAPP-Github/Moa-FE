import { useState } from 'react';

interface TeamStepProps {
  onSubmit: (teamOption: 'create' | 'join') => void;
}

export function TeamStep({ onSubmit }: TeamStepProps) {
  const [selectedOption, setSelectedOption] = useState<'create' | 'join' | null>(null);

  const handleOptionClick = (option: 'create' | 'join') => {
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    if (selectedOption) {
      onSubmit(selectedOption);
    }
  };

  return (
    <div className="w-[368px] flex flex-col">
      {/* 제목 및 설명 */}
      <div className="flex flex-col items-center gap-3 mb-25">
        <h1 className="text-2xl font-bold text-center">
          환영합니다!
          <br />
          참여하실 팀이 있으신가요?
        </h1>
        <p className="text-[14px] font-medium leading-[150%] tracking-[-0.02em] text-[#000000]/42 text-center">
          프로필에 보일 닉네임이에요
        </p>
      </div>

      {/* 버튼 그룹 */}
      <div className="flex gap-3 mb-30">
        {/* 새로운 팀 생성 버튼 */}
        <button
          onClick={() => handleOptionClick('create')}
          className={`flex-1 py-5 font-semibold rounded-[10px] transition-colors ${
            selectedOption === 'create'
              ? 'bg-[#E9F2FE] text-[#31B2F6]'
              : 'bg-[#F3F4F5] text-[#000000]'
          }`}
          type="button"
        >
          새로운 팀 생성
        </button>

        {/* 초대 받았어요 버튼 */}
        <button
          onClick={() => handleOptionClick('join')}
          className={`flex-1 py-5 font-semibold rounded-[10px] transition-colors ${
            selectedOption === 'join'
              ? 'bg-[#E9F2FE] text-[#31B2F6]'
              : 'bg-[#F3F4F5] text-[#000000]'
          }`}
          type="button"
        >
          초대 받았어요
        </button>
      </div>

      {/* 다음 버튼 */}
      <button
        onClick={handleSubmit}
        disabled={!selectedOption}
        className="w-full h-12 bg-[#3182F6] hover:bg-[#2563EB] text-white font-semibold rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        type="button"
      >
        다음
      </button>
    </div>
  );
}
