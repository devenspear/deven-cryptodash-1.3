'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createContext, useContext, useState, useRef, useMemo } from 'react';

// Create context for price refresh functionality
interface PriceRefreshContextType {
  triggerRefresh: () => Promise<void>;
  isRefreshing: boolean;
  setRefreshFunction: (fn: (() => Promise<any>) | null) => void;
}

const PriceRefreshContext = createContext<PriceRefreshContextType>({
  triggerRefresh: async () => {},
  isRefreshing: false,
  setRefreshFunction: () => {},
});

export const usePriceRefresh = () => useContext(PriceRefreshContext);

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  const refreshFunctionRef = useRef<(() => Promise<any>) | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const setRefreshFunction = (fn: (() => Promise<any>) | null) => {
    refreshFunctionRef.current = fn;
  };

  const triggerRefresh = async () => {
    if (refreshFunctionRef.current && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await refreshFunctionRef.current();
      } finally {
        setIsRefreshing(false);
      }
    }
  };

  const contextValue = useMemo(() => ({
    triggerRefresh,
    isRefreshing,
    setRefreshFunction,
  }), [isRefreshing]);

  return (
    <QueryClientProvider client={queryClient}>
      <PriceRefreshContext.Provider value={contextValue}>
        {children}
      </PriceRefreshContext.Provider>
    </QueryClientProvider>
  );
} 