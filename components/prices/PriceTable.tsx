'use client';

import { useMemo, useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Price } from '@/types';
import { formatPrice, formatChange, formatTime } from '@/lib/utils/formatters';
import { TrendingUp, TrendingDown, Minus, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PriceTableProps {
  prices: Price[];
  onPriceClick?: (code: string) => void;
  highlightChanges?: boolean;
  isConnected?: boolean;
  compact?: boolean;
}

function TrendIcon({ change }: { change: number }) {
  if (change > 0) return <TrendingUp className="h-3 w-3 text-green-600" />;
  if (change < 0) return <TrendingDown className="h-3 w-3 text-red-600" />;
  return <Minus className="h-3 w-3 text-muted-foreground" />;
}

function TrendBadge({ change, compact = false }: { change: number; compact?: boolean }) {
  const isPositive = change > 0;
  const isNegative = change < 0;
  
  return (
    <span
      className={cn(
        'inline-flex items-center gap-0.5 font-medium',
        compact ? 'text-xs' : 'text-sm',
        isPositive && 'text-green-600 dark:text-green-500',
        isNegative && 'text-red-600 dark:text-red-500',
        !isPositive && !isNegative && 'text-muted-foreground'
      )}
    >
      {isPositive && '↑'}
      {isNegative && '↓'}
      {formatChange(change)}
    </span>
  );
}

export function PriceTable({
  prices,
  onPriceClick,
  highlightChanges = true,
  isConnected = true,
  compact = false,
}: PriceTableProps) {
  const t = useTranslations('prices');
  
  // Track previous prices for flash animation
  const prevPricesRef = useRef<Map<string, { buy: number; sell: number }>>(new Map());
  const [flashRows, setFlashRows] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!highlightChanges) return;
    
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const newFlashes = new Set<string>();
    
    prices.forEach(price => {
      const prev = prevPricesRef.current.get(price.code);
      if (prev && (prev.buy !== price.buy || prev.sell !== price.sell)) {
        newFlashes.add(price.code);
      }
      prevPricesRef.current.set(price.code, { buy: price.buy, sell: price.sell });
    });

    if (newFlashes.size > 0) {
      setFlashRows(newFlashes);
      setTimeout(() => setFlashRows(new Set()), 300);
    }
  }, [prices, highlightChanges]);

  // Group prices by source for better organization
  const groupedPrices = useMemo(() => {
    const groups: { [key: string]: Price[] } = {};
    prices.forEach(price => {
      const source = price.source || t('other');
      if (!groups[source]) groups[source] = [];
      groups[source].push(price);
    });
    return groups;
  }, [prices, t]);

  if (prices.length === 0) {
    return (
      <div className="bg-card rounded-lg border p-8 text-center">
        <p className="text-muted-foreground">{t('noData')}</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border overflow-hidden">
      {/* Table Header */}
      <div className={cn(
        'grid bg-muted/50 border-b font-medium text-muted-foreground',
        compact 
          ? 'grid-cols-[1fr_auto_auto] gap-2 px-3 py-2 text-xs'
          : 'grid-cols-[1fr_1fr_1fr_auto] gap-4 px-4 py-3 text-sm'
      )}>
        <div>{t('name')}</div>
        <div className="text-right">{t('buy')}</div>
        <div className="text-right">{t('sell')}</div>
        {!compact && <div className="text-right w-16">{t('updated')}</div>}
      </div>

      {/* Table Body */}
      <div className="divide-y">
        {Object.entries(groupedPrices).map(([provider, providerPrices]) => (
          <div key={provider}>
            {/* Provider Header - only show if multiple providers */}
            {Object.keys(groupedPrices).length > 1 && (
              <div className="bg-muted/30 px-3 py-1.5 text-xs font-medium text-muted-foreground border-b">
                {provider}
              </div>
            )}
            
            {/* Price Rows */}
            {providerPrices.map((price) => (
              <div
                key={price.code}
                onClick={() => onPriceClick?.(price.code)}
                className={cn(
                  'grid transition-colors duration-200',
                  compact 
                    ? 'grid-cols-[1fr_auto_auto] gap-2 px-3 py-2'
                    : 'grid-cols-[1fr_1fr_1fr_auto] gap-4 px-4 py-3',
                  onPriceClick && 'cursor-pointer hover:bg-muted/50',
                  flashRows.has(price.code) && 'bg-yellow-100 dark:bg-yellow-900/30'
                )}
                role={onPriceClick ? 'button' : undefined}
                tabIndex={onPriceClick ? 0 : undefined}
                onKeyDown={onPriceClick ? (e) => { 
                  if (e.key === 'Enter' || e.key === ' ') { 
                    e.preventDefault(); 
                    onPriceClick(price.code); 
                  } 
                } : undefined}
              >
                {/* Name & Code */}
                <div className="min-w-0">
                  <div className={cn(
                    'font-medium truncate',
                    compact ? 'text-sm' : 'text-base'
                  )}>
                    {price.name}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span>{price.code}</span>
                    {compact && (
                      <>
                        <Circle 
                          className={cn(
                            'h-1.5 w-1.5',
                            isConnected 
                              ? 'fill-green-500 text-green-500' 
                              : 'fill-gray-400 text-gray-400'
                          )}
                        />
                        <span>{formatTime(price.updatedAt)}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Buy Price */}
                <div className="text-right">
                  <div className={cn(
                    'font-semibold text-green-700 dark:text-green-400',
                    compact ? 'text-sm' : 'text-base'
                  )}>
                    {formatPrice(price.buy)}
                  </div>
                  <TrendBadge change={price.changeBuy} compact />
                </div>

                {/* Sell Price */}
                <div className="text-right">
                  <div className={cn(
                    'font-semibold text-red-700 dark:text-red-400',
                    compact ? 'text-sm' : 'text-base'
                  )}>
                    {formatPrice(price.sell)}
                  </div>
                  <TrendBadge change={price.changeSell} compact />
                </div>

                {/* Update Time - Desktop only */}
                {!compact && (
                  <div className="text-right w-16 flex flex-col items-end justify-center">
                    <Circle 
                      className={cn(
                        'h-2 w-2 mb-1',
                        isConnected 
                          ? 'fill-green-500 text-green-500 animate-pulse' 
                          : 'fill-gray-400 text-gray-400'
                      )}
                    />
                    <span className="text-xs text-muted-foreground">
                      {formatTime(price.updatedAt)}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// Mobile-optimized skeleton
export function PriceTableSkeleton({ rows = 8, compact = false }: { rows?: number; compact?: boolean }) {
  return (
    <div className="bg-card rounded-lg border overflow-hidden">
      <div className={cn(
        'grid bg-muted/50 border-b',
        compact 
          ? 'grid-cols-[1fr_auto_auto] gap-2 px-3 py-2'
          : 'grid-cols-[1fr_1fr_1fr_auto] gap-4 px-4 py-3'
      )}>
        <div className="h-4 w-20 bg-muted rounded animate-pulse" />
        <div className="h-4 w-16 bg-muted rounded animate-pulse ml-auto" />
        <div className="h-4 w-16 bg-muted rounded animate-pulse ml-auto" />
        {!compact && <div className="h-4 w-12 bg-muted rounded animate-pulse ml-auto" />}
      </div>
      <div className="divide-y">
        {[...Array(rows)].map((_, i) => (
          <div 
            key={i} 
            className={cn(
              'grid',
              compact 
                ? 'grid-cols-[1fr_auto_auto] gap-2 px-3 py-2'
                : 'grid-cols-[1fr_1fr_1fr_auto] gap-4 px-4 py-3'
            )}
          >
            <div className="space-y-1">
              <div className="h-4 w-32 bg-muted rounded animate-pulse" />
              <div className="h-3 w-16 bg-muted rounded animate-pulse" />
            </div>
            <div className="space-y-1 flex flex-col items-end">
              <div className="h-4 w-20 bg-muted rounded animate-pulse" />
              <div className="h-3 w-12 bg-muted rounded animate-pulse" />
            </div>
            <div className="space-y-1 flex flex-col items-end">
              <div className="h-4 w-20 bg-muted rounded animate-pulse" />
              <div className="h-3 w-12 bg-muted rounded animate-pulse" />
            </div>
            {!compact && (
              <div className="flex flex-col items-end justify-center">
                <div className="h-2 w-2 bg-muted rounded-full animate-pulse mb-1" />
                <div className="h-3 w-10 bg-muted rounded animate-pulse" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
