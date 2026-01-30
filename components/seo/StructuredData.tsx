'use client';

import Script from 'next/script';

const getBaseUrl = () => process.env.NEXT_PUBLIC_APP_URL || 'https://goldprice.vn';

interface OrganizationSchemaProps {
  name?: string;
  url?: string;
  logo?: string;
}

export function OrganizationSchema({
  name = 'Gold Price',
  url = getBaseUrl(),
  logo = `${getBaseUrl()}/logo.png`,
}: OrganizationSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url,
    logo,
    sameAs: [],
  };

  return (
    <Script
      id="organization-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface BreadcrumbSchemaProps {
  items: Array<{ name: string; url: string }>;
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <Script
      id="breadcrumb-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface PriceSchemaProps {
  name: string;
  description: string;
  price: number;
  priceCurrency?: string;
  availability?: string;
}

export function PriceSchema({
  name,
  description,
  price,
  priceCurrency = 'VND',
  availability = 'https://schema.org/InStock',
}: PriceSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    offers: {
      '@type': 'Offer',
      price: price.toString(),
      priceCurrency,
      availability,
      priceValidUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    },
  };

  return (
    <Script
      id={`price-schema-${name}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface WebSiteSchemaProps {
  name?: string;
  url?: string;
  description?: string;
}

export function WebSiteSchema({
  name = 'Gold Price',
  url = getBaseUrl(),
  description = 'Theo dõi giá vàng real-time, so sánh giá, xem lịch sử biến động',
}: WebSiteSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    url,
    description,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${url}/compare?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <Script
      id="website-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
