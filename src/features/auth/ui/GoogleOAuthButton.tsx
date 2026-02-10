import { getGoogleOAuthUrl } from '../lib/oauth';
import IcGoogle from '@/shared/ui/logos/IcGoogle';

export function GoogleOAuthButton() {
  const handleGoogleLogin = () => {
    window.location.href = getGoogleOAuthUrl();
  };

  return (
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
  );
}
