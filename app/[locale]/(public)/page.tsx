'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { PriceTable, PriceTableSkeleton } from '@/components/prices/PriceTable';
import { WorldGoldPrice } from '@/components/prices/WorldGoldPrice';
import { OfflineBanner } from '@/components/realtime/OfflineBanner';
import { useWebSocket } from '@/lib/hooks/useWebSocket';
import { usePricesStore } from '@/lib/store/pricesStore';
import { useAuthStore } from '@/lib/store/authStore';
import { useOnboarding, dashboardOnboardingSteps } from '@/components/onboarding/OnboardingTooltip';
import {
  TrendingUp,
  TrendingDown,
  Clock,
  ChevronRight,
  Sparkles,
  BarChart3,
  History,
  RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Home() {
  const t = useTranslations();
  const { prices } = usePricesStore();
  const { connected, requestPrices } = useWebSocket();
  const { isAuthenticated } = useAuthStore();
  const { startOnboarding } = useOnboarding();
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    requestPrices();
  }, [requestPrices]);

  useEffect(() => {
    if (prices.length > 0) {
      setLastUpdate(new Date());
      const timer = setTimeout(() => {
        startOnboarding(dashboardOnboardingSteps);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [prices.length, startOnboarding]);

  // Update lastUpdate when prices change
  useEffect(() => {
    if (prices.length > 0) {
      setLastUpdate(new Date());
    }
  }, [prices]);

  // Calculate statistics
  const stats = {
    total: prices.length,
    increasing: prices.filter((p) => p.changeBuy > 0).length,
    decreasing: prices.filter((p) => p.changeBuy < 0).length,
    unchanged: prices.filter((p) => p.changeBuy === 0).length,
  };

  const isLoading = prices.length === 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Compact Header */}
      <section className="border-b bg-card">
        <div className="container mx-auto px-3 py-4 md:px-4 md:py-6 max-w-4xl">
          <div className="flex items-center justify-between gap-4">
            {/* Title */}
            <h1 className="text-lg md:text-2xl font-bold whitespace-nowrap">{t('home.title')}</h1>

            {/* Last Update & Stats */}
            <div className="flex items-center gap-4 text-sm">
              {lastUpdate && (
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="h-4 w-4 hidden sm:block" />
                  <span className="text-xs md:text-sm">{lastUpdate.toLocaleTimeString()}</span>
                  <span className="hidden sm:inline">{lastUpdate.toLocaleDateString()}</span>
                </div>
              )}
              
              {/* Quick Stats */}
              <div className="hidden md:flex items-center gap-3 text-sm">
                <span className="flex items-center gap-1 text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  {stats.increasing}
                </span>
                <span className="flex items-center gap-1 text-red-600">
                  <TrendingDown className="h-4 w-4" />
                  {stats.decreasing}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-3 py-4 md:px-4 md:py-6 space-y-4 md:space-y-6 max-w-4xl">
        {/* Offline Banner */}
        <OfflineBanner 
          isConnected={connected} 
          onReconnect={requestPrices}
          lastUpdated={prices[0]?.updatedAt}
        />

        {/* World Gold Price */}
        <WorldGoldPrice isConnected={connected} />

        {/* Mobile Stats Bar */}
        <div className="flex md:hidden items-center justify-between bg-muted/50 rounded-lg p-3 text-sm">
          <span className="text-muted-foreground">{t('home.total')}: <strong>{stats.total}</strong> {t('home.types')}</span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-green-600">
              <TrendingUp className="h-3.5 w-3.5" />
              <strong>{stats.increasing}</strong>
            </span>
            <span className="flex items-center gap-1 text-red-600">
              <TrendingDown className="h-3.5 w-3.5" />
              <strong>{stats.decreasing}</strong>
            </span>
          </div>
        </div>

        {/* Price Table */}
        <div data-onboarding="price-grid">
          {/* Desktop View */}
          <div className="hidden md:block">
            {isLoading ? (
              <PriceTableSkeleton rows={10} />
            ) : (
              <PriceTable
                prices={prices.filter(p => !p.code.toLowerCase().includes('xau'))}
                highlightChanges
                isConnected={connected}
              />
            )}
          </div>

          {/* Mobile View - Compact */}
          <div className="md:hidden">
            {isLoading ? (
              <PriceTableSkeleton rows={8} compact />
            ) : (
              <PriceTable
                prices={prices.filter(p => !p.code.toLowerCase().includes('xau'))}
                highlightChanges
                isConnected={connected}
                compact
              />
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 md:hidden">
          <Button variant="outline" asChild className="h-12" data-onboarding="compare-link">
            <Link href="/compare" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              {t('home.comparePrice')}
            </Link>
          </Button>
          {isAuthenticated ? (
            <Button variant="outline" asChild className="h-12">
              <Link href="/history" className="flex items-center gap-2">
                <History className="h-4 w-4" />
                {t('home.viewHistory')}
              </Link>
            </Button>
          ) : (
            <Button asChild className="h-12 bg-gradient-to-r from-amber-500 to-amber-600">
              <Link href="/auth/login" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                {t('nav.login')}
              </Link>
            </Button>
          )}
        </div>

        {/* Desktop Actions Bar */}
        <div className="hidden md:flex items-center justify-between bg-muted/30 rounded-lg p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <RefreshCw className={cn(
              "h-4 w-4",
              connected && "animate-spin"
            )} style={{ animationDuration: '3s' }} />
            <span>{t('home.autoUpdate')}</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" asChild data-onboarding="compare-link">
              <Link href="/compare" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                {t('home.compareChart')}
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
            {!isAuthenticated && (
              <Button asChild className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700">
                <Link href="/auth/register" className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  {t('home.registerHistory')}
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="text-xs text-muted-foreground text-center py-2">
          {t('home.legend')}
        </div>
      </div>
    </div>
  );
}
