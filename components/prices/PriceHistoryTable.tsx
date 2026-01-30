'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { formatPrice, formatDate, formatChange } from '@/lib/utils/formatters';
import { PriceHistory } from '@/types';

interface PriceHistoryTableProps {
  data: PriceHistory[];
  goldName?: string;
  onExport?: () => void;
  className?: string;
}

export function PriceHistoryTable({ 
  data, 
  goldName,
  onExport, 
  className 
}: PriceHistoryTableProps) {
  const t = useTranslations('prices');
  
  // Calculate statistics
  const stats = useMemo(() => {
    if (!data || data.length === 0) return null;

    const buyPrices = data.map(d => d.buy);
    const sellPrices = data.map(d => d.sell);

    return {
      avgBuy: buyPrices.reduce((a, b) => a + b, 0) / buyPrices.length,
      avgSell: sellPrices.reduce((a, b) => a + b, 0) / sellPrices.length,
      highestBuy: Math.max(...buyPrices),
      lowestBuy: Math.min(...buyPrices),
      highestSell: Math.max(...sellPrices),
      lowestSell: Math.min(...sellPrices),
    };
  }, [data]);

  if (!data || data.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center h-[200px]">
          <p className="text-muted-foreground">{t('chart.noData')}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>
              {goldName ? t('table.historyTitle', { name: goldName }) : t('table.historyDefault')}
            </CardTitle>
            {stats && (
              <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                <span>{t('table.avgBuy')}: ₫{formatPrice(stats.avgBuy)}</span>
                <span>{t('table.avgSell')}: ₫{formatPrice(stats.avgSell)}</span>
              </div>
            )}
          </div>
          {onExport && (
            <Button onClick={onExport} variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              {t('chart.exportCSV')}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg overflow-hidden">
          <div className="overflow-x-auto max-h-[500px]">
            <Table>
              <TableHeader className="sticky top-0 bg-muted">
                <TableRow>
                  <TableHead>{t('table.date')}</TableHead>
                  <TableHead className="text-right">{t('buy')}</TableHead>
                  <TableHead className="text-right">{t('sell')}</TableHead>
                  <TableHead className="text-right">{t('change')}</TableHead>
                  <TableHead className="text-right">{t('spread')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((item, index) => {
                  const prevItem = data[index - 1];
                  const changeBuy = prevItem ? item.buy - prevItem.buy : 0;
                  const changeSell = prevItem ? item.sell - prevItem.sell : 0;
                  const spread = item.sell - item.buy;

                  return (
                    <TableRow key={item.date}>
                      <TableCell className="font-medium">
                        {formatDate(item.date)}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        ₫{formatPrice(item.buy)}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        ₫{formatPrice(item.sell)}
                      </TableCell>
                      <TableCell className="text-right">
                        {prevItem && (
                          <div className="flex flex-col gap-1">
                            <Badge
                              variant={changeBuy >= 0 ? 'default' : 'destructive'}
                              className="text-xs"
                            >
                              {formatChange(changeBuy)}
                            </Badge>
                            <Badge
                              variant={changeSell >= 0 ? 'default' : 'destructive'}
                              className="text-xs"
                            >
                              {formatChange(changeSell)}
                            </Badge>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        ₫{formatPrice(spread)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
