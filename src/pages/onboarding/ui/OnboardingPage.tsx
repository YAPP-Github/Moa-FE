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
import { useToast } from '@/shared/ui/toast/Toast';

export function OnboardingPage() {
  const navigate = useNavigate();
  const { login, clearOnboarding } = useAuthStore();
  const { showToast } = useToast();
  const signupMutation = useSignup();
  const createRetroRoomMutation = useCreateRetroRoom();
  const joinRetroRoomMutation = useJoinRetroRoom();

  const handleSubmit = async (data: SigninFormData) => {
    try {
      // signupToken은 쿠키로 자동 전송됨
      await signupMutation.mutateAsync({
        nickname: data.nickname,
      });

      // 쿠키 기반 인증: 토큰은 쿠키로 전달됨
      login();
      clearOnboarding();

      if (data.teamOption === 'create' && data.teamName) {
        try {
          await createRetroRoomMutation.mutateAsync({
            title: data.teamName,
          });
          navigate('/');
        } catch {
          showToast({ variant: 'warning', message: '팀 생성에 실패했습니다.' });
        }
      }

      if (data.teamOption === 'join' && data.inviteLink) {
        try {
          await joinRetroRoomMutation.mutateAsync({
            inviteUrl: data.inviteLink,
          });
          navigate('/');
        } catch {
          showToast({
            variant: 'warning',
            message: '초대 링크가 유효하지 않습니다.',
          });
        }
      }
    } catch {
      showToast({ variant: 'warning', message: '회원가입에 실패했습니다.' });
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
