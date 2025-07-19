import { useQuery } from '@tanstack/react-query';
import { fetchPrices, fetchOnChainMetrics } from '@/lib/api';
import { usePortfolioStore } from '@/lib/store';
import { useEffect, useCallback } from 'react';

export function usePrices() {
  const { holdings, setPrices } = usePortfolioStore();
  const symbols = holdings.map(h => h.symbol);

  const query = useQuery({
    queryKey: ['prices', symbols],
    queryFn: () => fetchPrices(symbols),
    refetchInterval: 30000, // Refetch every 30 seconds
    enabled: symbols.length > 0,
  });

  useEffect(() => {
    if (query.data && query.dataUpdatedAt) {
      // Pass the actual timestamp when data was last successfully fetched
      setPrices(query.data, new Date(query.dataUpdatedAt));
    }
  }, [query.data, query.dataUpdatedAt, setPrices]);

  const manualRefresh = useCallback(async () => {
    return await query.refetch();
  }, [query.refetch]);

  return {
    ...query,
    lastDataUpdate: query.dataUpdatedAt ? new Date(query.dataUpdatedAt) : null,
    manualRefresh
  };
}

export function useOnChainMetrics(symbol: string) {
  const { setMetrics } = usePortfolioStore();

  const query = useQuery({
    queryKey: ['metrics', symbol],
    queryFn: () => fetchOnChainMetrics(symbol),
    refetchInterval: 300000, // Refetch every 5 minutes
    enabled: !!symbol,
  });

  useEffect(() => {
    if (query.data) {
      setMetrics(symbol, query.data);
    }
  }, [query.data, symbol, setMetrics]);

  return query;
} 