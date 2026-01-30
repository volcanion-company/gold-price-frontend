import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('compare');

  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: `${t('title')} | Gold Price`,
      description: t('description'),
    },
  };
}

export default function CompareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
