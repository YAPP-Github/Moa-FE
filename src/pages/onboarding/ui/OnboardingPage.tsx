import { OnboardingForm } from '@/features/auth/ui/forms/OnboardingForm';
import { useCreateRetroRoom, useJoinRetroRoom } from '@/features/team/api/team.mutations';
import { OnboardingHeader } from '@/widgets/header/ui/OnboardingHeader';

export function OnboardingPage() {
  const { mutateAsync: createRetroRoom } = useCreateRetroRoom();
  const { mutateAsync: joinRetroRoom } = useJoinRetroRoom();

  return (
    <div className="h-screen bg-grey-50 flex flex-col">
      <OnboardingHeader />
      <main className="flex-1 overflow-y-auto">
        <div className="flex min-h-full flex-col items-center py-4">
          <div className="my-auto w-[720px] bg-white rounded-2xl flex items-center justify-center py-[130px]">
            <OnboardingForm
              onCreateTeam={(title) => createRetroRoom({ title })}
              onJoinTeam={(inviteUrl) => joinRetroRoom({ inviteUrl })}
            />
          </div>
        </div>
      </main>
      <div className="h-[54px] shrink-0 bg-grey-50" />
    </div>
  );
}
