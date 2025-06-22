'use client';

import { usePortfolioStore } from '@/lib/store';
import { formatNumber } from '@/lib/api';
import { TrendingUp, TrendingDown, DollarSign, Percent, Calendar, BarChart3 } from 'lucide-react';
import { useMemo, useState } from 'react';

export function PortfolioOverview() {
  const { getTotalValue, getPortfolioData, getTimeframeChanges } = usePortfolioStore();
  const [selectedTimeframe, setSelectedTimeframe] = useState<'24h' | '7d' | '30d'>('24h');
  
  const portfolioData = getPortfolioData();
  const totalValue = getTotalValue();
  const timeframeData = getTimeframeChanges(selectedTimeframe);

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

  const is24hPositive = total24hChange >= 0;
  const isTimeframePositive = timeframeData.changeAmount >= 0;

  return (
    <div className="mb-6 sm:mb-8">
      {/* Main Portfolio Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-4 sm:mb-6">
        <div className="card-gradient rounded-xl p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-gray-400 mb-1">Total Portfolio Value</p>
              <p className="text-xl sm:text-2xl font-bold text-white truncate">{formatNumber(totalValue)}</p>
            </div>
            <div className="p-2 sm:p-3 bg-crypto-accent/20 rounded-lg flex-shrink-0 ml-3">
              <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-crypto-accent" />
            </div>
          </div>
        </div>

        <div className="card-gradient rounded-xl p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-gray-400 mb-1">24h Change</p>
              <p className={`text-xl sm:text-2xl font-bold truncate ${is24hPositive ? 'text-crypto-success' : 'text-crypto-danger'}`}>
                {is24hPositive ? '+' : ''}{formatNumber(total24hChange)}
              </p>
            </div>
            <div className={`p-2 sm:p-3 rounded-lg flex-shrink-0 ml-3 ${is24hPositive ? 'bg-crypto-success/20' : 'bg-crypto-danger/20'}`}>
              {is24hPositive ? (
                <TrendingUp className={`w-5 h-5 sm:w-6 sm:h-6 text-crypto-success`} />
              ) : (
                <TrendingDown className={`w-5 h-5 sm:w-6 sm:h-6 text-crypto-danger`} />
              )}
            </div>
          </div>
        </div>

        <div className="card-gradient rounded-xl p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-gray-400 mb-1">24h Change %</p>
              <p className={`text-xl sm:text-2xl font-bold truncate ${is24hPositive ? 'text-crypto-success' : 'text-crypto-danger'}`}>
                {is24hPositive ? '+' : ''}{total24hChangePercent.toFixed(2)}%
              </p>
            </div>
            <div className={`p-2 sm:p-3 rounded-lg flex-shrink-0 ml-3 ${is24hPositive ? 'bg-crypto-success/20' : 'bg-crypto-danger/20'}`}>
              <Percent className={`w-5 h-5 sm:w-6 sm:h-6 ${is24hPositive ? 'text-crypto-success' : 'text-crypto-danger'}`} />
            </div>
          </div>
        </div>

        <div className="card-gradient rounded-xl p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-gray-400 mb-1">Holdings Count</p>
              <p className="text-xl sm:text-2xl font-bold text-white">{portfolioData.length}</p>
            </div>
            <div className="p-2 sm:p-3 bg-crypto-purple/20 rounded-lg flex-shrink-0 ml-3">
              <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-crypto-purple" />
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Timeframe Performance */}
      <div className="card-gradient rounded-xl p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-crypto-accent mr-2 flex-shrink-0" />
            <h3 className="text-lg sm:text-xl font-semibold text-white">Multi-Timeframe Performance</h3>
          </div>
          <div className="flex bg-gray-800 rounded-lg p-1 w-full sm:w-auto">
            {(['24h', '7d', '30d'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setSelectedTimeframe(period)}
                className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 sm:py-2 rounded text-sm font-medium transition-colors touch-target ${
                  selectedTimeframe === period
                    ? 'bg-crypto-accent text-white'
                    : 'text-gray-400 hover:text-white active:bg-gray-700'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-gray-800/30 rounded-lg p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-400 mb-1">Change Amount ({selectedTimeframe})</p>
                <p className={`text-lg sm:text-xl font-bold truncate ${isTimeframePositive ? 'text-crypto-success' : 'text-crypto-danger'}`}>
                  {isTimeframePositive ? '+' : ''}{formatNumber(Math.abs(timeframeData.changeAmount))}
                </p>
              </div>
              <div className={`p-2 rounded-lg flex-shrink-0 ml-3 ${isTimeframePositive ? 'bg-crypto-success/20' : 'bg-crypto-danger/20'}`}>
                <DollarSign className={`w-4 h-4 sm:w-5 sm:h-5 ${isTimeframePositive ? 'text-crypto-success' : 'text-crypto-danger'}`} />
              </div>
            </div>
          </div>

          <div className="bg-gray-800/30 rounded-lg p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-400 mb-1">Change % ({selectedTimeframe})</p>
                <p className={`text-lg sm:text-xl font-bold truncate ${isTimeframePositive ? 'text-crypto-success' : 'text-crypto-danger'}`}>
                  {isTimeframePositive ? '+' : ''}{timeframeData.changePercent.toFixed(2)}%
                </p>
              </div>
              <div className={`p-2 rounded-lg flex-shrink-0 ml-3 ${isTimeframePositive ? 'bg-crypto-success/20' : 'bg-crypto-danger/20'}`}>
                <Percent className={`w-4 h-4 sm:w-5 sm:h-5 ${isTimeframePositive ? 'text-crypto-success' : 'text-crypto-danger'}`} />
              </div>
            </div>
          </div>

          <div className="bg-gray-800/30 rounded-lg p-3 sm:p-4 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-400 mb-1">Performance</p>
                <p className={`text-lg sm:text-xl font-bold ${isTimeframePositive ? 'text-crypto-success' : 'text-crypto-danger'}`}>
                  {isTimeframePositive ? 'Positive' : 'Negative'}
                </p>
              </div>
              <div className={`p-2 rounded-lg flex-shrink-0 ml-3 ${isTimeframePositive ? 'bg-crypto-success/20' : 'bg-crypto-danger/20'}`}>
                {isTimeframePositive ? (
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-crypto-success" />
                ) : (
                  <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 text-crypto-danger" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 