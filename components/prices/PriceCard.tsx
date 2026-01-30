'use client';

import { useEffect, useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Price } from '@/types';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatPrice, formatChange, formatTime } from '@/lib/utils/formatters';
import { TrendingUp, TrendingDown, Circle } from 'lucide-react';

interface PriceCardProps {
  price: Price;
  onClick?: () => void;
  highlight?: boolean;
  isConnected?: boolean;
}

export function PriceCard({ price, onClick, highlight, isConnected = true }: PriceCardProps) {
  const t = useTranslations('prices');
  const isBuyPositive = price.changeBuy >= 0;
  const isSellPositive = price.changeSell >= 0;
  
  // Track previous prices to detect changes
  const prevPriceRef = useRef<{ buy: number; sell: number } | null>(null);
  const [buyFlash, setBuyFlash] = useState(false);
  const [sellFlash, setSellFlash] = useState(false);

  useEffect(() => {
    if (!highlight) return;
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    if (prevPriceRef.current) {
      if (prevPriceRef.current.buy !== price.buy) {
        setBuyFlash(true);
        setTimeout(() => setBuyFlash(false), 200);
      }
      if (prevPriceRef.current.sell !== price.sell) {
        setSellFlash(true);
        setTimeout(() => setSellFlash(false), 200);
      }
    }
    prevPriceRef.current = { buy: price.buy, sell: price.sell };
  }, [price.buy, price.sell, highlight]);

  return (
    <Card
      className="cursor-pointer transition-all hover:shadow-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 py-2 gap-1"
      onClick={onClick}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? 'button' : undefined}
      aria-label={`${price.name}: ${t('buy')} ${formatPrice(price.buy)}, ${t('sell')} ${formatPrice(price.sell)}, ${isBuyPositive ? t('up') : t('down')} ${formatChange(price.changeBuy)}`}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } } : undefined}
    >
      <CardHeader className="px-3 py-1">
        <div className="flex items-start justify-between">
          <CardTitle className="text-sm">{price.name}</CardTitle>
          <Badge variant={isBuyPositive ? 'default' : 'destructive'} className="ml-1 text-[10px] px-1.5 py-0">
            {formatChange(price.changeBuy)}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">{t('code')}: {price.code}</p>
      </CardHeader>

      <CardContent className="space-y-2 px-3 py-0">
        <div className={`p-2 bg-green-50 dark:bg-green-950 rounded-md transition-colors duration-200 ${
          buyFlash ? 'bg-yellow-200 dark:bg-yellow-800' : ''
        }`}>
          <div className="flex items-center gap-1.5 mb-0.5">
            <TrendingUp className="h-3 w-3 text-green-600" />
            <span className="text-xs font-medium text-green-700 dark:text-green-300">
              {t('buy')}
            </span>
          </div>
          <div className="text-sm font-bold text-green-700 dark:text-green-300">
            ₫{formatPrice(price.buy)}
          </div>
        </div>

        <div className={`p-2 bg-red-50 dark:bg-red-950 rounded-md transition-colors duration-200 ${
          sellFlash ? 'bg-yellow-200 dark:bg-yellow-800' : ''
        }`}>
          <div className="flex items-center gap-1.5 mb-0.5">
            <TrendingDown className="h-3 w-3 text-red-600" />
            <span className="text-xs font-medium text-red-700 dark:text-red-300">
              {t('sell')}
            </span>
          </div>
          <div className="text-sm font-bold text-red-700 dark:text-red-300">
            ₫{formatPrice(price.sell)}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">{t('changeSell')}:</span>
          <span
            className={`font-semibold ${
              isSellPositive ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {formatChange(price.changeSell)}
          </span>
        </div>
      </CardContent>

      <CardFooter className="py-1 border-t">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-1" aria-live="polite">
            <Circle 
              className={`h-1.5 w-1.5 ${
                isConnected 
                  ? 'fill-green-500 text-green-500 motion-safe:animate-pulse' 
                  : 'fill-gray-400 text-gray-400'
              }`}
              aria-hidden="true"
            />
            <span className="text-[10px] text-muted-foreground">
              {isConnected ? t('live') : t('offline')}
            </span>
          </div>
          <span className="text-[10px] text-muted-foreground" aria-label={t('updatedAt', { time: formatTime(price.updatedAt) })}>
            {formatTime(price.updatedAt)}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
