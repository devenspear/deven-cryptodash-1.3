import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import axios from 'axios';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Utility to fetch CoinGecko token list and map to portfolio symbols
export async function generateCoinGeckoMapping(portfolioSymbols: string[]) {
  const url = 'https://api.coingecko.com/api/v3/coins/list';
  const { data: coins } = await axios.get(url);
  // Build a mapping: symbol (upper) -> [CoinGecko IDs]
  const symbolMap: Record<string, Array<{id: string, name: string}>> = {};
  for (const coin of coins) {
    const symbol = coin.symbol.toUpperCase();
    if (!symbolMap[symbol]) symbolMap[symbol] = [];
    symbolMap[symbol].push({ id: coin.id, name: coin.name });
  }
  // For each portfolio symbol, find best CoinGecko ID match
  const mapping: Record<string, string> = {};
  for (const symbol of portfolioSymbols) {
    const matches = symbolMap[symbol.toUpperCase()];
    if (matches && matches.length === 1) {
      mapping[symbol] = matches[0].id;
    } else if (matches && matches.length > 1) {
      // Prefer exact name match if possible
      const exact = matches.find(m => m.name.toUpperCase() === symbol.toUpperCase());
      mapping[symbol] = exact ? exact.id : matches[0].id;
    } else {
      mapping[symbol] = '';
    }
  }
  return mapping;
} 