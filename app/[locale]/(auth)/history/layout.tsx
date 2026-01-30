import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('history');

  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: `${t('title')} | Gold Price`,
      description: t('description'),
    },
  };
}

export default function HistoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
