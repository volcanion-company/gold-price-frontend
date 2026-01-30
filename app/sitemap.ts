import { MetadataRoute } from 'next';
import { locales, defaultLocale } from '@/i18n/config';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001';

  // Public pages that should be indexed
  const publicRoutes = [
    { path: '', changeFrequency: 'always' as const, priority: 1 },
    { path: '/compare', changeFrequency: 'always' as const, priority: 0.9 },
  ];

  // Auth pages (lower priority)
  const authRoutes = [
    { path: '/auth/login', changeFrequency: 'monthly' as const, priority: 0.3 },
    { path: '/auth/register', changeFrequency: 'monthly' as const, priority: 0.3 },
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Generate entries for each locale
  locales.forEach((locale) => {
    const localePrefix = locale === defaultLocale ? '' : `/${locale}`;

    // Public routes with locale
    publicRoutes.forEach((route) => {
      sitemapEntries.push({
        url: `${baseUrl}${localePrefix}${route.path}`,
        lastModified: new Date(),
        changeFrequency: route.changeFrequency,
        priority: route.priority,
        alternates: {
          languages: Object.fromEntries(
            locales.map((loc) => [
              loc,
              `${baseUrl}${loc === defaultLocale ? '' : `/${loc}`}${route.path}`,
            ])
          ),
        },
      });
    });

    // Auth routes (only for default locale to avoid duplicate)
    if (locale === defaultLocale) {
      authRoutes.forEach((route) => {
        sitemapEntries.push({
          url: `${baseUrl}${route.path}`,
          lastModified: new Date(),
          changeFrequency: route.changeFrequency,
          priority: route.priority,
        });
      });
    }
  });

  return sitemapEntries;
}
