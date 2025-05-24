import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Holding, Price, Alert, OnChainMetrics } from './types';
import { DEFAULT_HOLDINGS } from './constants';

interface PortfolioStore {
  holdings: Holding[];
  prices: Record<string, Price>;
  alerts: Alert[];
  metrics: Record<string, OnChainMetrics>;
  
  // Actions
  addHolding: (holding: Holding) => void;
  updateHolding: (symbol: string, amount: number) => void;
  removeHolding: (symbol: string) => void;
  setPrices: (prices: Price[]) => void;
  setMetrics: (symbol: string, metrics: OnChainMetrics) => void;
  
  // Alerts
  addAlert: (alert: Omit<Alert, 'id'>) => void;
  removeAlert: (id: string) => void;
  toggleAlert: (id: string) => void;
  triggerAlert: (id: string) => void;
  
  // Computed values
  getTotalValue: () => number;
  getPortfolioData: () => Array<{
    symbol: string;
    amount: number;
    value: number;
    change24h: number;
    percentage: number;
  }>;
}

export const usePortfolioStore = create<PortfolioStore>()(
  persist(
    (set, get) => ({
      holdings: DEFAULT_HOLDINGS,
      prices: {},
      alerts: [],
      metrics: {},

      addHolding: (holding) =>
        set((state) => {
          const existingIndex = state.holdings.findIndex(h => h.symbol === holding.symbol);
          if (existingIndex >= 0) {
            const updated = [...state.holdings];
            updated[existingIndex] = { ...updated[existingIndex], amount: holding.amount };
            return { holdings: updated };
          }
          return { holdings: [...state.holdings, holding] };
        }),

      updateHolding: (symbol, amount) =>
        set((state) => ({
          holdings: state.holdings.map(h =>
            h.symbol === symbol ? { ...h, amount } : h
          ),
        })),

      removeHolding: (symbol) =>
        set((state) => ({
          holdings: state.holdings.filter(h => h.symbol !== symbol),
        })),

      setPrices: (prices) =>
        set((state) => {
          const priceMap = { ...state.prices };
          prices.forEach(price => {
            priceMap[price.symbol] = price;
          });
          return { prices: priceMap };
        }),

      setMetrics: (symbol, metrics) =>
        set((state) => ({
          metrics: { ...state.metrics, [symbol]: metrics },
        })),

      addAlert: (alertData) =>
        set((state) => ({
          alerts: [
            ...state.alerts,
            {
              ...alertData,
              id: Math.random().toString(36).substr(2, 9),
            },
          ],
        })),

      removeAlert: (id) =>
        set((state) => ({
          alerts: state.alerts.filter(a => a.id !== id),
        })),

      toggleAlert: (id) =>
        set((state) => ({
          alerts: state.alerts.map(a =>
            a.id === id ? { ...a, active: !a.active } : a
          ),
        })),

      triggerAlert: (id) =>
        set((state) => ({
          alerts: state.alerts.map(a =>
            a.id === id
              ? { ...a, triggered: true, lastTriggered: new Date() }
              : a
          ),
        })),

      getTotalValue: () => {
        const { holdings, prices } = get();
        return holdings.reduce((total, holding) => {
          const price = prices[holding.symbol];
          return total + (price ? price.current * holding.amount : 0);
        }, 0);
      },

      getPortfolioData: () => {
        const { holdings, prices } = get();
        const totalValue = get().getTotalValue();
        
        return holdings
          .map(holding => {
            const price = prices[holding.symbol];
            const value = price ? price.current * holding.amount : 0;
            
            return {
              symbol: holding.symbol,
              amount: holding.amount,
              value,
              change24h: price?.change24h || 0,
              percentage: totalValue > 0 ? (value / totalValue) * 100 : 0,
            };
          })
          .sort((a, b) => b.value - a.value);
      },
    }),
    {
      name: 'portfolio-store',
      partialize: (state) => ({
        holdings: state.holdings,
        alerts: state.alerts,
      }),
    }
  )
); 