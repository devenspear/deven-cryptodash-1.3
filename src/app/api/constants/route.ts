import { NextResponse } from 'next/server';
import { DEFAULT_HOLDINGS } from '@/lib/constants';

export async function GET() {
  return NextResponse.json({
    timestamp: new Date().toISOString(),
    totalHoldings: DEFAULT_HOLDINGS.length,
    firstFive: DEFAULT_HOLDINGS.slice(0, 5),
    lastFive: DEFAULT_HOLDINGS.slice(-5),
    hasNewTokens: {
      PEPE: !!DEFAULT_HOLDINGS.find(h => h.symbol === 'PEPE'),
      TRUMP: !!DEFAULT_HOLDINGS.find(h => h.symbol === 'TRUMP'),
      RIO: !!DEFAULT_HOLDINGS.find(h => h.symbol === 'RIO'),
      AIXBT: !!DEFAULT_HOLDINGS.find(h => h.symbol === 'AIXBT'),
    }
  });
} 