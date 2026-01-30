import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('profile');

  return {
    title: t('title'),
    description: t('description'),
    robots: {
      index: false,
      follow: false,
    },
    openGraph: {
      title: `${t('title')} | Gold Price`,
      description: t('description'),
    },
  };
}

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
