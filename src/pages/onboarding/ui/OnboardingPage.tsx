import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router';
import { useSignup } from '@/features/auth/api/auth.mutations';
import { type SigninFormData, signinSchema } from '@/features/auth/model/schema';
import { useAuthStore } from '@/features/auth/model/store';
import { NicknameStep } from '@/features/auth/ui/steps/NicknameStep';
import { TeamActionStep } from '@/features/auth/ui/steps/TeamActionStep';
import { TeamStep } from '@/features/auth/ui/steps/TeamStep';
import { useCreateRetroRoom, useJoinRetroRoom } from '@/features/team/api/team.mutations';
import { MultiStepForm } from '@/shared/ui/multi-step-form/MultiStepForm';

export function OnboardingPage() {
  const navigate = useNavigate();
  const { signupEmail, login, clearOnboarding } = useAuthStore();
  const signupMutation = useSignup();
  const createRetroRoomMutation = useCreateRetroRoom();
  const joinRetroRoomMutation = useJoinRetroRoom();

  const handleSubmit = async (data: SigninFormData) => {
    try {
      // signupToken은 쿠키로 자동 전송됨
      await signupMutation.mutateAsync({
        email: signupEmail || '',
        nickname: data.nickname,
      });

      // 쿠키 기반 인증: 토큰은 쿠키로 전달됨
      login();
      clearOnboarding();

      if (data.teamOption === 'create' && data.teamName) {
        await createRetroRoomMutation.mutateAsync({
          title: data.teamName,
        });
        navigate('/');
      }

      if (data.teamOption === 'join' && data.inviteLink) {
        await joinRetroRoomMutation.mutateAsync({
          inviteUrl: data.inviteLink,
        });
        navigate('/');
      }
    } catch (error) {
      // @todo: 에러 처리
      console.error(
        `Failed to signup: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  };

  return (
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
      <MultiStepForm.Step fields={['nickname']}>
        <NicknameStep />
      </MultiStepForm.Step>
      <MultiStepForm.Step fields={['teamOption']}>
        <TeamStep />
      </MultiStepForm.Step>
      <MultiStepForm.Step fields={['teamName', 'inviteLink']}>
        <TeamActionStep />
      </MultiStepForm.Step>
    </MultiStepForm>
  );
}
