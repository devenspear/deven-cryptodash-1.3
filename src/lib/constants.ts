import { Holding } from './types';

export const CATEGORIES: Record<string, string[]> = {
  "Layer 1 Blockchains": ["ETH", "SOL", "BTC", "ADA", "DOT", "NEAR", "ICP", "HBAR", "ALGO", "SUI", "XLM"],
  "Layer 2 Solutions": ["MATIC", "ARB"],
  "DeFi Tokens": ["UNI", "LINK", "ONDO", "AAVE", "CRV", "SUSHI"],
  "Payment/Transfer": ["XRP", "LTC", "USDT"],
  "Meme Coins": ["DOGE", "SHIB", "PEPE", "DOGINME", "WIF", "BONK", "TRUMP"],
  "Gaming/Metaverse": ["MANA", "SAND", "AXS", "ENJ", "APE", "BEAM"],
  "AI Tokens": ["AIOZ", "AI16Z", "HASHAI", "VERTAI", "FET", "AGIX", "AIXBT", "PAAL", "TAO", "RNDR"],
  "Privacy": ["ZEC", "XMR", "DASH"],
  "Other": ["PRO", "DSYNC", "WLFI", "0X0", "RIO"]
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
  { symbol: "PEPE", amount: 32510000.0000 },
  { symbol: "SHIB", amount: 16731600.0000 },
  { symbol: "RIO", amount: 14576.0000 },
  { symbol: "XLM", amount: 13056.3000 },
  { symbol: "DOGE", amount: 10000.5000 },
  { symbol: "PAAL", amount: 9885.5000 },
  { symbol: "ARB", amount: 5818.2300 },
  { symbol: "BEAM", amount: 5634.0000 },
  { symbol: "FET", amount: 4242.7900 },
  { symbol: "XRP", amount: 4248.2400 },
  { symbol: "ADA", amount: 2921.8500 },
  { symbol: "HBAR", amount: 2889.6300 },
  { symbol: "ONDO", amount: 2812.6540 },
  { symbol: "SUI", amount: 2375.9900 },
  { symbol: "0X0", amount: 1597.0000 },
  { symbol: "USDT", amount: 1574.7000 },
  { symbol: "AIOZ", amount: 1293.2720 },
  { symbol: "DSYNC", amount: 1084.8200 },
  { symbol: "AIXBT", amount: 1008.9600 },
  { symbol: "MATIC", amount: 804.6800 },
  { symbol: "VERTAI", amount: 615.7000 },
  { symbol: "PRO", amount: 557.8750 },
  { symbol: "DOGINME", amount: 464310.0000 },
  { symbol: "HASHAI", amount: 366536.0000 },
  { symbol: "ALGO", amount: 352.9940 },
  { symbol: "APE", amount: 311.6500 },
  { symbol: "RNDR", amount: 306.2200 },
  { symbol: "MANA", amount: 271.6920 },
  { symbol: "AI16Z", amount: 216.9700 },
  { symbol: "SOL", amount: 198.2146 },
  { symbol: "DOT", amount: 157.5000 },
  { symbol: "UNI", amount: 103.4270 },
  { symbol: "LINK", amount: 89.7845 },
  { symbol: "NEAR", amount: 89.2200 },
  { symbol: "ICP", amount: 66.9215 },
  { symbol: "WLFI", amount: 31821.0000 },
  { symbol: "TRUMP", amount: 26.4900 },
  { symbol: "ETH", amount: 18.4697 },
  { symbol: "ZEC", amount: 3.4038 },
  { symbol: "LTC", amount: 2.6649 },
  { symbol: "BTC", amount: 1.0037 },
  { symbol: "TAO", amount: 1.0014 }
];

export function getCategoryForSymbol(symbol: string): string {
  for (const [category, symbols] of Object.entries(CATEGORIES)) {
    if (symbols.includes(symbol)) {
      return category;
    }
  }
  return "Other";
} 