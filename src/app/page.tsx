'use client';

import { PortfolioOverview } from '@/components/PortfolioOverview';
import { PortfolioChart } from '@/components/PortfolioChart';
import { HoldingsTable } from '@/components/HoldingsTable';
import { usePrices } from '@/hooks/usePrices';
import { Loader2 } from 'lucide-react';

export default function Dashboard() {
  const { isLoading, error } = usePrices();

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-6">
        <div className="card-gradient rounded-xl p-8 text-center">
          <h2 className="text-xl font-semibold text-white mb-2">Error Loading Data</h2>
          <p className="text-gray-400">
            Unable to fetch price data. Please check your connection and try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6">
      {isLoading && (
        <div className="flex items-center justify-center mb-6">
          <Loader2 className="w-6 h-6 animate-spin text-crypto-accent mr-2" />
          <span className="text-gray-400">Loading portfolio data...</span>
        </div>
      )}
      
      <PortfolioOverview />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <PortfolioChart />
        
        <div className="card-gradient rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-6">Quick Stats</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Best Performer (24h)</span>
              <span className="text-crypto-success font-semibold">Loading...</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Worst Performer (24h)</span>
              <span className="text-crypto-danger font-semibold">Loading...</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Last Updated</span>
              <span className="text-white">{new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </div>
      
      <HoldingsTable />
    </div>
  );
} 