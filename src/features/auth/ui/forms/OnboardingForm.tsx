import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router';
import { useSignupMutation } from '@/features/auth/api/auth.mutations';
import { type SigninFormData, signinSchema } from '@/features/auth/model/schema';
import { NicknameStep } from '@/features/auth/ui/steps/NicknameStep';
import { TeamActionStep } from '@/features/auth/ui/steps/TeamActionStep';
import { TeamStep } from '@/features/auth/ui/steps/TeamStep';
import { useCreateRetroRoom, useJoinRetroRoom } from '@/features/team/api/team.mutations';
import { MultiStepForm } from '@/shared/ui/multi-step-form/MultiStepForm';

export function OnboardingForm() {
  const navigate = useNavigate();
  const { mutateAsync: signup } = useSignupMutation();
  const { mutateAsync: createRetroRoom } = useCreateRetroRoom();
  const { mutateAsync: joinRetroRoom } = useJoinRetroRoom();

  const handleSubmit = async (data: SigninFormData) => {
    await signup({ nickname: data.nickname });

    try {
      if (data.teamOption === 'create' && data.teamName) {
        await createRetroRoom({ title: data.teamName });
      }

      if (data.teamOption === 'join' && data.inviteLink) {
        await joinRetroRoom({ inviteUrl: data.inviteLink });
      }
    } catch {
      // 팀 생성/참여 실패 시에도 메인으로 이동 (토스트는 글로벌에서 처리)
    }

    navigate('/');
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
