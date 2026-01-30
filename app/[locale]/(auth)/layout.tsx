'use client';

import { Header } from '@/components/layout/Header';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { HistoryLoginPrompt } from '@/components/auth/HistoryLoginPrompt';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main id="main-content" tabIndex={-1}>
        <AuthGuard fallback={<HistoryLoginPrompt />}>
          {children}
        </AuthGuard>
      </main>
    </>
  );
}
