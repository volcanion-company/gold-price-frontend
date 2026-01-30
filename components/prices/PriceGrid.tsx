'use client';

import { Price } from '@/types';
import { PriceCard } from './PriceCard';
import { PriceCardSkeleton } from '@/components/ui/skeletons';

interface PriceGridProps {
  prices: Price[];
  onPriceClick?: (code: string) => void;
  highlightChanges?: boolean;
  isLoading?: boolean;
  isConnected?: boolean;
}

export function PriceGrid({
  prices,
  onPriceClick,
  highlightChanges = true,
  isLoading = false,
  isConnected = true,
}: PriceGridProps) {
  // Show skeleton while loading
  if (isLoading || prices.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <PriceCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {prices.map((price) => (
        <PriceCard
          key={price.code}
          price={price}
          onClick={() => onPriceClick?.(price.code)}
          highlight={highlightChanges}
          isConnected={isConnected}
        />
      ))}
    </div>
  );
}
