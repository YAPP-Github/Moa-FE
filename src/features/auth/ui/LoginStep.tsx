import imgLogo from '@/shared/assets/images/img_logo.jpeg';
import IcGoogle from '@/shared/ui/logos/IcGoogle';
import IcKakao from '@/shared/ui/logos/IcKakao';

interface LoginStepProps {
  onKakaoLogin: () => void;
  onGoogleLogin: () => void;
}

export function LoginStep({ onKakaoLogin, onGoogleLogin }: LoginStepProps) {
  return (
    <>
      {/* 로고 */}
      <div className="mb-40">
        <img src={imgLogo} alt="회고 라운지 로고" className="w-40 h-auto object-contain" />
      </div>

      {/* 로그인 버튼 그룹 */}
      <div className="flex flex-col gap-3">
        {/* 카카오톡 로그인 버튼 */}
        <button
          className="w-[368px] h-12 bg-[#FFEB00] hover:bg-[#FFE500] text-black font-semibold text-base rounded-md transition-colors"
          onClick={onKakaoLogin}
          type="button"
          aria-label="카카오톡으로 시작하기"
        >
          <span className="flex items-center justify-center gap-2">
            <IcKakao className="w-5 h-5" />
            <span className="text-[15px] font-semibold leading-[150%] tracking-[-0.003em] text-[#333D4B]">
              카카오톡으로 시작하기
            </span>
          </span>
        </button>

        {/* 구글 로그인 버튼 */}
        <button
          className="w-[368px] h-12 bg-white hover:bg-gray-50 text-gray-700 font-semibold text-base border border-gray-300 rounded-md transition-colors"
          onClick={onGoogleLogin}
          type="button"
          aria-label="구글로 시작하기"
        >
          <span className="flex items-center justify-center gap-2">
            <IcGoogle className="w-5 h-5" />
            <span className="text-[15px] font-semibold leading-[150%] tracking-[-0.003em] text-[#333D4B]">
              구글로 시작하기
            </span>
          </span>
        </button>
      </div>
    </>
  );
}
