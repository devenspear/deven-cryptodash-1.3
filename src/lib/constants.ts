import { Holding } from './types';

export const CATEGORIES: Record<string, string[]> = {
  "Layer 1 Blockchains": ["ETH", "SOL", "BTC", "ADA", "DOT", "NEAR", "ICP", "HBAR", "ALGO", "SUI", "XLM"],
  "Layer 2 Solutions": ["MATIC", "OP", "ARB"],
  "DeFi Tokens": ["UNI", "LINK", "ONDO", "AAVE", "CRV", "SUSHI"],
  "Payment/Transfer": ["XRP", "LTC"],
  "Meme Coins": ["DOGE", "SHIB", "PEPE", "DOGINME", "WIF", "BONK"],
  "Gaming/Metaverse": ["MANA", "SAND", "AXS", "ENJ"],
  "AI Tokens": ["AIOZ", "AI16Z", "HASHAI", "VERT", "FET", "AGIX"],
  "Privacy": ["ZEC", "XMR", "DASH"],
  "Other": ["PRO", "DSYNC", "WLFI"]
};

export const CATEGORY_COLORS: Record<string, string> = {
  "Layer 1 Blockchains": "#3b82f6",
  "Layer 2 Solutions": "#8b5cf6",
  "DeFi Tokens": "#ec4899",
  "Payment/Transfer": "#22c55e",
  "Meme Coins": "#fb923c",
  "Gaming/Metaverse": "#a855f7",
  "AI Tokens": "#06b6d4",
  "Privacy": "#64748b",
  "Other": "#94a3b8"
};

export const RISK_LEVELS: Record<string, string> = {
  "Layer 1 Blockchains": "low",
  "Layer 2 Solutions": "low",
  "DeFi Tokens": "medium",
  "Payment/Transfer": "low",
  "Meme Coins": "high",
  "Gaming/Metaverse": "medium",
  "AI Tokens": "high",
  "Privacy": "medium",
  "Other": "high"
};

export const DEFAULT_HOLDINGS: Holding[] = [
  { symbol: "ETH", amount: 14.141 },
  { symbol: "SOL", amount: 195.258 },
  { symbol: "BTC", amount: 1 },
  { symbol: "PEPE", amount: 325100000 },
  { symbol: "ADA", amount: 2914.494 },
  { symbol: "MATIC", amount: 804.68 },
  { symbol: "XRP", amount: 3218.38 },
  { symbol: "SUI", amount: 2375.994 },
  { symbol: "XLM", amount: 13056.258 },
  { symbol: "DOGE", amount: 10000.493 },
  { symbol: "DOT", amount: 157.5 },
  { symbol: "UNI", amount: 103.427 },
  { symbol: "ICP", amount: 66.922 },
  { symbol: "HBAR", amount: 2889.634 },
  { symbol: "AIOZ", amount: 1292.762 },
  { symbol: "PRO", amount: 557.875 },
  { symbol: "NEAR", amount: 89.22 },
  { symbol: "LINK", amount: 23.926 },
  { symbol: "SHIB", amount: 16731625.316 },
  { symbol: "LTC", amount: 2.665 },
  { symbol: "ZEC", amount: 3.404 },
  { symbol: "ALGO", amount: 352.994 },
  { symbol: "MANA", amount: 271.692 },
  { symbol: "ONDO", amount: 379.784 },
  { symbol: "DOGINME", amount: 464310 },
  { symbol: "DSYNC", amount: 1085 },
  { symbol: "HASHAI", amount: 366536 },
  { symbol: "VERT", amount: 615.7 },
  { symbol: "AI16Z", amount: 1008 },
  { symbol: "WLFI", amount: 31821 }
];

export function getCategoryForSymbol(symbol: string): string {
  for (const [category, symbols] of Object.entries(CATEGORIES)) {
    if (symbols.includes(symbol)) {
      return category;
    }
  }
  return "Other";
} 