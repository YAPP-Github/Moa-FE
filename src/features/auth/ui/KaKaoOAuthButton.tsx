import { getKakaoOAuthUrl } from '../lib/oauth';
import IcKakao from '@/shared/ui/logos/IcKakao';

export function KakaoOAuthButton() {
  const handleKakaoLogin = () => {
    window.location.href = getKakaoOAuthUrl();
  };

  return (
    <button
      className="w-[368px] h-12 bg-[#FFEB00] hover:bg-[#FFE500] rounded-md cursor-pointer"
      onClick={handleKakaoLogin}
      type="button"
      aria-label="카카오톡으로 시작하기"
    >
      <span className="flex items-center justify-center gap-2">
        <IcKakao className="w-5 h-5" />
        <span className="text-[15px] font-semibold leading-[150%] text-[#333D4B]">
          카카오톡으로 시작하기
        </span>
      </span>
    </button>
  );
}
