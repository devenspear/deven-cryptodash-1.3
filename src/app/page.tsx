'use client';

import { PortfolioOverview } from '@/components/PortfolioOverview';
import { PortfolioChart } from '@/components/PortfolioChart';
import { HoldingsTable } from '@/components/HoldingsTable';
import { QuickStats } from '@/components/QuickStats';
import { usePrices } from '@/hooks/usePrices';
import { usePortfolioStore } from '@/lib/store';
import { usePriceRefresh } from './providers';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';

export default function Dashboard() {
  const { isLoading, error, manualRefresh } = usePrices();
  const { getLastUpdateTime } = usePortfolioStore();
  const { setRefreshFunction } = usePriceRefresh();

  // Register the refresh function with the global context
  useEffect(() => {
    if (manualRefresh) {
      setRefreshFunction(manualRefresh);
    }
    
    // Cleanup: remove the refresh function when component unmounts
    return () => setRefreshFunction(null);
  }, [manualRefresh, setRefreshFunction]);

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="card-gradient rounded-xl p-6 sm:p-8 text-center">
          <h2 className="text-lg sm:text-xl font-semibold text-white mb-2">Error Loading Data</h2>
          <p className="text-gray-400 text-sm sm:text-base">
            Unable to fetch price data. Please check your connection and try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-6 sm:pb-8">
      {/* Actual data refresh timestamp */}
      <div className="text-xs text-gray-500 text-center mb-2">
        🚀 Last Data Update: {getLastUpdateTime()} EST | 43 New Tokens Live
      </div>
      
      {isLoading && (
        <div className="flex items-center justify-center mb-4 sm:mb-6">
          <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin text-crypto-accent mr-2" />
          <span className="text-gray-400 text-sm sm:text-base">Loading portfolio data...</span>
        </div>
      )}
      
      <PortfolioOverview />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
        <PortfolioChart />
        <QuickStats />
      </div>
      
      <HoldingsTable />
    </div>
  );
}  
