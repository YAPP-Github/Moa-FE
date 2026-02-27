import IcLogoMain from '@/shared/ui/icons/IcLogoMain';

interface OnboardingHeaderProps {
  className?: string;
}

export function OnboardingHeader({ className }: OnboardingHeaderProps) {
  return (
    <header className={`h-[54px] bg-transparent flex items-center px-[36px] ${className ?? ''}`}>
      <IcLogoMain />
    </header>
  );
}
