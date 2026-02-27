import { GoogleOAuthButton } from '../GoogleOAuthButton';
import { KakaoOAuthButton } from '../KaKaoOAuthButton';
import IcLandingLogV2 from '@/shared/ui/icons/IcLandingLogV2';

export function SigninForm() {
  return (
    <div className="flex flex-col items-center">
      {/* 타이틀 + 서브타이틀 */}
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-2">
          <p className="text-title-1 text-grey-1000">함께 성장하는 회고 경험,</p>
          <IcLandingLogV2 />
        </div>
        <p className="mt-4 text-center text-caption-1 text-grey-900">
          AI 회고 작성부터 분석,
          <br />팀 회고 아카이빙까지 한번에!
        </p>
      </div>

      {/* 소셜 로그인 버튼 그룹 */}
      <div className="mt-[90px] flex flex-col gap-3">
        <KakaoOAuthButton />
        <GoogleOAuthButton />
      </div>
    </div>
  );
}
