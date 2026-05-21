import { apiClient } from './client';
import type { Transaction } from '../types/index';

export const currencyApi = {
  // GET /api/transactions
  getAllCurrencies: async (): Promise<string[]> => {
    const { data } = await apiClient.get<string[]>('/currencies');
    return data;
  }
}