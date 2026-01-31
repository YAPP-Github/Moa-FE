import type { ReactNode } from 'react';
import { Header } from '@/widgets/header/ui/Header';

interface BaseLayoutProps {
  children: ReactNode;
}

export function BaseLayout({ children }: BaseLayoutProps) {
  return (
    <div className="min-h-screen bg-[#FFFFFF]">
      <Header />
      <div className="h-[calc(100vh-54px)]">{children}</div>
    </div>
  );
}
