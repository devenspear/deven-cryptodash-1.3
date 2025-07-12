import axios from 'axios';
import { Price, OnChainMetrics } from './types';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';
const DEFILLAMA_API = 'https://api.llama.fi';

const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 60000; // 1 minute

export async function fetchPrices(symbols: string[]): Promise<Price[]> {
  const cacheKey = `prices-${symbols.join(',')}`;
  const cached = cache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  try {
    const symbolToId: Record<string, string> = {
      BTC: 'bitcoin',
      ETH: 'ethereum',
      SOL: 'solana',
      ADA: 'cardano',
      XRP: 'ripple',
      DOT: 'polkadot',
      MATIC: 'matic-network',
      DOGE: 'dogecoin',
      SHIB: 'shiba-inu',
      LINK: 'chainlink',
      UNI: 'uniswap',
      LTC: 'litecoin',
      ALGO: 'algorand',
      XLM: 'stellar',
      HBAR: 'hedera',
      ICP: 'internet-computer',
      NEAR: 'near',
      ZEC: 'zcash',
      MANA: 'decentraland',
      PEPE: 'pepe',
      SUI: 'sui',
      ONDO: 'ondo-finance',
      AIOZ: 'aioz-network',
      PRO: 'propy',
      // Additional mappings for missing tokens
      WLFI: 'world-liberty-financial',
      AI16Z: 'ai16z',
      DOGINME: 'doginme',
      // Note: DSYNC, HASHAI, VERT may not be available on CoinGecko
      // You can replace these with other tokens or find their correct CoinGecko IDs
    };

    const ids = symbols
      .map(s => symbolToId[s])
      .filter(Boolean)
      .join(',');
    
    if (!ids) {
      return symbols.map(symbol => ({
        symbol,
        current: 0,
        change24h: 0,
        change7d: 0,
        change30d: 0,
      }));
    }
    
    // Use CoinGecko's markets endpoint which provides more data
    const response = await axios.get(`${COINGECKO_API}/coins/markets`, {
      params: {
        ids,
        vs_currency: 'usd',
        price_change_percentage: '24h,7d,30d',
        per_page: 250,
      },
    });
    
    const prices: Price[] = symbols.map(symbol => {
      const id = symbolToId[symbol];
      const coinData = response.data.find((coin: any) => coin.id === id);
      
      if (!coinData) {
        return {
          symbol,
          current: 0,
          change24h: 0,
          change7d: 0,
          change30d: 0,
        };
      }
    
      return {
        symbol,
        current: coinData.current_price || 0,
        change24h: coinData.price_change_percentage_24h || 0,
        change7d: coinData.price_change_percentage_7d_in_currency || 0,
        change30d: coinData.price_change_percentage_30d_in_currency || 0,
        marketCap: coinData.market_cap || 0,
        volume24h: coinData.total_volume || 0,
      };
    });
    
    cache.set(cacheKey, { data: prices, timestamp: Date.now() });
    return prices;
  } catch (error) {
    console.error('Error fetching prices:', error);
    return symbols.map(symbol => ({
      symbol,
      current: 0,
      change24h: 0,
      change7d: 0,
      change30d: 0,
    }));
  }
}

export async function fetchOnChainMetrics(symbol: string): Promise<OnChainMetrics | null> {
  const cacheKey = `metrics-${symbol}`;
  const cached = cache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_DURATION * 5) { // 5 minute cache
    return cached.data;
  }

  try {
    // Mock data for demonstration - replace with real API calls
    const mockMetrics: Record<string, OnChainMetrics> = {
      ETH: {
        symbol: 'ETH',
        tvl: 45000000000,
        transactionVolume: 12000000000,
        activeAddresses: 750000,
        gasUsed: 15000000,
      },
      SOL: {
        symbol: 'SOL',
        tvl: 8500000000,
        transactionVolume: 3500000000,
        activeAddresses: 450000,
      },
      BTC: {
        symbol: 'BTC',
        tvl: 0,
        transactionVolume: 8000000000,
        activeAddresses: 1000000,
      },
    };

    const metrics = mockMetrics[symbol] || null;
    
    if (metrics) {
      cache.set(cacheKey, { data: metrics, timestamp: Date.now() });
    }
    
    return metrics;
  } catch (error) {
    console.error('Error fetching on-chain metrics:', error);
    return null;
  }
}

export function formatNumber(num: number): string {
  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
  return `$${num.toFixed(2)}`;
}

export function formatPrice(price: number): string {
  if (price < 0.01) return `$${price.toFixed(6)}`;
  if (price < 1) return `$${price.toFixed(4)}`;
  if (price < 100) return `$${price.toFixed(2)}`;
  return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
} 