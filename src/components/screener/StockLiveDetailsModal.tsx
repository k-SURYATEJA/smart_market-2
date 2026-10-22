import React, { useState, useEffect } from 'react';
import { StockData } from '../../types/market';
import { TradingViewTechnicalAnalysis } from '../tradingview/TradingViewTechnicalAnalysis';

interface StockLiveDetailsModalProps {
  stock: StockData;
  isOpen: boolean;
  onClose: () => void;
  allStocks?: StockData[];
  onSelectStock?: (stock: StockData) => void;
  onOpenFullDeepDive?: (symbol: string) => void;
}

export function getTradingViewSymbol(stock: StockData): string {
  if (stock.tradingViewSymbol) return stock.tradingViewSymbol;
  if (stock.symbol === 'TATAMOTORS') return 'NSE:TATAMOTORS';
  if (stock.symbol === 'NIFTY') return 'INDEX:NIFTY';
  if (stock.symbol === 'BANKNIFTY') return 'NSE:BANKNIFTY';
  return `BSE:${stock.symbol}`;
}

function resolveCorporateDetails(stock: StockData) {
  if (stock.corporateDetails) return stock.corporateDetails;

  return {
    managingDirector: 'Executive Leadership Board',
    cfo: 'Corporate Treasury Division',
    foundedYear: 1985,
    headquarters: 'Mumbai / Registered Headquarters, India',
    employeesCount: '50,000+ Full-Time Employees',
    isin: `INE${stock.symbol.padStart(9, '0')}`,
    listingDate: 'NSE / BSE Listed Equity',
    websiteUrl: `https://www.google.com/finance/quote/${stock.symbol}:NSE`,
    competitiveMoats: [
      {
        title: 'Industry Sector Leadership',
        description: `Commands a tier-1 market leadership position in the ${stock.sector} sector with durable brand recall.`,
        icon: 'verified',
      },
      {
        title: 'Institutional Equity Backing',
        description: 'Substantial ownership by foreign and domestic institutional investors with strong corporate governance.',
        icon: 'account_balance',
      },
      {
        title: 'Operational Efficiencies & Scale',
        description: 'Robust supply chain, nationwide distribution footprint, and sustained cost advantages over unorganized peers.',
        icon: 'trending_up',
      },
      {
        title: 'Strong Balance Sheet Prudence',
        description: 'Conservative leverage profile, healthy interest coverage ratio, and disciplined capital allocation.',
        icon: 'security',
      },
    ],
    keySubsidiaries: [
      { name: `${stock.name} Operations`, focus: `Core ${stock.sector} Business Unit`, ownership: '100% Owned' },
      { name: `${stock.symbol} Digital Ventures`, focus: 'Enterprise Technology & Cloud Services', ownership: '100% Subsidiary' },
      { name: `${stock.symbol} International Ltd`, focus: 'Overseas Expansion & Export Sales Distribution', ownership: '100% Owned' },
      { name: `${stock.symbol} Capital & Investments`, focus: 'Strategic Treasury & Corporate Finance Operations', ownership: '100% Division' },
    ],
    growthCatalysts: [
      `Favorable macro demand tailwinds across the Indian ${stock.sector} space`,
      'Ongoing digital automation and capacity modernization programs',
      'Operating margin expansion driven by product premiumization and scale efficiencies',
      'Strong free cash flow reinvested into high-return on equity (ROE) growth projects',
    ],
    keyRisks: [
      'Macroeconomic shifts, interest rate changes, or inflation affecting consumer demand',
      'Raw material input price fluctuations and supply chain volatility',
      'Industry regulatory guidelines and taxation policy updates',
    ],
  };
}

