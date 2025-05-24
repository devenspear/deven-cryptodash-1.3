'use client';

import { usePortfolioStore } from '@/lib/store';
import { formatNumber } from '@/lib/api';
import { TrendingUp, TrendingDown, DollarSign, Percent } from 'lucide-react';
import { useMemo } from 'react';

export function PortfolioOverview() {
  const { getTotalValue, getPortfolioData, prices } = usePortfolioStore();
  
  const portfolioData = getPortfolioData();
  const totalValue = getTotalValue();
  
  const { total24hChange, total24hChangePercent } = useMemo(() => {
    let totalChange = 0;
    let totalPreviousValue = 0;
    
    portfolioData.forEach(position => {
      const currentValue = position.value;
      const previousValue = currentValue / (1 + position.change24h / 100);
      totalChange += currentValue - previousValue;
      totalPreviousValue += previousValue;
    });
    
    const changePercent = totalPreviousValue > 0 ? (totalChange / totalPreviousValue) * 100 : 0;
    
    return {
      total24hChange: totalChange,
      total24hChangePercent: changePercent,
    };
  }, [portfolioData]);

  const isPositive = total24hChange >= 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="card-gradient rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400 mb-1">Total Portfolio Value</p>
            <p className="text-2xl font-bold text-white">{formatNumber(totalValue)}</p>
          </div>
          <div className="p-3 bg-crypto-accent/20 rounded-lg">
            <DollarSign className="w-6 h-6 text-crypto-accent" />
          </div>
        </div>
      </div>

      <div className="card-gradient rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400 mb-1">24h Change</p>
            <p className={`text-2xl font-bold ${isPositive ? 'text-crypto-success' : 'text-crypto-danger'}`}>
              {formatNumber(Math.abs(total24hChange))}
            </p>
          </div>
          <div className={`p-3 rounded-lg ${isPositive ? 'bg-crypto-success/20' : 'bg-crypto-danger/20'}`}>
            {isPositive ? (
              <TrendingUp className={`w-6 h-6 text-crypto-success`} />
            ) : (
              <TrendingDown className={`w-6 h-6 text-crypto-danger`} />
            )}
          </div>
        </div>
      </div>

      <div className="card-gradient rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400 mb-1">24h Change %</p>
            <p className={`text-2xl font-bold ${isPositive ? 'text-crypto-success' : 'text-crypto-danger'}`}>
              {isPositive ? '+' : ''}{total24hChangePercent.toFixed(2)}%
            </p>
          </div>
          <div className={`p-3 rounded-lg ${isPositive ? 'bg-crypto-success/20' : 'bg-crypto-danger/20'}`}>
            <Percent className={`w-6 h-6 ${isPositive ? 'text-crypto-success' : 'text-crypto-danger'}`} />
          </div>
        </div>
      </div>

      <div className="card-gradient rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400 mb-1">Holdings Count</p>
            <p className="text-2xl font-bold text-white">{portfolioData.length}</p>
          </div>
          <div className="p-3 bg-crypto-purple/20 rounded-lg">
            <TrendingUp className="w-6 h-6 text-crypto-purple" />
          </div>
        </div>
      </div>
    </div>
  );
} 