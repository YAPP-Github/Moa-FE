import type { ReactNode } from 'react';
import { MainHeader } from '@/widgets/header/ui/MainHeader';

interface BaseLayoutProps {
  children: ReactNode;
}

export function BaseLayout({ children }: BaseLayoutProps) {
  return (
    <div className="min-h-screen bg-[#FFFFFF]">
      <MainHeader />
      <div className="h-[calc(100vh-54px)]">{children}</div>
    </div>
  );
}
