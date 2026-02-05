import { getGoogleOAuthUrl, getKakaoOAuthUrl } from '@/features/auth/lib/oauth';
import IcGoogle from '@/shared/ui/logos/IcGoogle';
import IcKakao from '@/shared/ui/logos/IcKakao';

export function LoginStep() {
  const handleKakaoLogin = () => {
    window.location.href = getKakaoOAuthUrl();
  };

  const handleGoogleLogin = () => {
    window.location.href = getGoogleOAuthUrl();
  };

  return (
    <>
      {/* 로고 스켈레톤 */}
      <div className="mb-10 flex justify-center">
        <div className="w-40 h-40 bg-[#E5E5E5] rounded-xl animate-pulse" />
      </div>

      {/* 로그인 버튼 그룹 */}
      <div className="flex flex-col gap-3">
        {/* 카카오톡 로그인 버튼 */}
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

        {/* 구글 로그인 버튼 */}
        <button
          className="w-[368px] h-12 bg-[#F8F9FC] hover:bg-gray-50 rounded-md cursor-pointer"
          onClick={handleGoogleLogin}
          type="button"
          aria-label="구글로 시작하기"
        >
          <span className="flex items-center justify-center gap-2">
            <IcGoogle className="w-5 h-5" />
            <span className="text-[15px] font-semibold leading-[150%] text-[#333D4B]">
              구글로 시작하기
            </span>
          </span>
        </button>
      </div>
    </>
  );
}
