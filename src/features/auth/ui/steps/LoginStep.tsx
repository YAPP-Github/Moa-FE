import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useEmailLogin } from '@/features/auth/api/auth.mutations';
import { getGoogleOAuthUrl, getKakaoOAuthUrl } from '@/features/auth/lib/oauth';
import { useAuthStore } from '@/features/auth/model/store';
import IcGoogle from '@/shared/ui/logos/IcGoogle';
import IcKakao from '@/shared/ui/logos/IcKakao';

export function LoginStep() {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  // TODO: 테스트용 이메일 로그인 상태 - 추후 삭제 필요
  const [email, setEmail] = useState('');
  const emailLoginMutation = useEmailLogin();

  // TODO: 테스트용 이메일 로그인 핸들러 - 추후 삭제 필요
  const handleEmailLogin = async () => {
    if (!email.trim()) return;

    try {
      const response = await emailLoginMutation.mutateAsync(email);

      if (response.isSuccess && response.result) {
        // 쿠키 기반 인증: 토큰은 쿠키로 전달됨
        login();
        navigate('/');
      }
    } catch {
      console.error('이메일 로그인 실패');
    }
  };

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

      {/* TODO: 테스트용 이메일 로그인 폼 - 추후 삭제 필요 */}
      <div className="w-[368px] mb-8 p-4 border border-dashed border-orange-400 rounded-lg bg-orange-50">
        <p className="text-xs text-orange-600 mb-2 font-medium">
          ⚠️ 테스트용 이메일 로그인 (개발 전용)
        </p>
        <div className="flex gap-2">
          <input
            type="email"
            placeholder="이메일 입력"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
            onKeyDown={(e) => e.key === 'Enter' && handleEmailLogin()}
          />
          <button
            type="button"
            onClick={handleEmailLogin}
            disabled={emailLoginMutation.isPending || !email.trim()}
            className="px-4 py-2 bg-orange-500 text-white rounded-md text-sm font-medium hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {emailLoginMutation.isPending ? '...' : '로그인'}
          </button>
        </div>
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
