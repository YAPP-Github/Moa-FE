import { useState } from 'react';
import icDeleteMd from '@/shared/assets/svg/ic_delete_md.svg';

interface InviteLinkStepProps {
  onSubmit: (inviteLink: string) => void;
}

export function InviteLinkStep({ onSubmit }: InviteLinkStepProps) {
  const [inviteLink, setInviteLink] = useState('');

  const handleSubmit = () => {
    if (inviteLink.trim()) {
      onSubmit(inviteLink);
    }
  };

  const handleClear = () => {
    setInviteLink('');
  };

  return (
    <div className="w-[368px] flex flex-col">
      {/* 제목 */}
      <h1 className="text-2xl font-bold text-center mb-16">초대 링크를 입력해주세요</h1>

      {/* 입력 필드 */}
      <div className="mb-28">
        <label htmlFor="inviteLink" className="block text-[14px] font-semibold text-[#6B7684] mb-2">
          초대링크
        </label>
        <div className="relative">
          <input
            id="inviteLink"
            type="text"
            placeholder="초대 링크"
            value={inviteLink}
            onChange={(e) => setInviteLink(e.target.value)}
            className="w-full h-12 px-5 pr-12 border-[1.5px] border-[#EBEBEB] focus:border-[#191F28] rounded-[6px] focus:outline-none"
          />
          {inviteLink && (
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
        disabled={!inviteLink.trim()}
        className="w-full h-12 bg-[#3182F6] hover:bg-[#2563EB] text-white font-semibold rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        type="button"
      >
        시작하기
      </button>
    </div>
  );
}
