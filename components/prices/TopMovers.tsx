'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Price } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatPrice, formatChange } from '@/lib/utils/formatters';
import { TrendingUp, TrendingDown, Flame } from 'lucide-react';

interface TopMoversProps {
  prices: Price[];
  limit?: number;
}

export function TopMovers({ prices, limit = 3 }: TopMoversProps) {
  const t = useTranslations('prices');
  
  const { topGainers, topLosers } = useMemo(() => {
    const sorted = [...prices].sort((a, b) => b.changeBuy - a.changeBuy);
    
    return {
      topGainers: sorted.filter(p => p.changeBuy > 0).slice(0, limit),
      topLosers: sorted.filter(p => p.changeBuy < 0).slice(-limit).reverse(),
    };
  }, [prices, limit]);

  if (prices.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Top Gainers */}
      <Card className="border-green-200 dark:border-green-900">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            {t('topGainers')}
            <Flame className="h-4 w-4 text-orange-500" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {topGainers.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t('noGainers')}</p>
          ) : (
            topGainers.map((price, index) => (
              <div
                key={price.code}
                className="flex items-center justify-between p-2 rounded-lg bg-green-50 dark:bg-green-950/50"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-green-600 w-6">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-sm">{price.code}</p>
                    <p className="text-xs text-muted-foreground truncate max-w-[120px]">
                      {price.name}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">₫{formatPrice(price.buy)}</p>
                  <Badge variant="default" className="text-xs bg-green-600">
                    {formatChange(price.changeBuy)}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Top Losers */}
      <Card className="border-red-200 dark:border-red-900">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-red-600" />
            {t('topLosers')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {topLosers.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t('noLosers')}</p>
          ) : (
            topLosers.map((price, index) => (
              <div
                key={price.code}
                className="flex items-center justify-between p-2 rounded-lg bg-red-50 dark:bg-red-950/50"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-red-600 w-6">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-sm">{price.code}</p>
                    <p className="text-xs text-muted-foreground truncate max-w-[120px]">
                      {price.name}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">₫{formatPrice(price.buy)}</p>
                  <Badge variant="destructive" className="text-xs">
                    {formatChange(price.changeBuy)}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
