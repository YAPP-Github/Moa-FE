import { OnboardingForm } from '@/features/auth/ui/forms/OnboardingForm';
import { OnboardingHeader } from '@/widgets/header/ui/OnboardingHeader';

export function OnboardingPage() {
  return (
    <div className="min-h-screen bg-grey-50 flex flex-col">
      <OnboardingHeader />
      <main className="flex items-center justify-center flex-1 -mt-[54px]">
        <div className="w-[720px] h-[792px] bg-white rounded-2xl flex items-center justify-center">
          <OnboardingForm />
        </div>
      </main>
    </div>
  );
}
