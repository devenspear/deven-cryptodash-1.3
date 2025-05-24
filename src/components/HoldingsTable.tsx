'use client';

import { usePortfolioStore } from '@/lib/store';
import { formatPrice, formatNumber } from '@/lib/api';
import { getCategoryForSymbol, CATEGORY_COLORS, RISK_LEVELS } from '@/lib/constants';
import { TrendingUp, TrendingDown } from 'lucide-react';

export function HoldingsTable() {
  const { getPortfolioData } = usePortfolioStore();
  const portfolioData = getPortfolioData();

  const getRiskBadgeColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'bg-crypto-success/20 text-crypto-success';
      case 'medium': return 'bg-crypto-warning/20 text-crypto-warning';
      case 'high': return 'bg-crypto-danger/20 text-crypto-danger';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="card-gradient rounded-xl p-6">
      <h3 className="text-xl font-semibold text-white mb-6">Holdings</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left py-3 px-4 text-gray-400 font-medium">Asset</th>
              <th className="text-right py-3 px-4 text-gray-400 font-medium">Price</th>
              <th className="text-right py-3 px-4 text-gray-400 font-medium">Holdings</th>
              <th className="text-right py-3 px-4 text-gray-400 font-medium">Value</th>
              <th className="text-right py-3 px-4 text-gray-400 font-medium">24h Change</th>
              <th className="text-right py-3 px-4 text-gray-400 font-medium">Allocation</th>
              <th className="text-right py-3 px-4 text-gray-400 font-medium">Risk</th>
            </tr>
          </thead>
          <tbody>
            {portfolioData.map((position) => {
              const category = getCategoryForSymbol(position.symbol);
              const riskLevel = RISK_LEVELS[category] || 'medium';
              const isPositive = position.change24h >= 0;
              const currentPrice = position.value / position.amount;

              return (
                <tr key={position.symbol} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: CATEGORY_COLORS[category] || '#94a3b8' }}
                      />
                      <div>
                        <div className="font-semibold text-white">{position.symbol}</div>
                        <div className="text-sm text-gray-400">{category}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right text-white font-medium">
                    {formatPrice(currentPrice)}
                  </td>
                  <td className="py-4 px-4 text-right text-white">
                    {position.amount.toLocaleString(undefined, { 
                      maximumFractionDigits: position.amount < 1 ? 6 : 2 
                    })}
                  </td>
                  <td className="py-4 px-4 text-right text-white font-semibold">
                    {formatNumber(position.value)}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className={`flex items-center justify-end space-x-1 ${
                      isPositive ? 'text-crypto-success' : 'text-crypto-danger'
                    }`}>
                      {isPositive ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      <span className="font-medium">
                        {isPositive ? '+' : ''}{position.change24h.toFixed(2)}%
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right text-white">
                    {position.percentage.toFixed(1)}%
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskBadgeColor(riskLevel)}`}>
                      {riskLevel.toUpperCase()}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
} 