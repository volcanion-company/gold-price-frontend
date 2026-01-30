// TypeScript types for the application

export interface Price {
  _id: string;
  code: string;
  name: string;
  buy: number;
  sell: number;
  changeBuy: number;
  changeSell: number;
  currency: 'VND' | 'USD';
  source: string;
  updatedAt: string;
  createdAt: string;
}

export interface PriceHistory {
  _id: string;
  code: string;
  buy: number;
  sell: number;
  changeBuy: number;
  changeSell: number;
  currency: 'VND' | 'USD';
  recordedAt: string;
  date: string; // Alias for recordedAt, used in charts
  period: 'minute' | 'hour' | 'day';
}

export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
  timestamp: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

export interface WebSocketPriceUpdate {
  success: boolean;
  changes: Array<{
    code: string;
    name: string;
    buy: number;
    sell: number;
    changeBuy: number;
    changeSell: number;
    currency: string;
    timestamp: Date;
  }>;
  allPrices: Price[];
  timestamp: Date;
  source: 'cache';
}

export interface WebSocketCurrentPrices {
  success: boolean;
  data: Price[];
  timestamp: Date;
  source: 'cache';
}
