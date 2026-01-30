import { Header } from '@/components/layout/Header';
import { OnboardingProvider } from '@/components/onboarding/OnboardingTooltip';
import { setRequestLocale } from 'next-intl/server';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function PublicLayout({ children, params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <OnboardingProvider>
      <Header />
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
    </OnboardingProvider>
  );
}
