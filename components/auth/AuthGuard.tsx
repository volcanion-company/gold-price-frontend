'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export function AuthGuard({ 
  children, 
  fallback, 
  redirectTo = '/auth/login' 
}: AuthGuardProps) {
  const t = useTranslations('auth.guard');
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Store intended destination for redirect after login
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
      }
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">{t('checking')}</p>
        </div>
      </div>
    );
  }

  // Show fallback or redirect
  if (!isAuthenticated) {
    return fallback || null;
  }

  // Render protected content
  return <>{children}</>;
}
