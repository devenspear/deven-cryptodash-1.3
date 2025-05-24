import { useQuery } from '@tanstack/react-query';
import { fetchPrices, fetchOnChainMetrics } from '@/lib/api';
import { usePortfolioStore } from '@/lib/store';
import { useEffect } from 'react';

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
    if (query.data) {
      setPrices(query.data);
    }
  }, [query.data, setPrices]);

  return query;
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