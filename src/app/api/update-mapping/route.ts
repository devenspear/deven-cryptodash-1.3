import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

let symbolToCoingeckoId: Record<string, string> = {};
let lastMappingUpdate: string | null = null;
let lastMappingDetails: Array<{symbol: string, id: string, name?: string, status: 'success' | 'not_found'}> = [];

const PORTFOLIO_SYMBOLS = [
  '0X0','ADA','AI16Z','AIOZ','AIXBT','ALGO','APE','ARB','BEAM','BTC','DOGE','DOGINME','DOT','DSYNC','ETH','FET','HASHAI','HBAR','HNT','ICP','LINK','LTC','MANA','MATIC','NEAR','ONDO','PAAL','PEPE','PRO','RIO','RNDR','SHIB','SOL','SUI','TAO','TRUMP','UNI','USDT','VERTAI','WLFI','XLM','XRP','ZEC'
];

async function fetchCoinGeckoMapping(symbols: string[]) {
  const url = 'https://api.coingecko.com/api/v3/coins/list';
  const { data: coins } = await axios.get(url);
  const symbolMap: Record<string, Array<{id: string, name: string}>> = {};
  for (const coin of coins) {
    const symbol = coin.symbol.toUpperCase();
    if (!symbolMap[symbol]) symbolMap[symbol] = [];
    symbolMap[symbol].push({ id: coin.id, name: coin.name });
  }
  const mapping: Record<string, string> = {};
  const details: Array<{symbol: string, id: string, name?: string, status: 'success' | 'not_found'}> = [];
  for (const symbol of symbols) {
    const matches = symbolMap[symbol.toUpperCase()];
    if (matches && matches.length === 1) {
      mapping[symbol] = matches[0].id;
      details.push({ symbol, id: matches[0].id, name: matches[0].name, status: 'success' });
    } else if (matches && matches.length > 1) {
      const exact = matches.find(m => m.name.toUpperCase() === symbol.toUpperCase());
      const chosen = exact ? exact : matches[0];
      mapping[symbol] = chosen.id;
      details.push({ symbol, id: chosen.id, name: chosen.name, status: 'success' });
    } else {
      mapping[symbol] = '';
      details.push({ symbol, id: '', status: 'not_found' });
    }
  }
  return { mapping, details };
}

export async function POST(request: NextRequest) {
  try {
    const { mapping, details } = await fetchCoinGeckoMapping(PORTFOLIO_SYMBOLS);
    symbolToCoingeckoId = mapping;
    lastMappingDetails = details;
    lastMappingUpdate = new Date().toISOString();
    const failed = details.filter(d => d.status === 'not_found').map(d => d.symbol);
    return NextResponse.json({
      success: true,
      mapping,
      details,
      failed,
      updatedAt: lastMappingUpdate
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message });
  }
}

export async function GET() {
  return NextResponse.json({
    mapping: symbolToCoingeckoId,
    details: lastMappingDetails,
    updatedAt: lastMappingUpdate
  });
} 