'use client';

import { usePortfolioStore } from '@/lib/store';
import { formatPrice, formatNumber } from '@/lib/api';
import { getCategoryForSymbol, CATEGORY_COLORS } from '@/lib/constants';
import { TrendingUp, TrendingDown, ExternalLink } from 'lucide-react';

export function HoldingsTable() {
  const { getPortfolioData } = usePortfolioStore();
  const portfolioData = getPortfolioData();

  const getCoinMarketCapUrl = (symbol: string) => {
    // Convert symbol to lowercase and handle special cases
    const formattedSymbol = symbol.toLowerCase();
    return `https://coinmarketcap.com/currencies/${formattedSymbol}/`;
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
              <th className="text-center py-3 px-4 text-gray-400 font-medium">Chart</th>
            </tr>
          </thead>
          <tbody>
            {portfolioData.map((position) => {
              const category = getCategoryForSymbol(position.symbol);
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
                  <td className="py-4 px-4 text-center">
                    <a
                      href={getCoinMarketCapUrl(position.symbol)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 text-crypto-accent hover:text-crypto-primary transition-colors group"
                      title={`View ${position.symbol} chart on CoinMarketCap`}
                    >
                      <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      <span className="text-sm font-medium">Chart</span>
                    </a>
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