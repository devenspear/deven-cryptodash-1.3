# Crypto Portfolio Dashboard

A modern, real-time cryptocurrency portfolio tracking dashboard built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 🚀 **Real-time Price Tracking** - Live cryptocurrency prices from CoinGecko API
- 📊 **Portfolio Management** - Track your holdings with detailed analytics
- 📈 **Interactive Charts** - Beautiful portfolio allocation charts using Chart.js
- 🔔 **Price Alerts** - Set up notifications for price movements
- 🎨 **Dark Theme** - Modern dark UI with gradient effects
- 📱 **Responsive Design** - Works perfectly on all devices
- ⚡ **Fast Performance** - Optimized with React Query for data fetching
- 🔧 **Admin Panel** - Easy portfolio management interface

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: TanStack React Query
- **Charts**: Chart.js with react-chartjs-2
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd crypto-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env.local
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin panel page
│   ├── alerts/            # Alerts management page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Dashboard page
│   └── providers.tsx      # React Query provider
├── components/            # React components
│   ├── HoldingsTable.tsx  # Portfolio holdings table
│   ├── Navbar.tsx         # Navigation component
│   ├── PortfolioChart.tsx # Portfolio allocation chart
│   └── PortfolioOverview.tsx # Portfolio metrics
├── hooks/                 # Custom React hooks
│   └── usePrices.ts       # Price fetching hook
└── lib/                   # Utility libraries
    ├── api.ts             # API functions
    ├── constants.ts       # App constants
    ├── store.ts           # Zustand store
    ├── types.ts           # TypeScript types
    └── utils.ts           # Utility functions
```

## Default Portfolio

The dashboard comes pre-configured with a sample portfolio including:

- **Layer 1 Blockchains**: ETH, SOL, BTC, ADA, DOT, NEAR, ICP, HBAR, ALGO, SUI, XLM
- **Layer 2 Solutions**: MATIC, OP, ARB
- **DeFi Tokens**: UNI, LINK, ONDO, AAVE, CRV, SUSHI
- **Payment/Transfer**: XRP, LTC
- **Meme Coins**: DOGE, SHIB, PEPE, DOGINME, WIF, BONK
- **Gaming/Metaverse**: MANA, SAND, AXS, ENJ
- **AI Tokens**: AIOZ, AI16Z, HASHAI, VERT, FET, AGIX
- **Privacy**: ZEC, XMR, DASH
- **Other**: PRO, DSYNC, WLFI

## Features Overview

### Dashboard
- Real-time portfolio value and 24h changes
- Portfolio allocation by category
- Holdings table with prices and performance
- Quick stats and metrics

### Admin Panel
- Add new cryptocurrency holdings
- Edit existing holding amounts
- Remove holdings from portfolio
- Real-time updates with toast notifications

### Alerts System
- Create price alerts (above/below thresholds)
- Volume spike notifications
- TVL change alerts
- Toggle alerts on/off
- Alert history tracking

## API Integration

The dashboard uses the CoinGecko API for real-time cryptocurrency data:

- Price data updates every 30 seconds
- Market cap and volume information
- 24-hour price change percentages
- Automatic caching for performance

## Customization

### Adding New Cryptocurrencies

1. Update the `symbolToId` mapping in `src/lib/api.ts`
2. Add the symbol to appropriate category in `src/lib/constants.ts`
3. The new cryptocurrency will be available in the admin panel

### Styling

The project uses Tailwind CSS with custom crypto-themed colors:

- `crypto-dark`: Main background color
- `crypto-card`: Card background color
- `crypto-accent`: Primary accent color (cyan)
- `crypto-success`: Success/positive color (green)
- `crypto-danger`: Error/negative color (red)
- `crypto-warning`: Warning color (yellow)
- `crypto-purple`: Secondary accent color

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with default settings

### Other Platforms

The app can be deployed to any platform that supports Next.js:

```bash
npm run build
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For support, please open an issue on GitHub or contact the development team.

---

Built by Deven using ClaudeAI # Environment variables configured for production
