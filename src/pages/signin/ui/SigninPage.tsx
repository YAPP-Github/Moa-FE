import { SigninForm } from '@/features/auth/ui/forms/SigninForm';
import { OnboardingHeader } from '@/widgets/header/ui/OnboardingHeader';

export function SigninPage() {
  return (
    <div className="h-screen bg-grey-50 flex flex-col">
      <OnboardingHeader />
      <main className="flex-1 flex flex-col overflow-y-auto">
        <div className="flex-1 flex flex-col items-center py-4">
          <div className="flex-1 w-full max-w-[720px] bg-white rounded-2xl flex items-center justify-center">
            <SigninForm />
          </div>
        </div>
      </main>
      <div className="h-[54px] shrink-0 bg-grey-50" />
    </div>
  );
}
