export interface Holding {
  symbol: string;
  amount: number;
  category?: string;
}

export interface Price {
  symbol: string;
  current: number;
  change24h: number;
  marketCap?: number;
  volume24h?: number;
}

export interface OnChainMetrics {
  symbol: string;
  tvl?: number;
  transactionVolume?: number;
  activeAddresses?: number;
  gasUsed?: number;
}

export interface Alert {
  id: string;
  symbol: string;
  type: 'price_above' | 'price_below' | 'volume_spike' | 'tvl_change';
  threshold: number;
  active: boolean;
  triggered?: boolean;
  lastTriggered?: Date;
}

export interface Portfolio {
  holdings: Holding[];
  totalValue: number;
  lastUpdated: Date;
}

export interface PortfolioPosition {
  symbol: string;
  amount: number;
  currentPrice: number;
  value: number;
  change24h: number;
  category: string;
  riskLevel: 'low' | 'medium' | 'high';
} 