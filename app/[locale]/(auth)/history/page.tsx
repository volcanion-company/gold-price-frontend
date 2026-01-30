'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { HistoryLoginPrompt } from '@/components/auth/HistoryLoginPrompt';
import { PriceHistoryChart } from '@/components/prices/PriceHistoryChart';
import { PriceHistoryTable } from '@/components/prices/PriceHistoryTable';
import { PeriodSelector } from '@/components/prices/PeriodSelector';
import { usePriceHistory, Period } from '@/lib/hooks/usePriceHistory';
import { useGoldCodes } from '@/lib/hooks/useGoldCodes';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ErrorMessage } from '@/components/ui/error-message';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { formatPrice, formatChange } from '@/lib/utils/formatters';
import { PageShell, PageHeader } from '@/components/layout/PageShell';

export default function HistoryPage() {
  const t = useTranslations();
  const { codes: goldCodes, isLoading: isLoadingCodes, error: codesError } = useGoldCodes();
  const [selectedCode, setSelectedCode] = useState<string>('');
  const [period, setPeriod] = useState<Period>('30d');
  
  // Get available gold codes (exclude XAUUSD for history)
  const availableGoldCodes = goldCodes.filter(p => p.code !== 'XAUUSD');
  
  // Set default selected code when gold codes are loaded
  useEffect(() => {
    if (availableGoldCodes.length > 0 && !selectedCode) {
      // Select first VND gold or first available
      const defaultCode = availableGoldCodes.find(p => p.currency === 'VND')?.code || availableGoldCodes[0]?.code;
      if (defaultCode) {
        setSelectedCode(defaultCode);
      }
    }
  }, [availableGoldCodes, selectedCode]);

  // Only fetch history when we have a valid selected code
  const { data, isLoading: isLoadingHistory, error: historyError, refetch } = usePriceHistory(selectedCode, period);
  
  // Combined loading and error states
  const isLoading = isLoadingCodes || isLoadingHistory;
  const error = codesError || historyError;

  // Calculate statistics
  const stats = data && data.length > 0 ? {
    highest: Math.max(...data.map(d => d.buy)),
    lowest: Math.min(...data.map(d => d.buy)),
    average: data.reduce((sum, d) => sum + d.buy, 0) / data.length,
    change: data[data.length - 1]?.buy - data[0]?.buy || 0,
  } : null;

  const handleExportCSV = () => {
    if (!data || data.length === 0) return;

    const csv = [
      [t('history.table.date'), t('prices.buy'), t('prices.sell'), t('prices.change')].join(','),
      ...data.map(item => [
        item.date,
        item.buy,
        item.sell,
        item.sell - item.buy,
      ].join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `history-${selectedCode}-${period}.csv`;
    link.click();
  };

  return (
    <AuthGuard fallback={<HistoryLoginPrompt />}>
      <PageShell>
        <div className="space-y-6">
          {/* Header with filters */}
          <PageHeader
            title={t('history.title')}
            description={t('history.description')}
            actions={
              <div className="flex flex-col sm:flex-row gap-4">
                <Select value={selectedCode} onValueChange={setSelectedCode}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder={t('history.selectGold')} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableGoldCodes.map((price) => (
                      <SelectItem key={price.code} value={price.code}>
                        {price.name} ({price.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <PeriodSelector value={period} onChange={setPeriod} />
              </div>
            }
          />

          {/* Loading State - waiting for prices or history data */}
          {(availableGoldCodes.length === 0 || !selectedCode || isLoading) && (
            <div className="flex items-center justify-center min-h-[400px]">
              <LoadingSpinner size="lg" text={t('common.loading')} />
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && selectedCode && (
            <ErrorMessage
              message={error.message}
              onRetry={refetch}
              className="min-h-[400px]"
            />
          )}

          {/* Empty State */}
          {data && data.length === 0 && !isLoading && !error && (
            <Card className="min-h-[400px] flex items-center justify-center">
              <CardContent className="text-center py-12">
                <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">{t('common.noData')}</h3>
                <p className="text-muted-foreground max-w-md">
                  {t('history.description')}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Statistics Cards */}
          {stats && !isLoading && !error && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <Card className="py-1.5 gap-0.5">
                <CardHeader className="flex flex-row items-center justify-between px-3 py-0.5">
                  <CardTitle className="text-[11px] font-medium">{t('history.stats.highest')}</CardTitle>
                  <TrendingUp className="h-3 w-3 text-green-600" />
                </CardHeader>
                <CardContent className="px-3 pt-0 pb-1">
                  <div className="text-base font-bold">₫{formatPrice(stats.highest)}</div>
                </CardContent>
              </Card>

              <Card className="py-1.5 gap-0.5">
                <CardHeader className="flex flex-row items-center justify-between px-3 py-0.5">
                  <CardTitle className="text-[11px] font-medium">{t('history.stats.lowest')}</CardTitle>
                  <TrendingDown className="h-3 w-3 text-red-600" />
                </CardHeader>
                <CardContent className="px-3 pt-0 pb-1">
                  <div className="text-base font-bold">₫{formatPrice(stats.lowest)}</div>
                </CardContent>
              </Card>

              <Card className="py-1.5 gap-0.5">
                <CardHeader className="flex flex-row items-center justify-between px-3 py-0.5">
                  <CardTitle className="text-[11px] font-medium">{t('history.stats.average')}</CardTitle>
                  <Activity className="h-3 w-3 text-blue-600" />
                </CardHeader>
                <CardContent className="px-3 pt-0 pb-1">
                  <div className="text-base font-bold">₫{formatPrice(stats.average)}</div>
                </CardContent>
              </Card>

              <Card className="py-1.5 gap-0.5">
                <CardHeader className="flex flex-row items-center justify-between px-3 py-0.5">
                  <CardTitle className="text-[11px] font-medium">{t('history.stats.change')}</CardTitle>
                  <Activity className={`h-3 w-3 ${stats.change >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                </CardHeader>
                <CardContent className="px-3 pt-0 pb-1">
                  <div className={`text-base font-bold ${stats.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatChange(stats.change)}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Chart and Table */}
          {data && !isLoading && !error && (
            <Tabs defaultValue="chart" className="w-full">
              <TabsList>
                <TabsTrigger value="chart">{t('history.chart.title')}</TabsTrigger>
                <TabsTrigger value="table">{t('history.table.title')}</TabsTrigger>
              </TabsList>

              <TabsContent value="chart" className="mt-6">
                <PriceHistoryChart
                  data={data}
                  title={`${t('history.chart.title')} ${goldCodes.find(p => p.code === selectedCode)?.name || selectedCode}`}
                />
              </TabsContent>

              <TabsContent value="table" className="mt-6">
                <PriceHistoryTable
                  data={data}
                  goldName={goldCodes.find(p => p.code === selectedCode)?.name}
                  onExport={handleExportCSV}
                />
              </TabsContent>
            </Tabs>
          )}
        </div>
      </PageShell>
    </AuthGuard>
  );
}
