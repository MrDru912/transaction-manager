// composables/useCurrencies.ts
import { useQuery } from '@tanstack/vue-query';
import { currencyApi } from '../api/currencies';

export function useCurrencies() {
  return useQuery({
    queryKey: ['currencies'],
    queryFn: currencyApi.getAllCurrencies,
    staleTime: Infinity, // currencies rarely change, no need to refetch
  });
}