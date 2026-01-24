import { svg } from '@/assets';

interface NicknameStepProps {
  nickname: string;
  onNicknameChange: (value: string) => void;
  onSubmit: () => void;
}

export function NicknameStep({ nickname, onNicknameChange, onSubmit }: NicknameStepProps) {
  return (
    <div className="w-[368px] flex flex-col">
      {/* 제목 및 설명 */}
      <div className="flex flex-col items-center gap-3 mb-15">
        <h1 className="text-2xl font-bold text-center">
          안녕하세요
          <br />
          어떻게 불러드릴까요?
        </h1>
        <p className="text-[14px] font-medium leading-[150%] tracking-[-0.02em] text-[#000000]/42 text-center">
          프로필에 보일 닉네임이에요
        </p>
      </div>

      {/* 입력 필드 */}
      <div className="mb-30">
        <label htmlFor="nickname" className="block text-[14px] font-semibold text-[#6B7684] mb-2">
          닉네임
        </label>
        <div className="relative">
          <input
            id="nickname"
            type="text"
            placeholder="닉네임"
            value={nickname}
            onChange={(e) => onNicknameChange(e.target.value)}
            className="w-full h-12 px-5 pr-12 border-[1.5px] border-[#EBEBEB] focus:border-[#191F28] rounded-[6px] focus:outline-none"
          />
          {nickname && (
            <button
              type="button"
              onClick={() => onNicknameChange('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] flex items-center justify-center"
              aria-label="Clear input"
            >
              <img src={svg.deleteIcon} alt="Clear" className="w-full h-full" />
            </button>
          )}
        </div>
      </div>

      {/* 다음 버튼 */}
      <button
        onClick={onSubmit}
        disabled={!nickname.trim()}
        className="w-full h-12 bg-[#3182F6] hover:bg-[#2563EB] text-white font-semibold rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        type="button"
      >
        다음
      </button>
    </div>
  );
}
