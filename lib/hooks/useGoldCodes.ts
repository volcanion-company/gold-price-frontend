'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api/axios';

export interface GoldCode {
  code: string;
  name: string;
  currency: 'VND' | 'USD';
}

interface GoldCodesApiResponse {
  success: boolean;
  data: {
    count: number;
    codes: GoldCode[];
  };
  timestamp: string;
}

interface UseGoldCodesResult {
  codes: GoldCode[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useGoldCodes(): UseGoldCodesResult {
  const [codes, setCodes] = useState<GoldCode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCodes = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await api.get<GoldCodesApiResponse>('/prices/codes');

      if (response.data.success && response.data.data?.codes) {
        setCodes(response.data.data.codes);
      } else {
        throw new Error('Failed to fetch gold codes');
      }
    } catch (err) {
      const error = err as Error;
      setError(error);
      console.error('Error fetching gold codes:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCodes();
  }, [fetchCodes]);

  return {
    codes,
    isLoading,
    error,
    refetch: fetchCodes,
  };
}
