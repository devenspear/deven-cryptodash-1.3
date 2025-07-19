'use client';

import { usePortfolioStore } from '@/lib/store';
import { formatNumber } from '@/lib/api';
import { TrendingUp, TrendingDown, Clock, Trophy, TrendingDown as WorstIcon } from 'lucide-react';
import { useState } from 'react';

export function QuickStats() {
  const { getPerformanceStats, getTimeframeChanges, getLastUpdateTime } = usePortfolioStore();
  const [selectedTimeframe, setSelectedTimeframe] = useState<'24h' | '7d' | '30d'>('24h');
  
  const performanceStats = getPerformanceStats();
  const timeframeData = getTimeframeChanges(selectedTimeframe);
  
  const getBestPerformer = () => {
    switch (selectedTimeframe) {
      case '24h': return performanceStats.bestPerformer24h;
      case '7d': return performanceStats.bestPerformer7d;
      case '30d': return performanceStats.bestPerformer30d;
    }
  };
  
  const getWorstPerformer = () => {
    switch (selectedTimeframe) {
      case '24h': return performanceStats.worstPerformer24h;
      case '7d': return performanceStats.worstPerformer7d;
      case '30d': return performanceStats.worstPerformer30d;
    }
  };

  const bestPerformer = getBestPerformer();
  const worstPerformer = getWorstPerformer();

  return (
    <div className="card-gradient rounded-xl p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
        <h3 className="text-lg sm:text-xl font-semibold text-white">Quick Stats</h3>
        <div className="flex bg-gray-800 rounded-lg p-1 w-full sm:w-auto">
          {(['24h', '7d', '30d'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedTimeframe(period)}
              className={`flex-1 sm:flex-none px-3 py-2 rounded text-sm font-medium transition-colors touch-target ${
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

      <div className="space-y-4 sm:space-y-6">
        {/* Portfolio Change for Selected Timeframe */}
        <div className="bg-gray-800/50 rounded-lg p-3 sm:p-4">
          <h4 className="text-sm text-gray-400 mb-3">Portfolio Change ({selectedTimeframe})</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Amount</p>
              <p className={`text-base sm:text-lg font-semibold truncate ${
                timeframeData.changeAmount >= 0 ? 'text-crypto-success' : 'text-crypto-danger'
              }`}>
                {timeframeData.changeAmount >= 0 ? '+' : ''}{formatNumber(timeframeData.changeAmount)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Percentage</p>
              <p className={`text-base sm:text-lg font-semibold ${
                timeframeData.changePercent >= 0 ? 'text-crypto-success' : 'text-crypto-danger'
              }`}>
                {timeframeData.changePercent >= 0 ? '+' : ''}{timeframeData.changePercent.toFixed(2)}%
              </p>
            </div>
          </div>
        </div>

        {/* Best Performer */}
        <div className="flex justify-between items-center bg-gray-800/30 rounded-lg p-3 sm:p-4">
          <div className="flex items-center min-w-0 flex-1">
            <Trophy className="w-4 h-4 text-crypto-success mr-2 sm:mr-3 flex-shrink-0" />
            <span className="text-gray-400 text-sm sm:text-base truncate">Best Performer ({selectedTimeframe})</span>
          </div>
          <div className="text-right ml-3 flex-shrink-0">
            {bestPerformer ? (
              <>
                <div className="text-crypto-success font-semibold text-sm sm:text-base">{bestPerformer.symbol}</div>
                <div className="text-xs sm:text-sm text-crypto-success">
                  +{bestPerformer.change.toFixed(2)}%
                </div>
              </>
            ) : (
              <span className="text-gray-500 text-sm">No data</span>
            )}
          </div>
        </div>

        {/* Worst Performer */}
        <div className="flex justify-between items-center bg-gray-800/30 rounded-lg p-3 sm:p-4">
          <div className="flex items-center min-w-0 flex-1">
            <WorstIcon className="w-4 h-4 text-crypto-danger mr-2 sm:mr-3 flex-shrink-0" />
            <span className="text-gray-400 text-sm sm:text-base truncate">Worst Performer ({selectedTimeframe})</span>
          </div>
          <div className="text-right ml-3 flex-shrink-0">
            {worstPerformer ? (
              <>
                <div className="text-crypto-danger font-semibold text-sm sm:text-base">{worstPerformer.symbol}</div>
                <div className="text-xs sm:text-sm text-crypto-danger">
                  {worstPerformer.change.toFixed(2)}%
                </div>
              </>
            ) : (
              <span className="text-gray-500 text-sm">No data</span>
            )}
          </div>
        </div>

        {/* Last Updated */}
        <div className="flex justify-between items-center pt-3 sm:pt-4 border-t border-gray-700">
          <div className="flex items-center min-w-0 flex-1">
            <Clock className="w-4 h-4 text-gray-400 mr-2 sm:mr-3 flex-shrink-0" />
            <span className="text-gray-400 text-sm sm:text-base truncate">Last Updated</span>
          </div>
          <span className="text-white text-xs sm:text-sm ml-3 flex-shrink-0">{getLastUpdateTime()}</span>
        </div>
      </div>
    </div>
  );
} 