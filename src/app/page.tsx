'use client';

import { PortfolioOverview } from '@/components/PortfolioOverview';
import { PortfolioChart } from '@/components/PortfolioChart';
import { HoldingsTable } from '@/components/HoldingsTable';
import { QuickStats } from '@/components/QuickStats';
import { usePrices } from '@/hooks/usePrices';
import { Loader2 } from 'lucide-react';

export default function Dashboard() {
  const { isLoading, error } = usePrices();

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