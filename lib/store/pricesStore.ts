import { create } from 'zustand';
import { Price } from '@/types';

interface PricesState {
  prices: Price[];
  selectedGold: string | null;
  updatePrice: (code: string, data: Partial<Price>) => void;
  updatePrices: (prices: Price[]) => void;
  selectGold: (code: string | null) => void;
}

export const usePricesStore = create<PricesState>((set) => ({
  prices: [],
  selectedGold: null,

  updatePrice: (code, data) => {
    set((state) => ({
      prices: state.prices.map((p) =>
        p.code === code ? { ...p, ...data } : p
      ),
    }));
  },

  updatePrices: (prices) => {
    set({ prices });
  },

  selectGold: (code) => {
    set({ selectedGold: code });
  },
}));
