'use client';

import { useState } from 'react';
import { usePortfolioStore } from '@/lib/store';
import { formatPrice, formatNumber } from '@/lib/api';
import { getCategoryForSymbol, CATEGORY_COLORS } from '@/lib/constants';
import { TrendingUp, TrendingDown, ExternalLink, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

type SortField = 'symbol' | 'price' | 'holdings' | 'value' | 'change' | 'allocation';
type SortDirection = 'asc' | 'desc' | null;

export function HoldingsTable() {
  const { getPortfolioData } = usePortfolioStore();
  const portfolioData = getPortfolioData();
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const getTradingViewUrl = (symbol: string) => {
    // Convert symbol to TradingView format (most cryptos are SYMBOL + USD)
    const tradingViewSymbol = `${symbol.toUpperCase()}USD`;
    return `https://www.tradingview.com/chart/?symbol=${tradingViewSymbol}`;
  };

  const handleSort = (field: SortField) => {
    let newDirection: SortDirection = 'asc';
    
    if (sortField === field) {
      if (sortDirection === 'asc') {
        newDirection = 'desc';
      } else if (sortDirection === 'desc') {
        newDirection = null;
      } else {
        newDirection = 'asc';
      }
    }
    
    setSortField(newDirection ? field : null);
    setSortDirection(newDirection);
  };

  const getSortedData = () => {
    if (!sortField || !sortDirection) return portfolioData;

    return [...portfolioData].sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortField) {
        case 'symbol':
          aValue = a.symbol.toLowerCase();
          bValue = b.symbol.toLowerCase();
          break;
        case 'price':
          aValue = a.value / a.amount;
          bValue = b.value / b.amount;
          break;
        case 'holdings':
          aValue = a.amount;
          bValue = b.amount;
          break;
        case 'value':
          aValue = a.value;
          bValue = b.value;
          break;
        case 'change':
          aValue = a.change24h;
          bValue = b.change24h;
          break;
        case 'allocation':
          aValue = a.percentage;
          bValue = b.percentage;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ChevronsUpDown className="w-4 h-4 text-gray-500" />;
    }
    if (sortDirection === 'asc') {
      return <ChevronUp className="w-4 h-4 text-crypto-accent" />;
    }
    if (sortDirection === 'desc') {
      return <ChevronDown className="w-4 h-4 text-crypto-accent" />;
    }
    return <ChevronsUpDown className="w-4 h-4 text-gray-500" />;
  };

  const sortedData = getSortedData();

  return (
    <div className="card-gradient rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">Holdings</h3>
        {sortField && (
          <span className="text-crypto-accent text-sm font-medium">
            Sorted by {sortField} ({sortDirection})
          </span>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th 
                className="text-left py-3 px-4 text-gray-400 font-medium cursor-pointer hover:bg-gray-800/50 transition-colors select-none"
                onClick={() => handleSort('symbol')}
              >
                <div className="flex items-center space-x-2">
                  <span>Asset</span>
                  <SortIcon field="symbol" />
                </div>
              </th>
              <th 
                className="text-right py-3 px-4 text-gray-400 font-medium cursor-pointer hover:bg-gray-800/50 transition-colors select-none"
                onClick={() => handleSort('price')}
              >
                <div className="flex items-center justify-end space-x-2">
                  <span>Price</span>
                  <SortIcon field="price" />
                </div>
              </th>
              <th 
                className="text-right py-3 px-4 text-gray-400 font-medium cursor-pointer hover:bg-gray-800/50 transition-colors select-none"
                onClick={() => handleSort('holdings')}
              >
                <div className="flex items-center justify-end space-x-2">
                  <span>Holdings</span>
                  <SortIcon field="holdings" />
                </div>
              </th>
              <th 
                className="text-right py-3 px-4 text-gray-400 font-medium cursor-pointer hover:bg-gray-800/50 transition-colors select-none"
                onClick={() => handleSort('value')}
              >
                <div className="flex items-center justify-end space-x-2">
                  <span>Value</span>
                  <SortIcon field="value" />
                </div>
              </th>
              <th 
                className="text-right py-3 px-4 text-gray-400 font-medium cursor-pointer hover:bg-gray-800/50 transition-colors select-none"
                onClick={() => handleSort('change')}
              >
                <div className="flex items-center justify-end space-x-2">
                  <span>24h Change</span>
                  <SortIcon field="change" />
                </div>
              </th>
              <th 
                className="text-right py-3 px-4 text-gray-400 font-medium cursor-pointer hover:bg-gray-800/50 transition-colors select-none"
                onClick={() => handleSort('allocation')}
              >
                <div className="flex items-center justify-end space-x-2">
                  <span>Allocation</span>
                  <SortIcon field="allocation" />
                </div>
              </th>
              <th className="text-center py-3 px-4 text-gray-400 font-medium">Chart</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((position) => {
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
                      href={getTradingViewUrl(position.symbol)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 text-crypto-accent hover:text-crypto-primary transition-colors group"
                      title={`View ${position.symbol} chart on TradingView`}
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