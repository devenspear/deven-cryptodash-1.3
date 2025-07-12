# Deven Crypto Dashboard

A secure, real-time cryptocurrency portfolio tracking dashboard built with Next.js, TypeScript, and Tailwind CSS.

## 🔒 Security Features

- **Server-side Authentication**: JWT-based authentication with HTTP-only cookies
- **Route Protection**: Next.js middleware protecting sensitive routes
- **Brute Force Protection**: Request delays to prevent unauthorized access
- **Environment Variables**: Secure configuration management
- **Production Ready**: Enterprise-grade security for public deployment

## ✨ Features

- 🚀 **Real-time Price Tracking** - Live cryptocurrency prices from CoinGecko API
- 📊 **Portfolio Management** - Track your holdings with detailed analytics
- 📈 **Interactive Charts** - Beautiful portfolio allocation charts using Chart.js
- 🔔 **Price Alerts** - Set up notifications for price movements
- 🎨 **Dark Theme** - Modern dark UI with gradient effects
- 📱 **Responsive Design** - Works perfectly on all devices
- ⚡ **Fast Performance** - Optimized with React Query for data fetching
- 🔧 **Admin Panel** - Secure portfolio management interface
- 🔗 **External Charts** - Direct links to CoinMarketCap charts
- 🛡️ **Secure Access** - Password-protected for public deployment

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: TanStack React Query
- **Charts**: Chart.js with react-chartjs-2
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Authentication**: JWT with HTTP-only cookies
- **Deployment**: Vercel-optimized

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/devenspear/DevenCryptoDash1.0.git
cd DevenCryptoDash
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env.local
```

4. Set environment variables in `.env.local`:
```bash
DASHBOARD_PASSWORD=your-secure-password
JWT_SECRET=your-jwt-secret-key
```

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:5001](http://localhost:5001) in your browser.

> **Note**: The app runs on port 5001 to avoid conflicts with macOS AirPlay Receiver on port 5000.

## 📁 Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin panel page (protected)
│   ├── alerts/            # Alerts management page
│   ├── api/               # API routes
│   │   └── auth/          # Authentication endpoints
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Dashboard page
│   └── providers.tsx      # React Query provider
├── components/            # React components
│   ├── HoldingsTable.tsx  # Portfolio holdings table with external links
│   ├── Navbar.tsx         # Navigation component
│   ├── PortfolioChart.tsx # Portfolio allocation chart
│   └── PortfolioOverview.tsx # Portfolio metrics
├── hooks/                 # Custom React hooks
│   └── usePrices.ts       # Price fetching hook
├── lib/                   # Utility libraries
│   ├── api.ts             # API functions
│   ├── constants.ts       # App constants
│   ├── store.ts           # Zustand store
│   ├── types.ts           # TypeScript types
│   └── utils.ts           # Utility functions
└── middleware.ts          # Next.js middleware for route protection
```

## 💼 Configured Portfolio

The dashboard is pre-configured with Deven's crypto portfolio including:

**Major Holdings:**
- **Bitcoin (BTC)**: 1.0
- **Ethereum (ETH)**: 14.141
- **Solana (SOL)**: 195.258
- **Cardano (ADA)**: 2,914.494
- **Polygon (MATIC)**: 804.68
- **XRP**: 3,218.38

**Meme Tokens:**
- **PEPE**: 325,100,000
- **Dogecoin (DOGE)**: 10,000.493
- **Shiba Inu (SHIB)**: 16,731,625.316

**And 20+ additional cryptocurrencies** across DeFi, Layer 2, AI, Gaming, and Privacy categories.

## 🎯 Features Overview

### 🏠 Dashboard
- Real-time portfolio value and 24h changes
- Portfolio allocation by category with interactive charts
- Holdings table with live prices and performance metrics
- Direct links to CoinMarketCap charts for detailed analysis
- Quick stats and portfolio insights