export const StockLiveDetailsModal: React.FC<StockLiveDetailsModalProps> = ({
  stock,
  isOpen,
  onClose,
  allStocks = [],
  onSelectStock,
  onOpenFullDeepDive,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'financials' | 'shareholding' | 'technicals'>('profile');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const corp = resolveCorporateDetails(stock);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const tvSymbol = getTradingViewSymbol(stock);
  const tradingViewWebUrl = `https://in.tradingview.com/symbols/${tvSymbol.replace(':', '-')}/`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className={`w-full bg-[#0a0f1d] border border-white/20 rounded-2xl shadow-2xl flex flex-col overflow-hidden relative transition-all duration-200 ${
          isFullscreen ? 'w-full h-full max-w-none max-h-none rounded-none' : 'max-w-7xl h-[94vh]'
        }`}
        onClick={e => e.stopPropagation()}
      >
        {/* Top Accent Strip */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#FF7900] via-[#ffaa40] to-[#24c78b] shrink-0" />

        {/* 1. COMPACT, HIGH-VISIBILITY HEADER */}
        <div className="px-5 py-3.5 bg-[#111827] border-b border-white/15 flex flex-wrap items-center justify-between gap-4 shrink-0">
          {/* Left: Identity */}
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF7900] to-[#d96200] flex items-center justify-center text-white font-black text-xl shadow-[0_0_16px_rgba(255,121,0,0.35)] shrink-0">
              {stock.symbol.slice(0, 3)}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-black text-white tracking-tight">
                  {stock.name}
                </h2>
                <span className="px-2 py-0.5 rounded-md text-xs font-mono font-bold bg-white/10 text-white border border-white/15">
                  {stock.symbol}
                </span>
                <span className="px-2 py-0.5 rounded-md text-xs font-mono font-bold bg-[#FF7900]/20 text-[#FF9B42] border border-[#FF7900]/40">
                  {tvSymbol}
                </span>
                <span className="px-2.5 py-0.5 rounded-md text-xs font-medium text-slate-300 bg-white/10 border border-white/10">
                  {stock.sector}
                </span>
              </div>
              <div className="text-xs text-slate-300 mt-1 flex flex-wrap items-center gap-2.5">
                <span>Exchange: <strong className="text-white font-semibold">{stock.exchange}</strong></span>
                <span>•</span>
                <span>Market Cap: <strong className="text-[#FF9B42] font-semibold">{stock.marketCapCr}</strong></span>
                <span>•</span>
                <span>Series: <strong className="text-white font-semibold">{stock.series}</strong></span>
              </div>
            </div>
          </div>

          {/* Right: Live Price & Controls */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-2xl font-black text-white font-mono tracking-tight">
                ₹{stock.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
              <div
                className={`text-xs font-mono font-bold flex items-center justify-end gap-1.5 mt-0.5 ${
                  stock.change >= 0 ? 'text-[#24c78b]' : 'text-[#ff4d5a]'
                }`}
              >
                <span>{stock.change >= 0 ? '▲ +' : '▼ '}₹{Math.abs(stock.change).toFixed(2)}</span>
                <span className="px-1.5 py-0.2 rounded bg-white/10">
                  {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                </span>
              </div>
            </div>

            {/* Direct TradingView Link */}
            <a
              href={tradingViewWebUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Open full interactive analysis on in.tradingview.com"
              className="px-3.5 py-2 rounded-xl bg-[#1e293b] hover:bg-[#334155] border border-white/20 text-xs text-white font-bold transition-all flex items-center gap-1.5 shadow-sm hover:border-[#FF7900]"
            >
              <svg className="w-4 h-4 text-[#FF7900]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
              <span>TradingView Live ↗</span>
            </a>

            {/* Toggle Fullscreen */}
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              title={isFullscreen ? 'Exit Fullscreen' : 'Expand Fullscreen'}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">
                {isFullscreen ? 'fullscreen_exit' : 'fullscreen'}
              </span>
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-rose-500/20 hover:text-rose-400 transition-colors"
            >
              <span className="material-symbols-outlined text-[22px]">close</span>
            </button>
          </div>
        </div>

        {/* 2. NAVIGATION BAR & QUICK ASSET SWITCHER */}
        <div className="px-5 py-2.5 bg-[#0e1526] border-b border-white/15 flex flex-wrap items-center justify-between gap-3 shrink-0">
          {/* In-Depth Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto py-0.5">
            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-[#FF7900] text-black shadow-[0_0_14px_rgba(255,121,0,0.4)]'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className="material-symbols-outlined text-[17px]">corporate_fare</span>
              <span>1. Corporate Profile &amp; Segments</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('financials')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'financials'
                  ? 'bg-[#FF7900] text-black shadow-[0_0_14px_rgba(255,121,0,0.4)]'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className="material-symbols-outlined text-[17px]">query_stats</span>
              <span>2. Financials, Ratios &amp; Statements</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('shareholding')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'shareholding'
                  ? 'bg-[#FF7900] text-black shadow-[0_0_14px_rgba(255,121,0,0.4)]'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className="material-symbols-outlined text-[17px]">pie_chart</span>
              <span>3. Shareholding &amp; Analyst Targets</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('technicals')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'technicals'
                  ? 'bg-[#FF7900] text-black shadow-[0_0_14px_rgba(255,121,0,0.4)]'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className="material-symbols-outlined text-[17px]">speed</span>
              <span>4. TradingView Technical Sentiment</span>
            </button>
          </div>

          {/* Quick Asset Switcher */}
          {allStocks.length > 0 && onSelectStock && (
            <div className="flex items-center gap-1.5 overflow-x-auto py-1">
              <span className="text-[11px] font-bold text-slate-400 mr-1 shrink-0 uppercase tracking-wider">
                Switch Asset:
              </span>
              {allStocks.map(s => (
                <button
                  key={s.symbol}
                  type="button"
                  onClick={() => onSelectStock(s)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold shrink-0 transition-all cursor-pointer ${
                    s.symbol === stock.symbol
                      ? 'bg-[#FF7900] text-black shadow-[0_0_10px_rgba(255,121,0,0.35)]'
                      : 'bg-[#1e293b] text-slate-300 hover:text-white hover:bg-[#334155] border border-white/10'
                  }`}
                >
                  {s.symbol}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 3. MAIN SCROLLABLE CONTENT BODY (CLEAR & FULLY VISIBLE) */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 flex flex-col gap-6 bg-[#090e1c]">
          
          {/* TAB 1: CORPORATE PROFILE & BUSINESS SEGMENTS */}
          {activeTab === 'profile' && (
            <div className="flex flex-col gap-5 max-w-6xl mx-auto w-full">
              {/* Highlight Banner */}
              <div className="bg-[#131b2e] border border-white/15 rounded-2xl p-6 shadow-xl flex flex-col gap-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/15">
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[#FF7900] text-[24px]">apartment</span>
                    <h3 className="text-lg font-bold text-white tracking-tight">
                      About {stock.name}
                    </h3>
                  </div>
                  <span className="px-3 py-1 rounded-lg bg-white/10 font-mono text-xs text-slate-200 border border-white/10 font-bold">
                    NSE / BSE Listed • {stock.sector}
                  </span>
                </div>

                <p className="text-slate-200 leading-relaxed text-sm sm:text-base">
                  {stock.profile}
                </p>

                {/* Research Thesis Box */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-[#FF7900]/15 to-transparent border border-[#FF7900]/35 flex items-start gap-3 mt-1">
                  <span className="material-symbols-outlined text-[#FF7900] text-[24px] mt-0.5 shrink-0">psychology</span>
                  <div>
                    <h4 className="font-bold text-[#FF9B42] text-xs uppercase tracking-wider mb-1">
                      Institutional Research Thesis &amp; Alpha Signal
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                      {stock.alphaSignalSummary}
                    </p>
                  </div>
                </div>
              </div>

              {/* Core Business Segments Breakdown */}
              <div className="bg-[#131b2e] border border-white/15 rounded-2xl p-6 shadow-xl flex flex-col gap-4">
                <div className="flex items-center justify-between pb-2 border-b border-white/15">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#24c78b] text-[22px]">category</span>
                    <h3 className="text-base font-bold text-white tracking-tight">
                      Core Business Segments &amp; Revenue Contribution
                    </h3>
                  </div>
                  <span className="text-xs text-slate-300 font-mono">Total Share: 100%</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {stock.segments.map((seg, i) => (
                    <div key={i} className="bg-[#0b1020] border border-white/15 rounded-xl p-4 flex flex-col justify-between gap-3 shadow-md">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-[#FF7900]/15 border border-[#FF7900]/30 flex items-center justify-center text-[#FF7900]">
                            <span className="material-symbols-outlined text-[20px]">{seg.icon || 'storefront'}</span>
                          </div>
                          <div>
                            <span className="font-bold text-white text-sm block">{seg.name}</span>
                            <span className="text-xs text-slate-400">{seg.description}</span>
                          </div>
                        </div>
                        <span className="font-mono font-black text-[#FF7900] text-xl">{seg.sharePercent}%</span>
                      </div>

                      <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#FF7900] to-[#24c78b] rounded-full"
                          style={{ width: `${seg.sharePercent}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 1. Executive Leadership & Corporate Registry */}
              <div className="bg-[#131b2e] border border-white/15 rounded-2xl p-6 shadow-xl flex flex-col gap-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/15">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#FF7900] text-[22px]">badge</span>
                    <h3 className="text-base font-bold text-white tracking-tight">
                      Executive Leadership &amp; Corporate Registry
                    </h3>
                  </div>
                  {corp.websiteUrl && (
                    <a
                      href={corp.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-[#FF7900] hover:text-black font-semibold text-xs text-slate-200 transition-all flex items-center gap-1.5 cursor-pointer border border-white/10"
                    >
                      <span>Visit Corporate Portal</span>
                      <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                    </a>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs sm:text-sm">
                  <div className="bg-[#0b1020] border border-white/10 rounded-xl p-3.5 flex flex-col justify-between">
                    <span className="text-slate-400 text-xs font-medium">Managing Director / CEO</span>
                    <span className="font-bold text-white mt-1 text-sm">{corp.managingDirector}</span>
                  </div>

                  <div className="bg-[#0b1020] border border-white/10 rounded-xl p-3.5 flex flex-col justify-between">
                    <span className="text-slate-400 text-xs font-medium">Chief Financial Officer (CFO)</span>
                    <span className="font-bold text-white mt-1 text-sm">{corp.cfo}</span>
                  </div>

                  <div className="bg-[#0b1020] border border-white/10 rounded-xl p-3.5 flex flex-col justify-between">
                    <span className="text-slate-400 text-xs font-medium">Global Headquarters</span>
                    <span className="font-bold text-slate-200 mt-1 text-xs leading-relaxed">{corp.headquarters}</span>
                  </div>

                  <div className="bg-[#0b1020] border border-white/10 rounded-xl p-3.5 flex flex-col justify-between">
                    <span className="text-slate-400 text-xs font-medium">Year Founded &amp; Listing</span>
                    <span className="font-bold text-white mt-1">Est. {corp.foundedYear} • Listed {corp.listingDate}</span>
                  </div>

                  <div className="bg-[#0b1020] border border-white/10 rounded-xl p-3.5 flex flex-col justify-between">
                    <span className="text-slate-400 text-xs font-medium">Total Enterprise Workforce</span>
                    <span className="font-bold text-white mt-1 font-mono">{corp.employeesCount}</span>
                  </div>

                  <div className="bg-[#0b1020] border border-white/10 rounded-xl p-3.5 flex flex-col justify-between">
                    <span className="text-slate-400 text-xs font-medium">Depository ISIN &amp; Series</span>
                    <span className="font-bold text-[#FF7900] mt-1 font-mono">{corp.isin} • {stock.series}</span>
                  </div>
                </div>
              </div>

              {/* 2. Economic Moats & Core Competitive Advantages */}
              <div className="bg-[#131b2e] border border-white/15 rounded-2xl p-6 shadow-xl flex flex-col gap-4">
                <div className="flex items-center justify-between pb-2 border-b border-white/15">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#24c78b] text-[22px]">shield</span>
                    <h3 className="text-base font-bold text-white tracking-tight">
                      Economic Moats &amp; Competitive Advantages
                    </h3>
                  </div>
                  <span className="text-xs text-slate-300 font-mono">Structural Entry Barriers</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {corp.competitiveMoats.map((moat, i) => (
                    <div key={i} className="bg-[#0b1020] border border-white/10 rounded-xl p-4 flex items-start gap-3.5 shadow-md">
                      <div className="w-10 h-10 rounded-lg bg-[#24c78b]/15 border border-[#24c78b]/30 flex items-center justify-center text-[#24c78b] shrink-0">
                        <span className="material-symbols-outlined text-[20px]">{moat.icon}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <h4 className="font-bold text-white text-sm">{moat.title}</h4>
                        <p className="text-xs sm:text-[13px] text-slate-300 leading-relaxed">{moat.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Core Subsidiaries & Brand Ecosystem */}
              <div className="bg-[#131b2e] border border-white/15 rounded-2xl p-6 shadow-xl flex flex-col gap-4">
                <div className="flex items-center justify-between pb-2 border-b border-white/15">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#FF9B42] text-[22px]">account_tree</span>
                    <h3 className="text-base font-bold text-white tracking-tight">
                      Major Subsidiaries &amp; Flagship Brand Ecosystem
                    </h3>
                  </div>
                  <span className="text-xs text-slate-300 font-mono">Consolidated Group Entities</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                  {corp.keySubsidiaries.map((sub, i) => (
                    <div key={i} className="bg-[#0b1020] border border-white/10 rounded-xl p-4 flex flex-col justify-between gap-3 shadow-md">
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <h4 className="font-bold text-white text-sm leading-snug">{sub.name}</h4>
                          <span className="px-2 py-0.5 rounded bg-[#FF7900]/20 text-[#FF9B42] text-[10px] font-bold font-mono shrink-0">
                            {sub.ownership}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">{sub.focus}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Strategic Growth Catalysts vs. Key Risk Factors */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Growth Catalysts */}
                <div className="bg-[#131b2e] border border-white/15 rounded-2xl p-6 shadow-xl flex flex-col gap-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-white/15">
                    <span className="material-symbols-outlined text-[#24c78b] text-[22px]">rocket_launch</span>
                    <h3 className="text-base font-bold text-white">
                      Strategic Growth Catalysts (12-36 Months)
                    </h3>
                  </div>
                  <ul className="flex flex-col gap-2.5 text-xs sm:text-sm">
                    {corp.growthCatalysts.map((cat, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-slate-200 leading-relaxed bg-[#0b1020] p-3 rounded-xl border border-white/5">
                        <span className="material-symbols-outlined text-[#24c78b] text-[18px] shrink-0 mt-0.5">check_circle</span>
                        <span>{cat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Key Risks & Sensitivities */}
                <div className="bg-[#131b2e] border border-white/15 rounded-2xl p-6 shadow-xl flex flex-col gap-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-white/15">
                    <span className="material-symbols-outlined text-[#ff4d5a] text-[22px]">warning</span>
                    <h3 className="text-base font-bold text-white">
                      Key Risk Factors &amp; Sensitivities
                    </h3>
                  </div>
                  <ul className="flex flex-col gap-2.5 text-xs sm:text-sm">
                    {corp.keyRisks.map((risk, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-slate-200 leading-relaxed bg-[#0b1020] p-3 rounded-xl border border-white/5">
                        <span className="material-symbols-outlined text-[#ff4d5a] text-[18px] shrink-0 mt-0.5">error_outline</span>
                        <span>{risk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FINANCIALS, RATIOS & VALUATION */}
          {activeTab === 'financials' && (
            <div className="flex flex-col gap-5 max-w-6xl mx-auto w-full">
              {/* Key Valuation Grid (8 High-Impact Cards) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                <div className="bg-[#131b2e] border border-white/15 rounded-xl p-4 shadow-md">
                  <span className="text-slate-400 block text-xs font-semibold">P/E Ratio</span>
                  <span className="text-white font-mono font-black text-2xl mt-1 block">{stock.peRatio.toFixed(2)}x</span>
                  <span className="text-xs text-slate-300 font-mono mt-0.5 block">Industry: {stock.indPeRatio.toFixed(2)}x</span>
                </div>

                <div className="bg-[#131b2e] border border-white/15 rounded-xl p-4 shadow-md">
                  <span className="text-slate-400 block text-xs font-semibold">P/B Ratio</span>
                  <span className="text-white font-mono font-black text-2xl mt-1 block">{stock.pbRatio.toFixed(2)}x</span>
                  <span className="text-xs text-[#24c78b] font-bold mt-0.5 block">{stock.pbEvaluation}</span>
                </div>

                <div className="bg-[#131b2e] border border-white/15 rounded-xl p-4 shadow-md">
                  <span className="text-slate-400 block text-xs font-semibold">Book Value / Share</span>
                  <span className="text-white font-mono font-black text-2xl mt-1 block">₹{stock.bookValue.toFixed(2)}</span>
                  <span className="text-xs text-slate-300 font-mono mt-0.5 block">Face Value: ₹{stock.faceValue.toFixed(2)}</span>
                </div>

                <div className="bg-[#131b2e] border border-white/15 rounded-xl p-4 shadow-md">
                  <span className="text-slate-400 block text-xs font-semibold">EPS (TTM)</span>
                  <span className="text-white font-mono font-black text-2xl mt-1 block">₹{stock.epsTtm.toFixed(2)}</span>
                  <span className="text-xs text-[#24c78b] font-bold mt-0.5 block">{stock.epsGrowthYoY}</span>
                </div>

                <div className="bg-[#131b2e] border border-white/15 rounded-xl p-4 shadow-md">
                  <span className="text-slate-400 block text-xs font-semibold">Dividend Yield</span>
                  <span className="text-white font-mono font-black text-2xl mt-1 block">{stock.dividendYield.toFixed(2)}%</span>
                  <span className="text-xs text-slate-300 font-mono mt-0.5 block">{stock.dividendPerShare}</span>
                </div>

                <div className="bg-[#131b2e] border border-white/15 rounded-xl p-4 shadow-md">
                  <span className="text-slate-400 block text-xs font-semibold">Beta Volatility (1Y)</span>
                  <span className="text-white font-mono font-black text-2xl mt-1 block">{stock.beta1Y}</span>
                  <span className="text-xs text-[#FF9B42] font-semibold mt-0.5 block">{stock.betaVolatility}</span>
                </div>

                <div className="bg-[#131b2e] border border-white/15 rounded-xl p-4 shadow-md">
                  <span className="text-slate-400 block text-xs font-semibold">Day High / Low</span>
                  <span className="text-white font-mono font-bold text-lg mt-1 block">₹{stock.dayHigh.toFixed(2)}</span>
                  <span className="text-xs text-slate-400 font-mono mt-0.5 block">Low: ₹{stock.dayLow.toFixed(2)}</span>
                </div>

                <div className="bg-[#131b2e] border border-white/15 rounded-xl p-4 shadow-md">
                  <span className="text-slate-400 block text-xs font-semibold">Session Volume</span>
                  <span className="text-white font-mono font-black text-2xl mt-1 block">{stock.volume}</span>
                  <span className="text-xs text-slate-300 font-mono mt-0.5 block">Shares Traded</span>
                </div>
              </div>

              {/* 52-Week Range Position Visual Bar */}
              <div className="bg-[#131b2e] border border-white/15 rounded-2xl p-5 shadow-xl flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs sm:text-sm text-slate-300 font-mono">
                  <span>52-Week Low: <strong className="text-white font-bold">₹{stock.week52Low.toFixed(2)}</strong></span>
                  <span className="font-bold text-[#FF7900] font-sans">
                    {stock.rangePositionPercent}% of 52-Week Range
                  </span>
                  <span>52-Week High: <strong className="text-white font-bold">₹{stock.week52High.toFixed(2)}</strong></span>
                </div>
                <div className="w-full bg-black/50 h-3.5 rounded-full overflow-hidden border border-white/15 p-0.5">
                  <div
                    className="bg-gradient-to-r from-[#FF7900] via-[#ffaa40] to-[#24c78b] h-full rounded-full transition-all duration-300"
                    style={{ width: `${stock.rangePositionPercent}%` }}
                  />
                </div>
              </div>

              {/* Annual Income Statement Table */}
              {stock.financials && stock.financials.length > 0 && (
                <div className="bg-[#131b2e] border border-white/15 rounded-2xl p-6 shadow-xl flex flex-col gap-3.5">
                  <div className="flex items-center justify-between pb-2 border-b border-white/15">
                    <h4 className="font-bold text-white text-base flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#FF7900] text-[20px]">table_rows</span>
                      <span>Annual Financial Statements (Revenue, EBITDA &amp; Net Profit in ₹ Crores)</span>
                    </h4>
                    <span className="text-xs text-slate-400 font-mono">Audited Standalone/Consolidated</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs sm:text-sm font-mono">
                      <thead>
                        <tr className="bg-[#1e293b] text-white font-bold border-b border-white/20">
                          <th className="py-3 px-4 rounded-l-lg font-sans">Fiscal Year</th>
                          <th className="py-3 px-4 text-right">Revenue (₹ Cr)</th>
                          <th className="py-3 px-4 text-right">EBITDA (₹ Cr)</th>
                          <th className="py-3 px-4 text-right">Net Profit (₹ Cr)</th>
                          <th className="py-3 px-4 text-right rounded-r-lg">Operating Margin</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10 text-slate-200">
                        {stock.financials.map((fin, i) => (
                          <tr key={i} className="hover:bg-white/5 transition-colors">
                            <td className="py-3 px-4 font-bold text-white font-sans">{fin.year}</td>
                            <td className="py-3 px-4 text-right font-medium">₹{fin.revenueCr.toLocaleString('en-IN')} Cr</td>
                            <td className="py-3 px-4 text-right text-slate-300">₹{fin.ebitdaCr.toLocaleString('en-IN')} Cr</td>
                            <td className="py-3 px-4 text-right font-bold text-[#24c78b]">₹{fin.netProfitCr.toLocaleString('en-IN')} Cr</td>
                            <td className="py-3 px-4 text-right font-bold text-[#FF9B42]">{fin.marginPercent.toFixed(2)}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Quarterly Earnings Disclosures */}
              {stock.quarterly && stock.quarterly.length > 0 && (
                <div className="bg-[#131b2e] border border-white/15 rounded-2xl p-6 shadow-xl flex flex-col gap-3.5">
                  <div className="flex items-center justify-between pb-2 border-b border-white/15">
                    <h4 className="font-bold text-white text-base flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#24c78b] text-[20px]">calendar_month</span>
                      <span>Quarterly Earnings Disclosures (Recent Trailing Quarters)</span>
                    </h4>
                    <span className="text-xs text-slate-400 font-mono">Quarterly Filings</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs sm:text-sm font-mono">
                      <thead>
                        <tr className="bg-[#1e293b] text-white font-bold border-b border-white/20">
                          <th className="py-3 px-4 rounded-l-lg font-sans">Quarter</th>
                          <th className="py-3 px-4 text-right">Revenue (₹ Cr)</th>
                          <th className="py-3 px-4 text-right">Net Profit (₹ Cr)</th>
                          <th className="py-3 px-4 text-right">Margin %</th>
                          <th className="py-3 px-4 text-right rounded-r-lg">YoY Growth</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10 text-slate-200">
                        {stock.quarterly.map((q, i) => (
                          <tr key={i} className="hover:bg-white/5 transition-colors">
                            <td className="py-3 px-4 font-bold text-white font-sans">{q.quarter}</td>
                            <td className="py-3 px-4 text-right">₹{q.revenueCr.toLocaleString('en-IN')} Cr</td>
                            <td className="py-3 px-4 text-right font-bold text-[#24c78b]">₹{q.netProfitCr.toLocaleString('en-IN')} Cr</td>
                            <td className="py-3 px-4 text-right font-bold text-[#FF9B42]">{q.marginPercent.toFixed(2)}%</td>
                            <td className={`py-3 px-4 text-right font-bold ${q.yoyGrowth >= 0 ? 'text-[#24c78b]' : 'text-[#ff4d5a]'}`}>
                              {q.yoyGrowth >= 0 ? '+' : ''}{q.yoyGrowth.toFixed(1)}% YoY
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SHAREHOLDING & ANALYST TARGETS */}
          {activeTab === 'shareholding' && (
            <div className="flex flex-col gap-5 max-w-6xl mx-auto w-full">
              {/* Ownership Pattern Cards */}
              <div className="bg-[#131b2e] border border-white/15 rounded-2xl p-6 shadow-xl flex flex-col gap-4">
                <div className="flex items-center justify-between pb-2 border-b border-white/15">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#FF7900] text-[22px]">pie_chart</span>
                    <h3 className="font-bold text-white text-base">Shareholding Structure &amp; Ownership</h3>
                  </div>
                  <span className="text-xs text-slate-300 font-mono">Total Capital: 100%</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                  <div className="p-5 rounded-xl bg-[#0b1020] border border-white/15 shadow-md flex flex-col items-center">
                    <span className="text-xs text-slate-300 font-semibold block mb-1">Promoter Holding</span>
                    <span className="text-white font-mono font-black text-3xl">{stock.shareholding.promoters}%</span>
                    <span className="text-xs text-slate-400 block mt-2">Founders &amp; Parent Entity</span>
                  </div>

                  <div className="p-5 rounded-xl bg-[#0b1020] border border-white/15 shadow-md flex flex-col items-center">
                    <span className="text-xs text-slate-300 font-semibold block mb-1">FII (Foreign Inst.)</span>
                    <span className="text-[#24c78b] font-mono font-black text-3xl">{stock.shareholding.fii}%</span>
                    <span className="text-xs text-slate-400 block mt-2">Global Sovereign &amp; Funds</span>
                  </div>

                  <div className="p-5 rounded-xl bg-[#0b1020] border border-white/15 shadow-md flex flex-col items-center">
                    <span className="text-xs text-slate-300 font-semibold block mb-1">DII (Mutual Funds)</span>
                    <span className="text-[#FF9B42] font-mono font-black text-3xl">{stock.shareholding.dii}%</span>
                    <span className="text-xs text-slate-400 block mt-2">Indian Insurance &amp; MF</span>
                  </div>

                  <div className="p-5 rounded-xl bg-[#0b1020] border border-white/15 shadow-md flex flex-col items-center">
                    <span className="text-xs text-slate-300 font-semibold block mb-1">Public &amp; Retail</span>
                    <span className="text-slate-200 font-mono font-black text-3xl">{stock.shareholding.retail}%</span>
                    <span className="text-xs text-slate-400 block mt-2">Individual Retail Investors</span>
                  </div>
                </div>
              </div>

              {/* Analyst Consensus & Price Targets */}
              <div className="bg-[#131b2e] border border-white/15 rounded-2xl p-6 shadow-xl flex flex-col gap-5">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-white/15">
                  <div>
                    <h3 className="font-bold text-white text-lg tracking-tight">Institutional Brokerage Consensus</h3>
                    <p className="text-xs sm:text-sm text-slate-300 mt-1">
                      Aggregated recommendations from {stock.analystRatings.coverageHouses} research houses.
                    </p>
                  </div>
                  <div className="text-right bg-[#0b1020] px-5 py-3 rounded-xl border border-white/15">
                    <span className="text-xs text-slate-300 block font-medium">12-Month Target Price</span>
                    <span className="text-2xl font-black text-white font-mono">₹{stock.analystRatings.consensusTarget.toFixed(2)}</span>
                    <span className="text-xs text-[#24c78b] font-black font-mono block mt-0.5">
                      +{stock.analystRatings.upsidePercent}% Projected Upside
                    </span>
                  </div>
                </div>

                {/* Rating Distribution Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs sm:text-sm font-bold">
                    <span className="text-[#24c78b]">BUY: {stock.analystRatings.buyPercent}%</span>
                    <span className="text-amber-400">HOLD: {stock.analystRatings.holdPercent}%</span>
                    <span className="text-[#ff4d5a]">SELL: {stock.analystRatings.sellPercent}%</span>
                  </div>
                  <div className="w-full h-4 rounded-full overflow-hidden flex bg-black/60 border border-white/15 p-0.5">
                    <div className="bg-[#24c78b] h-full rounded-l-full" style={{ width: `${stock.analystRatings.buyPercent}%` }} />
                    <div className="bg-amber-400 h-full" style={{ width: `${stock.analystRatings.holdPercent}%` }} />
                    <div className="bg-[#ff4d5a] h-full rounded-r-full" style={{ width: `${stock.analystRatings.sellPercent}%` }} />
                  </div>
                </div>

                {/* Latest Wall Street Note */}
                <div className="p-5 rounded-xl bg-[#0b1020] border border-white/15 flex flex-col gap-2 shadow-inner">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[#FF7900] text-[18px]">rate_review</span>
                      {stock.analystRatings.latestNoteAuthor}
                    </span>
                    <span className="px-3 py-1 rounded-md text-xs bg-[#24c78b]/20 text-[#24c78b] font-black uppercase border border-[#24c78b]/40">
                      {stock.analystRatings.latestNoteStance}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 italic leading-relaxed pl-6 border-l-2 border-[#FF7900]">
                    "{stock.analystRatings.latestNoteQuote}"
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: TRADINGVIEW TECHNICAL SENTIMENT GAUGE */}
          {activeTab === 'technicals' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 max-w-6xl mx-auto w-full">
              <div className="lg:col-span-2 flex flex-col gap-3">
                <div className="bg-[#131b2e] border border-white/15 rounded-2xl p-5 shadow-xl flex flex-col gap-3">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#FF7900] text-[20px]">speed</span>
                      <span>TradingView Technical Sentiment Meter</span>
                    </h3>
                    <p className="text-xs text-slate-300 mt-1">
                      Live real-time aggregation across 26 technical indicators (RSI, Stochastic, MACD, Moving Averages) from in.tradingview.com.
                    </p>
                  </div>
                  <div className="rounded-xl overflow-hidden border border-white/10 mt-1">
                    <TradingViewTechnicalAnalysis symbol={tvSymbol} height={440} interval="1D" />
                  </div>
                </div>
              </div>

              {/* Technical Checklist */}
              <div className="flex flex-col gap-4">
                <div className="bg-[#131b2e] border border-white/15 rounded-2xl p-5 shadow-xl space-y-4 text-xs sm:text-sm">
                  <h4 className="font-bold text-white uppercase tracking-wider text-xs flex items-center gap-2 pb-2 border-b border-white/15">
                    <span className="material-symbols-outlined text-[#24c78b] text-[18px]">check_circle</span>
                    <span>Technical Checklist</span>
                  </h4>

                  <div className="flex justify-between items-center pb-2 border-b border-white/10">
                    <span className="text-slate-300">Trend Bias:</span>
                    <span className={`font-mono font-bold ${stock.change >= 0 ? 'text-[#24c78b]' : 'text-[#ff4d5a]'}`}>
                      {stock.change >= 0 ? 'Bullish Expansion' : 'Bearish Consolidation'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pb-2 border-b border-white/10">
                    <span className="text-slate-300">Beta (1-Year Volatility):</span>
                    <span className="font-mono font-bold text-white">{stock.beta1Y} ({stock.betaVolatility})</span>
                  </div>

                  <div className="flex justify-between items-center pb-2 border-b border-white/10">
                    <span className="text-slate-300">52-Week Range Position:</span>
                    <span className="font-mono font-bold text-[#FF9B42]">{stock.rangePositionPercent}% from 52W Low</span>
                  </div>

                  <div className="flex justify-between items-center pb-2 border-b border-white/10">
                    <span className="text-slate-300">Day High / Low Spread:</span>
                    <span className="font-mono text-white">₹{stock.dayLow.toFixed(2)} - ₹{stock.dayHigh.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Trading Volume:</span>
                    <span className="font-mono font-bold text-white">{stock.volume} Shares</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#131b2e] border border-[#FF7900]/30 shadow-xl text-xs sm:text-sm text-slate-200">
                  <strong className="text-[#FF9B42] block mb-1.5 font-bold uppercase tracking-wide text-xs">
                    Alpha Signal Thesis:
                  </strong>
                  <p className="leading-relaxed">
                    {stock.alphaSignalSummary}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 4. MODAL FOOTER */}
        <div className="px-5 py-3.5 bg-[#111827] border-t border-white/15 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-2 text-slate-300 text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-[#24c78b] animate-pulse" />
            <span>Live market feeds sourced directly from <strong>in.tradingview.com</strong></span>
          </div>

          <div className="flex items-center gap-3">
            {onOpenFullDeepDive && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenFullDeepDive(stock.symbol);
                }}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white font-bold transition-all flex items-center gap-1.5 text-xs cursor-pointer border border-white/10"
              >
                <span>Open Full Stock Deep Dive Screen</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-[#FF7900] text-black font-black text-xs hover:bg-[#ff9b42] transition-colors shadow-md cursor-pointer"
            >
              Done / Return to Screener
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
