import { SigninForm } from '@/features/auth/ui/forms/SigninForm';

export function SigninPage() {
  return (
    <div className="flex h-screen">
      {/* 좌측: 스켈레톤 영역 (데스크톱만 표시) */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center bg-[#F9F8F5] overflow-hidden">
        <div className="flex flex-col items-center gap-6">
          <div className="w-80 h-80 bg-[#E5E5E5] rounded-2xl animate-pulse" />
          <div className="flex flex-col items-center gap-3">
            <div className="w-48 h-6 bg-[#E5E5E5] rounded animate-pulse" />
            <div className="w-32 h-4 bg-[#E5E5E5] rounded animate-pulse" />
          </div>
        </div>
      </div>

      {/* 우측: 페이지 콘텐츠 */}
      <div className="flex w-full lg:w-1/2 flex-col items-center justify-center px-8 bg-white">
        <SigninForm />
      </div>
    </div>
  );
}