### 🔧 Admin Panel (Protected)
- **Secure Access**: Password authentication required
- Add new cryptocurrency holdings
- Edit existing holding amounts with inline editing
- Remove holdings from portfolio
- Real-time updates with toast notifications
- Automatic portfolio recalculation

### 🔔 Alerts System
- Create price alerts (above/below thresholds)
- Volume spike notifications
- TVL change alerts
- Toggle alerts on/off
- Alert history tracking
- Multiple alert types per cryptocurrency

## 🔑 Authentication & Security

### Login Process
1. Visit `/admin` or protected routes
2. Enter dashboard password
3. Secure JWT token stored in HTTP-only cookie
4. Automatic session management

### Security Features
- **JWT Authentication**: Secure token-based authentication
- **HTTP-only Cookies**: Tokens not accessible via JavaScript
- **Middleware Protection**: Server-side route protection
- **Brute Force Protection**: Delays on failed attempts
- **Environment Variables**: Secure credential storage

## 🌐 API Integration

### CoinGecko API
- Real-time price data updates every 30 seconds
- Market cap and volume information
- 24-hour price change percentages
- Automatic caching for optimal performance
- Error handling and retry logic

### External Integration
- **CoinMarketCap Links**: Direct chart access for detailed analysis
- Secure external link handling with proper security attributes

## 🎨 Customization

### Adding New Cryptocurrencies

1. Update the `symbolToId` mapping in `src/lib/api.ts`
2. Add the symbol to appropriate category in `src/lib/constants.ts`
3. Add to portfolio via the admin panel interface

### Theme Customization

Custom crypto-themed Tailwind CSS colors:
- `crypto-dark`: #0a0b1e (Main background)
- `crypto-card`: #1a1b2e (Card background)
- `crypto-accent`: #00d4ff (Primary cyan)
- `crypto-success`: #00ff88 (Success green)
- `crypto-danger`: #ff4757 (Error red)
- `crypto-warning`: #ffa726 (Warning yellow)
- `crypto-purple`: #7c4dff (Secondary purple)

## 🚀 Deployment

### Vercel (Recommended)

1. **GitHub Integration**: Already connected to https://github.com/devenspear/DevenCryptoDash1.0
2. **Environment Variables**: Set in Vercel dashboard:
   ```
   DASHBOARD_PASSWORD=CRYPTODASHp@ss2025
   JWT_SECRET=deven-crypto-dashboard-jwt-secret-key-super-secure-2025
   ```
3. **Automatic Deployment**: Deploys on every push to main branch

### Local Production Build

```bash
npm run build
npm start
```

### Environment Configuration

Required environment variables:
- `DASHBOARD_PASSWORD`: Password for accessing protected routes
- `JWT_SECRET`: Secret key for JWT token signing

## 🔧 Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Development Notes

- Hot reload enabled for all components
- TypeScript strict mode for type safety
- ESLint configuration for code quality
- Optimized for Next.js App Router

## 📊 Performance

- **React Query**: Efficient data fetching and caching
- **Code Splitting**: Automatic route-based splitting
- **Image Optimization**: Next.js built-in optimization
- **Bundle Analysis**: Optimized bundle size
- **Caching Strategy**: Smart API response caching

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **GitHub Issues**: Report bugs or request features
- **Repository**: https://github.com/devenspear/DevenCryptoDash1.0
- **Live Demo**: Deployed on Vercel with authentication

## 🙏 Acknowledgments

- **CoinGecko API**: Reliable cryptocurrency data
- **Next.js Team**: Amazing React framework
- **Vercel**: Excellent deployment platform
- **Tailwind CSS**: Beautiful utility-first CSS

---

**Built by Deven using Claude AI** 🤖

*A secure, professional-grade cryptocurrency portfolio dashboard ready for production deployment.*
# Updated: Fri Jul 11 22:25:47 EDT 2025
# Force redeploy Fri Jul 11 22:49:26 EDT 2025
