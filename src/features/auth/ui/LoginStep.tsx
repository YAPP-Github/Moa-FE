import IcGoogle from '@/shared/ui/logos/IcGoogle';
import IcKakao from '@/shared/ui/logos/IcKakao';
import { useStepContext } from '@/shared/ui/multi-step-form/MultiStepForm';

export function LoginStep() {
  const { goToNextStep } = useStepContext();

  const handleKakaoLogin = () => {
    console.log('Kakao login clicked');
    // TODO: OAuth 인증 후 goToNextStep 호출
    goToNextStep();
  };

  const handleGoogleLogin = () => {
    console.log('Google login clicked');
    // TODO: OAuth 인증 후 goToNextStep 호출
    goToNextStep();
  };

  return (
    <>
      {/* 로고 스켈레톤 */}
      <div className="mb-40">
        <div className="w-40 h-40 bg-[#E5E5E5] rounded-xl animate-pulse" />
      </div>

      {/* 로그인 버튼 그룹 */}
      <div className="flex flex-col gap-3">
        {/* 카카오톡 로그인 버튼 */}
        <button
          className="w-[368px] h-12 bg-[#FFEB00] hover:bg-[#FFE500] text-black font-semibold text-base rounded-md transition-colors"
          onClick={handleKakaoLogin}
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
          onClick={handleGoogleLogin}
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
