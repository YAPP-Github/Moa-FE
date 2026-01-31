import { zodResolver } from '@hookform/resolvers/zod';
import { type SigninFormData, signinSchema } from '@/features/auth/model/schema';
import { InviteLinkStep } from '@/features/auth/ui/InviteLinkStep';
import { LoginStep } from '@/features/auth/ui/LoginStep';
import { NicknameStep } from '@/features/auth/ui/NicknameStep';
import { TeamNameStep } from '@/features/auth/ui/TeamNameStep';
import { TeamStep } from '@/features/auth/ui/TeamStep';
import { MultiStepForm } from '@/shared/ui/multi-step-form/MultiStepForm';

export function SigninPage() {
  const handleSubmit = (data: SigninFormData) => {
    console.log('Form submitted:', data);
    // TODO: Navigate to main app
  };

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

      {/* 우측: 로그인 패널 */}
      <div className="flex w-full lg:w-1/2 flex-col items-center justify-center px-8 bg-white">
        <MultiStepForm
          resolver={zodResolver(signinSchema)}
          defaultValues={{
            nickname: '',
            teamOption: undefined,
            teamName: '',
            inviteLink: '',
          }}
          onSubmit={handleSubmit}
        >
          <MultiStepForm.Step>
            <LoginStep />
          </MultiStepForm.Step>
          <MultiStepForm.Step fields={['nickname']}>
            <NicknameStep />
          </MultiStepForm.Step>
          <MultiStepForm.Step fields={['teamOption']}>
            <TeamStep />
          </MultiStepForm.Step>
          <MultiStepForm.Step fields={['teamName']}>
            <TeamNameStep />
          </MultiStepForm.Step>
          <MultiStepForm.Step fields={['inviteLink']}>
            <InviteLinkStep />
          </MultiStepForm.Step>
        </MultiStepForm>
      </div>
    </div>
  );
}
