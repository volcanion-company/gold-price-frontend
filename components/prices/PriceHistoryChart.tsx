'use client';

import { useMemo, useState, useCallback, useRef } from 'react';
import { useTranslations } from 'next-intl';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Brush,
  ReferenceArea,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatPrice, formatDate } from '@/lib/utils/formatters';
import { PriceHistory } from '@/types';
import { ZoomIn, ZoomOut, RotateCcw, Download } from 'lucide-react';

interface PriceHistoryChartProps {
  data: PriceHistory[];
  title?: string;
  className?: string;
}

// Custom tooltip component
function CustomTooltip({ active, payload, label, buyLabel, sellLabel }: any) {
  if (!active || !payload || !payload.length) return null;

  return (
    <Card className="shadow-lg">
      <CardContent className="p-3">
        <p className="text-xs font-medium mb-2">{formatDate(label)}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-xs">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground">{entry.name}:</span>
            <span className="font-semibold">₫{formatPrice(entry.value as number)}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function PriceHistoryChart({ data, title, className }: PriceHistoryChartProps) {
  const t = useTranslations('prices');
  const chartRef = useRef<HTMLDivElement>(null);
  
  // Zoom state
  const [zoomState, setZoomState] = useState<{
    left?: string;
    right?: string;
    refAreaLeft?: string;
    refAreaRight?: string;
    isZooming: boolean;
  }>({
    left: undefined,
    right: undefined,
    refAreaLeft: undefined,
    refAreaRight: undefined,
    isZooming: false,
  });

  // Filter data based on zoom
  const filteredData = useMemo(() => {
    if (!data || data.length === 0) return [];
    if (!zoomState.left || !zoomState.right) return data;
    
    const leftIndex = data.findIndex(d => d.date === zoomState.left);
    const rightIndex = data.findIndex(d => d.date === zoomState.right);
    
    if (leftIndex === -1 || rightIndex === -1) return data;
    
    return data.slice(
      Math.min(leftIndex, rightIndex),
      Math.max(leftIndex, rightIndex) + 1
    );
  }, [data, zoomState.left, zoomState.right]);

  // Calculate min and max for better Y-axis scaling
  const { minPrice, maxPrice } = useMemo(() => {
    const chartData = filteredData.length > 0 ? filteredData : data;
    if (!chartData || chartData.length === 0) return { minPrice: 0, maxPrice: 100 };

    const allPrices = chartData.flatMap(d => [d.buy, d.sell]);
    const min = Math.min(...allPrices);
    const max = Math.max(...allPrices);
    const padding = (max - min) * 0.1; // 10% padding

    return {
      minPrice: Math.floor((min - padding) / 1000) * 1000,
      maxPrice: Math.ceil((max + padding) / 1000) * 1000,
    };
  }, [filteredData, data]);

  // Zoom handlers
  const handleMouseDown = useCallback((e: any) => {
    if (e?.activeLabel) {
      setZoomState(prev => ({ ...prev, refAreaLeft: e.activeLabel, isZooming: true }));
    }
  }, []);

  const handleMouseMove = useCallback((e: any) => {
    if (zoomState.isZooming && e?.activeLabel) {
      setZoomState(prev => ({ ...prev, refAreaRight: e.activeLabel }));
    }
  }, [zoomState.isZooming]);

  const handleMouseUp = useCallback(() => {
    if (zoomState.refAreaLeft && zoomState.refAreaRight) {
      const leftDate = zoomState.refAreaLeft;
      const rightDate = zoomState.refAreaRight;
      
      // Ensure left is before right
      const leftIndex = data.findIndex(d => d.date === leftDate);
      const rightIndex = data.findIndex(d => d.date === rightDate);
      
      if (leftIndex !== rightIndex) {
        setZoomState({
          left: leftIndex < rightIndex ? leftDate : rightDate,
          right: leftIndex < rightIndex ? rightDate : leftDate,
          refAreaLeft: undefined,
          refAreaRight: undefined,
          isZooming: false,
        });
      } else {
        setZoomState(prev => ({
          ...prev,
          refAreaLeft: undefined,
          refAreaRight: undefined,
          isZooming: false,
        }));
      }
    } else {
      setZoomState(prev => ({
        ...prev,
        refAreaLeft: undefined,
        refAreaRight: undefined,
        isZooming: false,
      }));
    }
  }, [zoomState.refAreaLeft, zoomState.refAreaRight, data]);

  const handleReset = useCallback(() => {
    setZoomState({
      left: undefined,
      right: undefined,
      refAreaLeft: undefined,
      refAreaRight: undefined,
      isZooming: false,
    });
  }, []);

  // Export to CSV
  const handleExportCSV = useCallback(() => {
    const chartData = filteredData.length > 0 ? filteredData : data;
    if (!chartData || chartData.length === 0) return;

    const headers = [t('table.date'), t('buy'), t('sell')];
    const rows = chartData.map(d => [
      formatDate(d.date),
      d.buy.toString(),
      d.sell.toString(),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(',')),
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `gold-price-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }, [filteredData, data, t]);

  if (!data || data.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center h-[400px]">
          <p className="text-muted-foreground">{t('chart.noData')}</p>
        </CardContent>
      </Card>
    );
  }

  const isZoomed = zoomState.left !== undefined;

  return (
    <Card className={className}>
      {title && (
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <div className="flex items-center gap-1">
            {isZoomed && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleReset}
                title={t('chart.resetZoom')}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleExportCSV}
              title={t('chart.exportCSV')}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
      )}
      <CardContent>
        <div className="mb-2 text-xs text-muted-foreground">
          <ZoomIn className="inline h-3 w-3 mr-1" />
          {t('chart.dragToZoom')}
        </div>
        <div ref={chartRef}>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={filteredData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                tickFormatter={(value) => formatDate(value)}
                className="text-xs"
                allowDataOverflow
                tick={{ fontSize: 10 }}
              />
              <YAxis
                domain={[minPrice, maxPrice]}
                tickFormatter={(value) => `₫${formatPrice(value)}`}
                className="text-xs"
                width={80}
                allowDataOverflow
                tick={{ fontSize: 10 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Line
                type="monotone"
                dataKey="buy"
                name={t('buy')}
                stroke="var(--chart-1)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
                animationDuration={300}
              />
              <Line
                type="monotone"
                dataKey="sell"
                name={t('sell')}
                stroke="var(--chart-2)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
                animationDuration={300}
              />
              
              {/* Brush for additional navigation */}
              <Brush
                dataKey="date"
                height={30}
                stroke="var(--primary)"
                fill="var(--muted)"
                tickFormatter={(value) => formatDate(value)}
                tick={{ fontSize: 10 }}
              />
              
              {/* Reference area for zoom selection */}
              {zoomState.refAreaLeft && zoomState.refAreaRight && (
                <ReferenceArea
                  x1={zoomState.refAreaLeft}
                  x2={zoomState.refAreaRight}
                  strokeOpacity={0.3}
                  fill="var(--primary)"
                  fillOpacity={0.2}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
