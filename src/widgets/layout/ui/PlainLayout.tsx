import type { ReactNode } from 'react';
import { BaseLayout } from './BaseLayout';

interface PlainLayoutProps {
  children: ReactNode;
}

export function PlainLayout({ children }: PlainLayoutProps) {
  return (
    <BaseLayout>
      <main className="h-full overflow-auto">{children}</main>
    </BaseLayout>
  );
}
