export type ScreenId =
  | 'home'
  | 'login'
  | 'register'
  | 'forgot-password'
  | 'dashboard'
  | 'market-charts'
  | 'indian-stocks'
  | 'indicators'
  | 'forex'
  | 'indices-and-sectors'
  | 'stock-screener'
  | 'stock-details'
  | 'indian-market-terminal'
  | 'forex-terminal'
  | 'trading-journal'
  | 'risk-reward-calculator'
  | 'impacted-news'
  | 'settings'
  | 'help-and-support';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
  specialty: string;
  plan: string;
  joinedDate: string;
}

export interface Candle {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface StockData {
  symbol: string;
  name: string;
  tickerTag: string;
  tradingViewSymbol?: string;
  exchange: string;
  sector: string;
  price: number;
  change: number;
  changePercent: number;
  open: number;
  dayHigh: number;
  dayLow: number;
  prevClose: number;
  volume: string;
  week52Low: number;
  week52High: number;
  rangePositionPercent: number;
  marketCapCr: string;
  marketCapUsd: string;
  peRatio: number;
  indPeRatio: number;
  pbRatio: number;
  pbEvaluation: string;
  epsTtm: number;
  epsGrowthYoY: string;
  dividendYield: number;
  dividendPerShare: string;
  beta1Y: number;
  betaVolatility: string;
  faceValue: number;
  series: string;
  bookValue: number;
  alphaSignalSummary: string;
  profile: string;
  segments: {
    name: string;
    sharePercent: number;
    description: string;
    icon: string;
  }[];
  shareholding: {
    promoters: number;
    fii: number;
    dii: number;
    retail: number;
  };
  analystRatings: {
    coverageHouses: number;
    buyPercent: number;
    holdPercent: number;
    sellPercent: number;
    consensusTarget: number;
    upsidePercent: number;
    targetHigh: number;
    targetLow: number;
    latestNoteAuthor: string;
    latestNoteStance: string;
    latestNoteQuote: string;
  };
  historicalAlpha: {
    period: string;
    stockReturn: number;
    benchmarkReturn: number;
    alpha: number;
  }[];
  financials: {
    year: string;
    revenueCr: number;
    ebitdaCr: number;
    netProfitCr: number;
    marginPercent: number;
  }[];
  quarterly: {
    quarter: string;
    revenueCr: number;
    netProfitCr: number;
    marginPercent: number;
    yoyGrowth: number;
  }[];
  corporateDetails?: {
    managingDirector: string;
    cfo: string;
    foundedYear: number;
    headquarters: string;
    employeesCount: string;
    isin: string;
    listingDate: string;
    websiteUrl: string;
    competitiveMoats: {
      title: string;
      description: string;
      icon: string;
    }[];
    keySubsidiaries: {
      name: string;
      focus: string;
      ownership: string;
    }[];
    growthCatalysts: string[];
    keyRisks: string[];
  };
}

export interface JournalEntry {
  id: string;
  date: string;
  symbol: string;
  direction: 'LONG' | 'SHORT';
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  netPnl: number;
  pnlPercent: number;
  strategy: 'Breakout' | 'Momentum' | 'Mean Reversion' | 'Pullback' | 'Trend Following';
  rrRatio: string;
  notes: string;
  status: 'WIN' | 'LOSS' | 'OPEN';
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  timeAgo: string;
  sentiment: 'Bullish' | 'Bearish' | 'Neutral';
  impact: 'High' | 'Medium' | 'Low';
  relatedTickers: string[];
  summary: string;
}

export interface PriceAlert {
  id: string;
  symbol: string;
  targetPrice: number;
  condition: 'ABOVE' | 'BELOW';
  createdAt: string;
  triggered: boolean;
}
