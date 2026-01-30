import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { Toaster } from "@/components/ui/sonner";
import { ErrorBoundary } from "@/components/errors/ErrorBoundary";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { OrganizationSchema, WebSiteSchema } from "@/components/seo/StructuredData";
import { locales, type Locale } from "@/i18n/config";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = await getMessages({ locale });
  const metadata = messages.metadata as Record<string, string>;

  return {
    title: {
      default: metadata?.title || "Gold Price",
      template: "%s | Gold Price",
    },
    description: metadata?.description,
    keywords: metadata?.keywords,
    authors: [{ name: "Gold Price Team" }],
    creator: "Gold Price",
    openGraph: {
      type: "website",
      locale: locale === "vi" ? "vi_VN" : "en_US",
      siteName: "Gold Price",
      title: metadata?.title,
      description: metadata?.description,
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: "Gold Price",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: metadata?.title,
      description: metadata?.description,
      images: ["/og-image.png"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  // Validate locale
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Get messages for the current locale
  const messages = await getMessages();
  const a11y = messages.a11y as Record<string, string>;

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="font-sans antialiased">
        {/* A11y: Skip to main content */}
        <a href="#main-content" className="skip-link">
          {a11y?.skipToContent || "Skip to main content"}
        </a>

        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            disableTransitionOnChange
          >
            <OrganizationSchema />
            <WebSiteSchema />
            <ErrorBoundary>{children}</ErrorBoundary>
            <Toaster />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
