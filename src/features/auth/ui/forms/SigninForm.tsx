import { GoogleOAuthButton } from '../GoogleOAuthButton';
import { KakaoOAuthButton } from '../KaKaoOAuthButton';
import IcLandingLogo from '@/shared/ui/icons/IcLandingLogo';

export function SigninForm() {
  return (
    <div className="flex flex-col items-center">
      {/* 로고 + 서브타이틀 */}
      <div className="flex flex-col items-center gap-3">
        <IcLandingLogo />
        <p className="text-sub-title-3 text-grey-1000">함께 성장하는 회고 경험의 시작</p>
      </div>

      {/* 소셜 로그인 버튼 그룹 */}
      <div className="mt-20 flex flex-col gap-3">
        <KakaoOAuthButton />
        <GoogleOAuthButton />
      </div>
    </div>
  );
}
