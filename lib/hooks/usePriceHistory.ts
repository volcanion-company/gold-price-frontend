'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api/axios';
import { PriceHistory } from '@/types';
import { toast } from 'sonner';

export type Period = '7d' | '30d' | '90d' | '1y' | 'all';

interface UsePriceHistoryResult {
  data: PriceHistory[] | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

interface HistoryApiResponse {
  success: boolean;
  data: {
    code: string;
    period: string;
    count: number;
    history: Array<{
      _id: string;
      code: string;
      buy: number;
      sell: number;
      changeBuy: number;
      changeSell: number;
      currency: 'VND' | 'USD';
      recordedAt: string;
      period: string;
    }>;
  };
  message?: string;
  timestamp: string;
}

// Convert frontend period to API params
function getPeriodParams(period: Period): { from: string; limit: number } {
  const now = new Date();
  let fromDate: Date;
  let limit = 100;

  switch (period) {
    case '7d':
      fromDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      limit = 100;
      break;
    case '30d':
      fromDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      limit = 200;
      break;
    case '90d':
      fromDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      limit = 300;
      break;
    case '1y':
      fromDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      limit = 500;
      break;
    case 'all':
    default:
      fromDate = new Date('2020-01-01');
      limit = 1000;
      break;
  }

  return {
    from: fromDate.toISOString(),
    limit,
  };
}

export function usePriceHistory(
  code: string,
  period: Period = '30d'
): UsePriceHistoryResult {
  const [data, setData] = useState<PriceHistory[] | null>(null);
  // Start with isLoading false if no code provided
  const [isLoading, setIsLoading] = useState(!!code);
  const [error, setError] = useState<Error | null>(null);

  const fetchHistory = useCallback(async () => {
    if (!code) {
      setData(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { from, limit } = getPeriodParams(period);

      const response = await api.get<HistoryApiResponse>(
        `/prices/${code}/history`,
        {
          params: {
            period: 'day',
            from,
            limit,
          },
        }
      );

      if (response.data.success && response.data.data?.history) {
        // Transform data: add 'date' field from 'recordedAt' for chart compatibility
        // Also sort by date ascending for charts
        const transformedData: PriceHistory[] = response.data.data.history
          .map(item => ({
            _id: item._id,
            code: item.code,
            buy: item.buy,
            sell: item.sell,
            changeBuy: item.changeBuy,
            changeSell: item.changeSell,
            currency: item.currency,
            recordedAt: item.recordedAt,
            date: item.recordedAt,
            period: item.period as 'minute' | 'hour' | 'day',
          }))
          .sort((a, b) => new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime());

        setData(transformedData);
      } else {
        throw new Error(response.data.message || 'Failed to fetch history');
      }
    } catch (err) {
      const error = err as Error;
      setError(error);
      toast.error('Lỗi tải lịch sử giá', {
        description: error.message || 'Vui lòng thử lại sau',
      });
    } finally {
      setIsLoading(false);
    }
  }, [code, period]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchHistory,
  };
}
