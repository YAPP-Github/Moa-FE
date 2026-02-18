import IcMoa from '@/shared/ui/logos/IcMoa';

interface OnboardingHeaderProps {
  className?: string;
}

export function OnboardingHeader({ className }: OnboardingHeaderProps) {
  return (
    <header className={`h-[54px] bg-transparent flex items-center px-[36px] ${className ?? ''}`}>
      <IcMoa />
    </header>
  );
}
