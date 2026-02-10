import { GoogleOAuthButton } from '../GoogleOAuthButton';
import { KakaoOAuthButton } from '../KaKaoOAuthButton';

export function SigninForm() {
  return (
    <>
      {/* 로고 스켈레톤 */}
      <div className="mb-10 flex justify-center">
        <div className="w-40 h-40 bg-[#E5E5E5] rounded-xl animate-pulse" />
      </div>

      {/* 로그인 버튼 그룹 */}
      <div className="flex flex-col gap-3">
        <KakaoOAuthButton />
        <GoogleOAuthButton />
      </div>
    </>
  );
}
