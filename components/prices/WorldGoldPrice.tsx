'use client';

import { TrendingUp, TrendingDown, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WorldGoldPriceProps {
  xauPrice?: number;
  xauChange?: number;
  updatedAt?: string;
  isConnected?: boolean;
}

export function WorldGoldPrice({
  xauPrice = 2650.50,
  xauChange = 12.30,
  updatedAt,
  isConnected = true,
}: WorldGoldPriceProps) {
  const isPositive = xauChange >= 0;

  return (
    <div className="flex items-center justify-between bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-amber-500/10 border border-amber-200 dark:border-amber-800 rounded-lg px-3 py-2">
      <div className="flex items-center gap-2">
        <Globe className="h-4 w-4 text-amber-600 dark:text-amber-400" />
        <span className="text-sm font-medium">XAU/USD</span>
      </div>
      
      <div className="flex items-center gap-3">
        <span className="text-base md:text-lg font-bold text-amber-700 dark:text-amber-400">
          ${xauPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </span>
        <span className={cn(
          'flex items-center gap-0.5 text-sm font-medium',
          isPositive ? 'text-green-600' : 'text-red-600'
        )}>
          {isPositive ? (
            <TrendingUp className="h-3.5 w-3.5" />
          ) : (
            <TrendingDown className="h-3.5 w-3.5" />
          )}
          {isPositive ? '+' : ''}{xauChange.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
