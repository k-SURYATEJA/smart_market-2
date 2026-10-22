import React, { useState, useEffect } from 'react';
import { StockData } from '../../types/market';
import { TradingViewTechnicalAnalysis } from '../tradingview/TradingViewTechnicalAnalysis';
import { TradingViewSymbolInfo } from '../tradingview/TradingViewSymbolInfo';
import { TradingViewProfile } from '../tradingview/TradingViewProfile';

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

export const StockLiveDetailsModal: React.FC<StockLiveDetailsModalProps> = ({
  stock,
  isOpen,
  onClose,
  allStocks = [],
  onSelectStock,
  onOpenFullDeepDive,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'financials' | 'shareholding' | 'technicals'>('overview');

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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-6xl max-h-[92vh] bg-[#0c101a] border border-primary/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden relative"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Accent Line */}
        <div className="h-1 w-full bg-gradient-to-r from-primary via-[#ff9b42] to-secondary" />

        {/* Modal Header */}
        <div className="px-5 py-4 bg-[#111726] border-b border-white/10 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-primary/15 border border-primary/40 flex items-center justify-center text-primary font-black text-lg">
              {stock.symbol.slice(0, 3)}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-black text-white tracking-tight">
                  {stock.name}
                </h2>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-white/10 text-white">
                  {stock.symbol}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-primary/20 text-primary border border-primary/30">
                  {tvSymbol}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-sans text-slate-400 bg-white/5">
                  {stock.sector}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                <span>Exchange: <strong className="text-white">{stock.exchange}</strong></span>
                <span>•</span>
                <span>Market Cap: <strong className="text-white">{stock.marketCapCr}</strong> ({stock.marketCapUsd})</span>
              </p>
            </div>
          </div>

          {/* Right Header: Price & Actions */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xl font-black text-white font-mono">
                ₹{stock.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
              <div
                className={`text-xs font-mono font-semibold flex items-center justify-end gap-1 ${
                  stock.change >= 0 ? 'text-secondary' : 'text-tertiary'
                }`}
              >
                <span>{stock.change >= 0 ? '▲ +' : '▼ '}₹{Math.abs(stock.change).toFixed(2)}</span>
                <span>({stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)</span>
              </div>
            </div>

            {/* Direct TradingView Link */}
            <a
              href={tradingViewWebUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Open real-time interactive quote on in.tradingview.com"
              className="px-3 py-2 rounded-xl bg-[#1e293b] hover:bg-[#334155] border border-white/15 text-xs text-slate-200 font-semibold transition-all flex items-center gap-1.5 shadow-sm hover:text-white"
            >
              <svg className="w-3.5 h-3.5 text-primary" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
              <span>TradingView Live</span>
              <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
              </svg>
            </a>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <span className="material-symbols-outlined text-[22px]">close</span>
            </button>
          </div>
        </div>

        {/* Live TradingView Symbol Info Bar */}
        <div className="px-5 pt-3 pb-1 bg-[#090d16] border-b border-white/5">
          <TradingViewSymbolInfo symbol={tvSymbol} />
        </div>

        {/* Navigation Tabs & Stock Switcher */}
        <div className="px-5 py-2.5 bg-[#0e1422] border-b border-white/10 flex flex-wrap items-center justify-between gap-3 shrink-0">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'overview'
                  ? 'bg-primary text-black shadow-[0_0_10px_rgba(255,121,0,0.3)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">business</span>
              <span>Company Profile &amp; Segments</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('financials')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'financials'
                  ? 'bg-primary text-black shadow-[0_0_10px_rgba(255,121,0,0.3)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">analytics</span>
              <span>Financials, Ratios &amp; Valuation</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('shareholding')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'shareholding'
                  ? 'bg-primary text-black shadow-[0_0_10px_rgba(255,121,0,0.3)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">pie_chart</span>
              <span>Shareholding &amp; Analyst Targets</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('technicals')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'technicals'
                  ? 'bg-primary text-black shadow-[0_0_10px_rgba(255,121,0,0.3)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">speed</span>
              <span>TradingView Technical Sentiment</span>
            </button>
          </div>

          {/* Quick Stock Switcher Pills */}
          {allStocks.length > 0 && onSelectStock && (
            <div className="flex items-center gap-1 overflow-x-auto max-w-sm py-0.5">
              <span className="text-[10px] uppercase font-bold text-slate-500 mr-1 shrink-0">Switch:</span>
              {allStocks.map(s => (
                <button
                  key={s.symbol}
                  type="button"
                  onClick={() => onSelectStock(s)}
                  className={`px-2 py-1 rounded text-[11px] font-mono font-bold shrink-0 transition-all ${
                    s.symbol === stock.symbol
                      ? 'bg-primary/25 text-primary border border-primary/50'
                      : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {s.symbol}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col gap-4">
          
          {/* TAB 1: COMPANY PROFILE & CORE SEGMENTS */}
          {activeTab === 'overview' && (
            <div className="flex flex-col gap-4">
              {/* Detailed Profile Box */}
              <div className="bg-[#111726] border border-white/10 rounded-2xl p-5 flex flex-col gap-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">corporate_fare</span>
                    <h3 className="font-bold text-white text-base">Corporate Overview &amp; Business Profile</h3>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-white/5 font-mono text-xs text-slate-300">
                    Series: {stock.series} • Face Value: ₹{stock.faceValue.toFixed(2)}
                  </span>
                </div>

                <p className="text-slate-300 leading-relaxed text-sm">
                  {stock.profile}
                </p>

                {/* Alpha Signal Insight */}
                <div className="p-4 rounded-xl bg-primary/10 border border-primary/30 flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-[22px] mt-0.5 shrink-0">insights</span>
                  <div>
                    <h4 className="font-bold text-primary text-xs uppercase tracking-wider mb-1">
                      Institutional Research Thesis
                    </h4>
                    <p className="text-xs text-slate-200 leading-relaxed">
                      {stock.alphaSignalSummary}
                    </p>
                  </div>
                </div>
              </div>

              {/* Core Business Segments */}
              <div className="bg-[#111726] border border-white/10 rounded-2xl p-5 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-sm uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#FF7900]" />
                    Revenue &amp; Business Segments Breakdown
                  </h3>
                  <span className="text-xs text-slate-400">Total Contribution: 100%</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {stock.segments.map((seg, i) => (
                    <div key={i} className="bg-black/30 border border-white/10 rounded-xl p-4 flex flex-col justify-between gap-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="material-symbols-outlined text-primary text-[22px]">{seg.icon || 'store'}</span>
                          <div>
                            <span className="font-bold text-white text-sm block">{seg.name}</span>
                            <span className="text-[11px] text-slate-400">{seg.description}</span>
                          </div>
                        </div>
                        <span className="font-mono font-black text-primary text-lg">{seg.sharePercent}%</span>
                      </div>

                      <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-[#ff9b42] rounded-full"
                          style={{ width: `${seg.sharePercent}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* TradingView Company Profile Widget */}
              <div className="bg-[#111726] border border-white/10 rounded-2xl p-5 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
                    <span>Live TradingView Verified Company Info</span>
                  </h3>
                  <span className="text-xs text-slate-500 font-mono">in.tradingview.com data</span>
                </div>
                <TradingViewProfile symbol={tvSymbol} height={420} />
              </div>
            </div>
          )}

          {/* TAB 2: FINANCIALS, RATIOS & VALUATION */}
          {activeTab === 'financials' && (
            <div className="flex flex-col gap-4">
              {/* Primary Key Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <div className="bg-[#111726] border border-white/10 rounded-xl p-3.5">
                  <span className="text-slate-400 block text-[11px]">P/E Ratio</span>
                  <span className="text-white font-mono font-bold text-lg mt-0.5 block">{stock.peRatio.toFixed(2)}x</span>
                  <span className="text-[10px] text-slate-500">Industry: {stock.indPeRatio.toFixed(2)}x</span>
                </div>

                <div className="bg-[#111726] border border-white/10 rounded-xl p-3.5">
                  <span className="text-slate-400 block text-[11px]">P/B Ratio</span>
                  <span className="text-white font-mono font-bold text-lg mt-0.5 block">{stock.pbRatio.toFixed(2)}x</span>
                  <span className="text-[10px] text-primary font-semibold">{stock.pbEvaluation}</span>
                </div>

                <div className="bg-[#111726] border border-white/10 rounded-xl p-3.5">
                  <span className="text-slate-400 block text-[11px]">Book Value</span>
                  <span className="text-white font-mono font-bold text-lg mt-0.5 block">₹{stock.bookValue.toFixed(2)}</span>
                  <span className="text-[10px] text-slate-500">Per Share</span>
                </div>

                <div className="bg-[#111726] border border-white/10 rounded-xl p-3.5">
                  <span className="text-slate-400 block text-[11px]">EPS (TTM)</span>
                  <span className="text-white font-mono font-bold text-lg mt-0.5 block">₹{stock.epsTtm.toFixed(2)}</span>
                  <span className="text-[10px] text-secondary font-semibold">{stock.epsGrowthYoY}</span>
                </div>

                <div className="bg-[#111726] border border-white/10 rounded-xl p-3.5">
                  <span className="text-slate-400 block text-[11px]">Dividend Yield</span>
                  <span className="text-white font-mono font-bold text-lg mt-0.5 block">{stock.dividendYield.toFixed(2)}%</span>
                  <span className="text-[10px] text-slate-500">{stock.dividendPerShare}</span>
                </div>

                <div className="bg-[#111726] border border-white/10 rounded-xl p-3.5">
                  <span className="text-slate-400 block text-[11px]">Beta (1-Year)</span>
                  <span className="text-white font-mono font-bold text-lg mt-0.5 block">{stock.beta1Y}</span>
                  <span className="text-[10px] text-emerald-400">{stock.betaVolatility}</span>
                </div>
              </div>

              {/* 52-Week Range Position */}
              <div className="bg-[#111726] border border-white/10 rounded-2xl p-4">
                <div className="flex justify-between items-center mb-1.5 text-xs text-slate-400 font-mono">
                  <span>52-Week Low: <strong className="text-white">₹{stock.week52Low.toFixed(2)}</strong></span>
                  <span className="font-semibold text-primary font-sans">{stock.rangePositionPercent}% of 52W High</span>
                  <span>52-Week High: <strong className="text-white">₹{stock.week52High.toFixed(2)}</strong></span>
                </div>
                <div className="w-full bg-black/40 h-2.5 rounded-full overflow-hidden border border-white/10">
                  <div
                    className="bg-gradient-to-r from-primary to-secondary h-full rounded-full"
                    style={{ width: `${stock.rangePositionPercent}%` }}
                  />
                </div>
              </div>

              {/* Multi-Year Financial Performance Table */}
              {stock.financials && stock.financials.length > 0 && (
                <div className="bg-[#111726] border border-white/10 rounded-2xl p-5 flex flex-col gap-3">
                  <h4 className="font-bold text-white text-sm uppercase tracking-wider flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[18px]">table_chart</span>
                    <span>Annual Income Statement &amp; Operating Margins (₹ Crores)</span>
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono">
                      <thead>
                        <tr className="text-slate-400 border-b border-white/10">
                          <th className="pb-2">Fiscal Year</th>
                          <th className="pb-2 text-right">Revenue</th>
                          <th className="pb-2 text-right">EBITDA</th>
                          <th className="pb-2 text-right">Net Profit</th>
                          <th className="pb-2 text-right">Margin %</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {stock.financials.map((fin, i) => (
                          <tr key={i} className="hover:bg-white/5 transition-colors">
                            <td className="py-2.5 font-bold text-white font-sans">{fin.year}</td>
                            <td className="py-2.5 text-right font-medium text-slate-200">₹{fin.revenueCr.toLocaleString('en-IN')} Cr</td>
                            <td className="py-2.5 text-right text-slate-300">₹{fin.ebitdaCr.toLocaleString('en-IN')} Cr</td>
                            <td className="py-2.5 text-right font-bold text-emerald-400">₹{fin.netProfitCr.toLocaleString('en-IN')} Cr</td>
                            <td className="py-2.5 text-right font-bold text-primary">{fin.marginPercent.toFixed(2)}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Quarterly Trend Table */}
              {stock.quarterly && stock.quarterly.length > 0 && (
                <div className="bg-[#111726] border border-white/10 rounded-2xl p-5 flex flex-col gap-3">
                  <h4 className="font-bold text-white text-sm uppercase tracking-wider flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[18px]">history</span>
                    <span>Quarterly Earnings Disclosures</span>
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono">
                      <thead>
                        <tr className="text-slate-400 border-b border-white/10">
                          <th className="pb-2">Quarter</th>
                          <th className="pb-2 text-right">Revenue</th>
                          <th className="pb-2 text-right">Net Profit</th>
                          <th className="pb-2 text-right">Margin %</th>
                          <th className="pb-2 text-right">YoY Growth</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {stock.quarterly.map((q, i) => (
                          <tr key={i} className="hover:bg-white/5 transition-colors">
                            <td className="py-2.5 font-bold text-white font-sans">{q.quarter}</td>
                            <td className="py-2.5 text-right text-slate-200">₹{q.revenueCr.toLocaleString('en-IN')} Cr</td>
                            <td className="py-2.5 text-right font-bold text-emerald-400">₹{q.netProfitCr.toLocaleString('en-IN')} Cr</td>
                            <td className="py-2.5 text-right text-primary">{q.marginPercent.toFixed(2)}%</td>
                            <td className={`py-2.5 text-right font-bold ${q.yoyGrowth >= 0 ? 'text-secondary' : 'text-tertiary'}`}>
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
            <div className="flex flex-col gap-4">
              {/* Ownership Pattern */}
              <div className="bg-[#111726] border border-white/10 rounded-2xl p-5 flex flex-col gap-4">
                <h3 className="font-bold text-white text-sm uppercase tracking-wider flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">groups</span>
                  <span>Shareholding Ownership Structure</span>
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="p-4 rounded-xl bg-black/30 border border-white/5">
                    <span className="text-xs text-slate-400 block mb-1">Promoter Holding</span>
                    <span className="text-white font-mono font-black text-xl">{stock.shareholding.promoters}%</span>
                    <span className="text-[10px] text-slate-500 block mt-1">Founders / Core Parent</span>
                  </div>

                  <div className="p-4 rounded-xl bg-black/30 border border-white/5">
                    <span className="text-xs text-slate-400 block mb-1">FII (Foreign Inst.)</span>
                    <span className="text-secondary font-mono font-black text-xl">{stock.shareholding.fii}%</span>
                    <span className="text-[10px] text-slate-500 block mt-1">Global Institutions</span>
                  </div>

                  <div className="p-4 rounded-xl bg-black/30 border border-white/5">
                    <span className="text-xs text-slate-400 block mb-1">DII (Mutual Funds)</span>
                    <span className="text-primary font-mono font-black text-xl">{stock.shareholding.dii}%</span>
                    <span className="text-[10px] text-slate-500 block mt-1">Domestic Institutions</span>
                  </div>

                  <div className="p-4 rounded-xl bg-black/30 border border-white/5">
                    <span className="text-xs text-slate-400 block mb-1">Public &amp; Retail</span>
                    <span className="text-slate-200 font-mono font-black text-xl">{stock.shareholding.retail}%</span>
                    <span className="text-[10px] text-slate-500 block mt-1">Individual Investors</span>
                  </div>
                </div>
              </div>

              {/* Analyst Ratings & Price Targets */}
              <div className="bg-[#111726] border border-white/10 rounded-2xl p-5 flex flex-col gap-4">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/10">
                  <div>
                    <h3 className="font-bold text-white text-base">Institutional Analyst Consensus</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Coverage from {stock.analystRatings.coverageHouses} leading Wall Street and Dalal Street brokerage houses.
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Consensus Target</span>
                    <span className="text-xl font-black text-white font-mono">₹{stock.analystRatings.consensusTarget.toFixed(2)}</span>
                    <span className="text-xs text-secondary font-bold font-mono">+{stock.analystRatings.upsidePercent}% Upside</span>
                  </div>
                </div>

                {/* Buy / Hold / Sell Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-secondary">Buy: {stock.analystRatings.buyPercent}%</span>
                    <span className="text-yellow-400">Hold: {stock.analystRatings.holdPercent}%</span>
                    <span className="text-rose-400">Sell: {stock.analystRatings.sellPercent}%</span>
                  </div>
                  <div className="w-full h-3 rounded-full overflow-hidden flex bg-black/40 border border-white/10">
                    <div className="bg-secondary h-full" style={{ width: `${stock.analystRatings.buyPercent}%` }} />
                    <div className="bg-yellow-400 h-full" style={{ width: `${stock.analystRatings.holdPercent}%` }} />
                    <div className="bg-rose-500 h-full" style={{ width: `${stock.analystRatings.sellPercent}%` }} />
                  </div>
                </div>

                {/* Latest Research Note */}
                <div className="p-4 rounded-xl bg-black/30 border border-white/10 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{stock.analystRatings.latestNoteAuthor}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-secondary/20 text-secondary font-bold uppercase">
                      {stock.analystRatings.latestNoteStance}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 italic">
                    "{stock.analystRatings.latestNoteQuote}"
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: TRADINGVIEW TECHNICAL SENTIMENT */}
          {activeTab === 'technicals' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 flex flex-col gap-2">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  TradingView Technical Sentiment &amp; Oscillator Summary
                </h3>
                <p className="text-xs text-slate-400 mb-2">
                  Live real-time aggregation of 26 technical indicators from in.tradingview.com (RSI, Stochastic, MACD, EMAs, and SMAs).
                </p>
                <TradingViewTechnicalAnalysis symbol={tvSymbol} height={440} interval="1D" />
              </div>

              {/* Technical Indicator Snapshots */}
              <div className="flex flex-col gap-3">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Technical Checklist
                </h3>
                <div className="bg-[#111726] border border-white/10 rounded-xl p-4 space-y-3 text-xs">
                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <span className="text-slate-400">Trend Bias:</span>
                    <span className={`font-mono font-bold ${stock.change >= 0 ? 'text-secondary' : 'text-tertiary'}`}>
                      {stock.change >= 0 ? 'Bullish Expansion' : 'Bearish Consolidation'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <span className="text-slate-400">Beta (1-Year Volatility):</span>
                    <span className="font-mono font-bold text-white">{stock.beta1Y} ({stock.betaVolatility})</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <span className="text-slate-400">52-Week Range Position:</span>
                    <span className="font-mono font-bold text-primary">{stock.rangePositionPercent}% of 52W High</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <span className="text-slate-400">Day High / Low Spread:</span>
                    <span className="font-mono text-white">₹{stock.dayLow.toFixed(2)} - ₹{stock.dayHigh.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Trading Volume:</span>
                    <span className="font-mono font-bold text-white">{stock.volume} Shares</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-primary/10 border border-primary/30 text-xs text-slate-300">
                  <strong className="text-primary block mb-1">Alpha Insight:</strong>
                  {stock.alphaSignalSummary}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-[#111726] border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-2 text-slate-400 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <span>Live market information sourced from <strong>in.tradingview.com</strong></span>
          </div>

          <div className="flex items-center gap-2">
            {onOpenFullDeepDive && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenFullDeepDive(stock.symbol);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white font-semibold transition-all flex items-center gap-1.5 text-xs"
              >
                <span>Open Full Stock Deep Dive Screen</span>
                <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-primary text-black font-bold text-xs hover:bg-[#ff9b42] transition-colors"
            >
              Done / Return to Screener
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
