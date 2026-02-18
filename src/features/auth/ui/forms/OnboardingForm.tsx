import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router';
import { useSignupMutation } from '../../api/auth.mutations';
import { type SigninFormData, signinSchema } from '../../model/schema';
import { NicknameStep } from '../steps/NicknameStep';
import { TeamActionStep } from '../steps/TeamActionStep';
import { TeamStep } from '../steps/TeamStep';
import { MultiStepForm } from '@/shared/ui/multi-step-form/MultiStepForm';

interface OnboardingFormProps {
  onCreateTeam: (title: string) => Promise<unknown>;
  onJoinTeam: (inviteUrl: string) => Promise<unknown>;
}

export function OnboardingForm({ onCreateTeam, onJoinTeam }: OnboardingFormProps) {
  const navigate = useNavigate();
  const { mutateAsync: signup } = useSignupMutation();

  const handleSubmit = async (data: SigninFormData) => {
    await signup({ nickname: data.nickname });

    try {
      if (data.teamOption === 'create' && data.teamName) {
        await onCreateTeam(data.teamName);
      }

      if (data.teamOption === 'join' && data.inviteLink) {
        await onJoinTeam(data.inviteLink);
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
