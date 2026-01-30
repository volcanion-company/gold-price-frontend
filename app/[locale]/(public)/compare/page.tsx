'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { usePricesStore } from '@/lib/store/pricesStore';
import { PriceCard } from '@/components/prices/PriceCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatPrice, formatChange } from '@/lib/utils/formatters';
import { ArrowUpDown, TrendingUp, TrendingDown, Search } from 'lucide-react';
import { Price } from '@/types';
import { PageShell, PageHeader } from '@/components/layout/PageShell';
import { Input } from '@/components/ui/input';

export default function ComparePage() {
  const t = useTranslations();
  const { prices } = usePricesStore();
  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'buy' | 'sell' | 'change'>('buy');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter out world gold prices (XAUUSD) and apply search query
  const filteredPrices = useMemo(() => {
    const vndPrices = prices.filter(p => p.code !== 'XAUUSD');
    if (!searchQuery.trim()) return vndPrices;
    const query = searchQuery.toLowerCase();
    return vndPrices.filter(
      price => 
        price.code.toLowerCase().includes(query) ||
        price.name.toLowerCase().includes(query)
    );
  }, [prices, searchQuery]);

  // Get selected prices
  const selectedPrices = useMemo(() => {
    return prices.filter(price => selectedCodes.includes(price.code));
  }, [prices, selectedCodes]);

  // Calculate comparison statistics
  const comparisonStats = useMemo(() => {
    if (selectedPrices.length === 0) return null;

    const buyPrices = selectedPrices.map(p => p.buy);
    const sellPrices = selectedPrices.map(p => p.sell);

    const highestBuy = Math.max(...buyPrices);
    const lowestBuy = Math.min(...buyPrices);
    const highestSell = Math.max(...sellPrices);
    const lowestSell = Math.min(...sellPrices);

    return {
      highestBuy: selectedPrices.find(p => p.buy === highestBuy),
      lowestBuy: selectedPrices.find(p => p.buy === lowestBuy),
      highestSell: selectedPrices.find(p => p.sell === highestSell),
      lowestSell: selectedPrices.find(p => p.sell === lowestSell),
      avgBuy: buyPrices.reduce((a, b) => a + b, 0) / buyPrices.length,
      avgSell: sellPrices.reduce((a, b) => a + b, 0) / sellPrices.length,
      maxSpread: Math.max(...selectedPrices.map(p => p.sell - p.buy)),
      minSpread: Math.min(...selectedPrices.map(p => p.sell - p.buy)),
    };
  }, [selectedPrices]);

  // Sort selected prices
  const sortedPrices = useMemo(() => {
    if (selectedPrices.length === 0) return [];

    return [...selectedPrices].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'buy':
          comparison = a.buy - b.buy;
          break;
        case 'sell':
          comparison = a.sell - b.sell;
          break;
        case 'change':
          comparison = (a.changeBuy || 0) - (b.changeBuy || 0);
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [selectedPrices, sortBy, sortOrder]);

  const togglePrice = (code: string) => {
    setSelectedCodes(prev =>
      prev.includes(code)
        ? prev.filter(c => c !== code)
        : [...prev, code]
    );
  };

  const toggleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const clearSelection = () => {
    setSelectedCodes([]);
  };

  const selectAll = () => {
    setSelectedCodes(filteredPrices.map(p => p.code));
  };

  const isAllSelected = filteredPrices.length > 0 && 
    filteredPrices.every(p => selectedCodes.includes(p.code));

  return (
    <PageShell>
      <div className="space-y-6">
        <PageHeader
          title={t('compare.title')}
          description={t('compare.description')}
        />

        {/* Selection Panel */}
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle>{t('compare.selectToCompare')}</CardTitle>
              <div className="flex items-center gap-2">
                {isAllSelected ? (
                  <Button variant="outline" size="sm" onClick={clearSelection}>
                    {t('compare.clearAll')}
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" onClick={selectAll}>
                    {t('common.viewAll')} ({filteredPrices.length})
                  </Button>
                )}
                {selectedCodes.length > 0 && (
                  <Badge variant="secondary">
                    {t('compare.selected')}: {selectedCodes.length}
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('compare.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {filteredPrices.map((price) => (
                <div
                  key={price.code}
                  className={`flex items-center space-x-2 p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedCodes.includes(price.code)
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => togglePrice(price.code)}
                >
                  <Checkbox
                    checked={selectedCodes.includes(price.code)}
                    onCheckedChange={() => {}}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <label className="flex-1 cursor-pointer">
                    <div className="font-semibold text-sm">{price.code}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {price.name}
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Comparison Results */}
        {selectedPrices.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-muted-foreground text-center">
                <p className="text-lg font-semibold mb-2">
                  {t('compare.noSelection')}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : selectedPrices.length === 1 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center text-muted-foreground">
                <p className="text-lg font-semibold mb-2">
                  {t('compare.selected')}: 1
                </p>
                <p className="text-sm">
                  {t('compare.noSelection')}
                </p>
              </div>
              <div className="mt-6 max-w-sm mx-auto">
                <PriceCard price={selectedPrices[0]} />
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Statistics Cards */}
            {comparisonStats && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <Card className="py-1.5 gap-0.5">
                  <CardHeader className="flex flex-row items-center justify-between px-3 py-0.5">
                    <CardTitle className="text-[11px] font-medium">
                      {t('compare.stats.highestBuy')}
                    </CardTitle>
                    <TrendingUp className="h-3 w-3 text-green-600" />
                  </CardHeader>
                  <CardContent className="px-3 pt-0 pb-1">
                    <div className="text-base font-bold">
                      ₫{formatPrice(comparisonStats.highestBuy?.buy || 0)}
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      {comparisonStats.highestBuy?.name}
                    </p>
                  </CardContent>
                </Card>

                <Card className="py-1.5 gap-0.5">
                  <CardHeader className="flex flex-row items-center justify-between px-3 py-0.5">
                    <CardTitle className="text-[11px] font-medium">
                      {t('compare.stats.lowestBuy')}
                    </CardTitle>
                    <TrendingDown className="h-3 w-3 text-red-600" />
                  </CardHeader>
                  <CardContent className="px-3 pt-0 pb-1">
                    <div className="text-base font-bold">
                      ₫{formatPrice(comparisonStats.lowestBuy?.buy || 0)}
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      {comparisonStats.lowestBuy?.name}
                    </p>
                  </CardContent>
                </Card>

                <Card className="py-1.5 gap-0.5">
                  <CardHeader className="flex flex-row items-center justify-between px-3 py-0.5">
                    <CardTitle className="text-[11px] font-medium">
                      {t('compare.stats.avgBuy')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-3 pt-0 pb-1">
                    <div className="text-base font-bold">
                      ₫{formatPrice(comparisonStats.avgBuy)}
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      {selectedPrices.length} {t('home.types')}
                    </p>
                  </CardContent>
                </Card>

                <Card className="py-1.5 gap-0.5">
                  <CardHeader className="flex flex-row items-center justify-between px-3 py-0.5">
                    <CardTitle className="text-[11px] font-medium">
                      {t('compare.stats.avgSell')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-3 pt-0 pb-1">
                    <div className="text-base font-bold">
                      ₫{formatPrice(comparisonStats.avgSell)}
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      {selectedPrices.length} {t('home.types')}
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Comparison Table */}
            <Card className="py-3 gap-2">
              <CardHeader className="px-3 py-1">
                <CardTitle className="text-sm">{t('history.table.title')}</CardTitle>
              </CardHeader>
              <CardContent className="px-3 py-0">
                <div className="border rounded-lg overflow-hidden">
                  <Table className="text-xs">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="py-1.5 px-2">{t('prices.name')}</TableHead>
                        <TableHead className="text-center py-1.5 px-2" colSpan={2}>
                          <div className="flex justify-center gap-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="gap-1 h-6 text-xs px-1"
                              onClick={() => toggleSort('buy')}
                            >
                              {t('prices.buy')}
                              <ArrowUpDown className="h-2.5 w-2.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="gap-1 h-6 text-xs px-1"
                              onClick={() => toggleSort('sell')}
                            >
                              {t('prices.sell')}
                              <ArrowUpDown className="h-2.5 w-2.5" />
                            </Button>
                          </div>
                        </TableHead>
                        <TableHead className="text-right py-1.5 px-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1 h-6 text-xs px-1"
                            onClick={() => toggleSort('change')}
                          >
                            {t('prices.change')}
                            <ArrowUpDown className="h-2.5 w-2.5" />
                          </Button>
                        </TableHead>
                        <TableHead className="text-right py-1.5 px-2">{t('prices.spread')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedPrices.map((price) => {
                        const spread = price.sell - price.buy;

                        return (
                          <TableRow key={price.code}>
                            <TableCell className="py-1.5 px-2">
                              <div className="font-semibold text-xs">{price.code}</div>
                              <div className="text-[10px] text-muted-foreground">
                                {price.name}
                              </div>
                            </TableCell>
                            <TableCell className="py-1.5 px-2" colSpan={2}>
                              <div className="flex justify-center gap-6">
                                <div className="text-center">
                                  <div className="font-semibold">₫{formatPrice(price.buy)}</div>
                                </div>
                                <div className="text-center">
                                  <div className="font-semibold">₫{formatPrice(price.sell)}</div>
                                </div>
                              </div>
                              {comparisonStats?.highestBuy?.code === price.code && (
                                <div className="text-center mt-1">
                                  <Badge variant="default" className="text-[10px] px-1 py-0">
                                    {t('history.stats.highest')}
                                  </Badge>
                                </div>
                              )}
                              {comparisonStats?.lowestBuy?.code === price.code && (
                                <div className="text-center mt-1">
                                  <Badge variant="secondary" className="text-[10px] px-1 py-0">
                                    {t('history.stats.lowest')}
                                  </Badge>
                                </div>
                              )}
                            </TableCell>
                            <TableCell className="text-right py-1.5 px-2">
                              {price.changeBuy !== undefined && (
                                <Badge
                                  variant={
                                    price.changeBuy >= 0 ? 'default' : 'destructive'
                                  }
                                  className="text-[10px] px-1 py-0"
                                >
                                  {formatChange(price.changeBuy)}
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right text-muted-foreground py-1.5 px-2">
                              ₫{formatPrice(spread)}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Price Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {selectedPrices.map((price) => (
                <PriceCard key={price.code} price={price} />
              ))}
            </div>
          </>
        )}
      </div>
    </PageShell>
  );
}
