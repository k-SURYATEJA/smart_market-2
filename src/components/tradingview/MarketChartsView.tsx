import React, { useState } from 'react';
import { TradingViewChart } from './TradingViewChart';

interface MarketPreset {
  name: string;
  symbol: string;
  category: 'Indian Equities' | 'Indices' | 'Forex' | 'Commodities' | 'Crypto';
  tag: string;
}

const PRESET_MARKETS: MarketPreset[] = [
  // Indian Equities
  { name: 'Reliance Industries', symbol: 'BSE:RELIANCE', category: 'Indian Equities', tag: 'RIL' },
  { name: 'Tata Consultancy Services', symbol: 'BSE:TCS', category: 'Indian Equities', tag: 'TCS' },
  { name: 'HDFC Bank', symbol: 'BSE:HDFCBANK', category: 'Indian Equities', tag: 'HDFC' },
  { name: 'Infosys', symbol: 'BSE:INFY', category: 'Indian Equities', tag: 'INFY' },
  { name: 'Tata Motors', symbol: 'NSE:TATAMOTORS', category: 'Indian Equities', tag: 'TATAMOTORS' },
  { name: 'State Bank of India', symbol: 'BSE:SBIN', category: 'Indian Equities', tag: 'SBIN' },
  { name: 'ICICI Bank', symbol: 'BSE:ICICIBANK', category: 'Indian Equities', tag: 'ICICI' },
  { name: 'Bharti Airtel', symbol: 'BSE:BHARTIARTL', category: 'Indian Equities', tag: 'AIRTEL' },
  
  // Indices
  { name: 'Nifty 50', symbol: 'INDEX:NIFTY', category: 'Indices', tag: 'NIFTY' },
  { name: 'BSE Sensex', symbol: 'BSE:SENSEX', category: 'Indices', tag: 'SENSEX' },
  { name: 'Bank Nifty', symbol: 'NSE:BANKNIFTY', category: 'Indices', tag: 'BANKNIFTY' },
  { name: 'S&P 500', symbol: 'SP:SPX', category: 'Indices', tag: 'SPX' },
  { name: 'Nasdaq 100', symbol: 'NASDAQ:NDX', category: 'Indices', tag: 'NDX' },
  
  // Forex
  { name: 'EUR / USD', symbol: 'FX:EURUSD', category: 'Forex', tag: 'EURUSD' },
  { name: 'GBP / USD', symbol: 'FX:GBPUSD', category: 'Forex', tag: 'GBPUSD' },
  { name: 'USD / INR', symbol: 'FX_IDC:USDINR', category: 'Forex', tag: 'USDINR' },
  { name: 'USD / JPY', symbol: 'FX:USDJPY', category: 'Forex', tag: 'USDJPY' },
  { name: 'AUD / USD', symbol: 'FX:AUDUSD', category: 'Forex', tag: 'AUDUSD' },

  // Commodities
  { name: 'Gold Spot', symbol: 'OANDA:XAUUSD', category: 'Commodities', tag: 'XAUUSD' },
  { name: 'Silver Spot', symbol: 'OANDA:XAGUSD', category: 'Commodities', tag: 'XAGUSD' },
  { name: 'Brent Crude Oil', symbol: 'TVC:UKOIL', category: 'Commodities', tag: 'CRUDE' },
  { name: 'Natural Gas', symbol: 'TVC:NATGAS', category: 'Commodities', tag: 'NATGAS' },

  // Crypto
  { name: 'Bitcoin', symbol: 'BINANCE:BTCUSDT', category: 'Crypto', tag: 'BTC' },
  { name: 'Ethereum', symbol: 'BINANCE:ETHUSDT', category: 'Crypto', tag: 'ETH' },
  { name: 'Solana', symbol: 'BINANCE:SOLUSDT', category: 'Crypto', tag: 'SOL' },
];

export const MarketChartsView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeSymbol1, setActiveSymbol1] = useState<string>('BSE:RELIANCE');
  const [activeSymbol2, setActiveSymbol2] = useState<string>('INDEX:NIFTY');
  const [activeSymbol3, setActiveSymbol3] = useState<string>('BSE:SENSEX');
  const [activeSymbol4, setActiveSymbol4] = useState<string>('FX_IDC:USDINR');
  const [layoutMode, setLayoutMode] = useState<'single' | 'dual' | 'quad'>('single');
  const [chartInterval, setChartInterval] = useState<string>('D');
  const [customSearch, setCustomSearch] = useState<string>('');

  const filteredMarkets = PRESET_MARKETS.filter(m => {
    const matchesCat = selectedCategory === 'All' || m.category === selectedCategory;
    const matchesSearch =
      m.name.toLowerCase().includes(customSearch.toLowerCase()) ||
      m.symbol.toLowerCase().includes(customSearch.toLowerCase()) ||
      m.tag.toLowerCase().includes(customSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const categories = ['All', 'Indian Equities', 'Indices', 'Forex', 'Commodities', 'Crypto'];

  const handleSelectSymbol = (sym: string) => {
    setActiveSymbol1(sym);
  };

  return (
    <div className="flex flex-col w-full gap-space-md">
      {/* Header bar with pure black & yellow branding */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-sm bg-surface-container rounded-xl p-space-md border border-outline-variant/30">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[24px]">candlestick_chart</span>
            <h2 className="font-headline-lg font-bold text-on-surface">
              Market Charts Terminal
            </h2>
            <span className="px-2 py-0.5 rounded bg-primary text-on-primary font-mono-xs font-bold text-[10px] tracking-wider uppercase">
              TradingView Integrated
            </span>
          </div>
          <p className="font-body-sm text-outline mt-0.5">
            Institutional multi-market charting powered directly by official TradingView advanced feeds.
          </p>
        </div>

        {/* Layout & Timeframe Mode Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Layout Mode Selector */}
          <div className="flex items-center gap-1 bg-surface-container-lowest p-1 rounded-lg border border-outline-variant/40">
            <button
              onClick={() => setLayoutMode('single')}
              className={`px-3 py-1.5 rounded font-mono-xs font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                layoutMode === 'single'
                  ? 'bg-primary text-on-primary'
                  : 'text-outline hover:text-on-surface'
              }`}
              title="1x1 Full Chart"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">crop_square</span>
              <span>1x1 Single</span>
            </button>
            <button
              onClick={() => setLayoutMode('dual')}
              className={`px-3 py-1.5 rounded font-mono-xs font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                layoutMode === 'dual'
                  ? 'bg-primary text-on-primary'
                  : 'text-outline hover:text-on-surface'
              }`}
              title="2x1 Dual Split"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">view_column</span>
              <span>2x1 Split</span>
            </button>
            <button
              onClick={() => setLayoutMode('quad')}
              className={`px-3 py-1.5 rounded font-mono-xs font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                layoutMode === 'quad'
                  ? 'bg-primary text-on-primary'
                  : 'text-outline hover:text-on-surface'
              }`}
              title="2x2 Quad Multi-Grid"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">grid_view</span>
              <span>2x2 Quad</span>
            </button>
          </div>

          {/* Timeframe Selector */}
          <div className="flex items-center gap-1 bg-surface-container-lowest p-1 rounded-lg border border-outline-variant/40 font-mono-xs text-mono-xs">
            {['1', '5', '15', '60', 'D', 'W'].map(iv => (
              <button
                key={iv}
                onClick={() => setChartInterval(iv)}
                className={`px-2 py-1 rounded cursor-pointer transition-colors ${
                  chartInterval === iv
                    ? 'bg-primary text-on-primary font-bold'
                    : 'text-outline hover:text-on-surface'
                }`}
                type="button"
              >
                {iv === '60' ? '1H' : iv}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Market Selector & Quick Ticker Carousel */}
      <div className="bg-surface-container rounded-xl p-space-sm border border-outline-variant/30 flex flex-col gap-space-sm">
        {/* Category Pills & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded font-mono-xs text-mono-xs whitespace-nowrap cursor-pointer transition-colors ${
                  selectedCategory === cat
                    ? 'bg-primary text-on-primary font-bold shadow-sm'
                    : 'bg-surface-container-lowest text-outline hover:text-on-surface border border-outline-variant/30'
                }`}
                type="button"
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative min-w-[240px]">
            <span className="material-symbols-outlined absolute left-2.5 top-2 text-outline text-[16px]">
              search
            </span>
            <input
              type="text"
              value={customSearch}
              onChange={e => setCustomSearch(e.target.value)}
              placeholder="Search Indian stocks, forex, gold, crypto..."
              className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-lg pl-8 pr-3 py-1.5 font-mono-xs text-mono-xs text-on-surface placeholder:text-outline focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        {/* Ticker Badges Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
          {filteredMarkets.map(m => (
            <button
              key={m.symbol}
              onClick={() => handleSelectSymbol(m.symbol)}
              className={`px-2.5 py-1 rounded font-mono-xs text-mono-xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition-all border ${
                activeSymbol1 === m.symbol
                  ? 'bg-primary/15 border-primary text-primary font-bold shadow-[0_0_8px_rgba(0,208,108,0.25)]'
                  : 'bg-surface-container-lowest border-outline-variant/30 text-outline hover:text-on-surface hover:border-outline'
              }`}
              type="button"
            >
              <span className="font-semibold text-on-surface">{m.tag}</span>
              <span className="text-[10px] text-outline truncate max-w-[120px]">{m.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* CHARTS CONTAINER GRID */}
      {layoutMode === 'single' && (
        <div className="w-full bg-surface-container rounded-xl p-space-sm border border-outline-variant/30">
          <div className="h-[680px] w-full">
            <TradingViewChart
              symbol={activeSymbol1}
              interval={chartInterval}
              height="100%"
              containerId="tv-single-view"
            />
          </div>
        </div>
      )}

      {layoutMode === 'dual' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-md">
          {/* Chart 1 */}
          <div className="bg-surface-container rounded-xl p-space-sm border border-outline-variant/30 flex flex-col gap-2">
            <div className="flex items-center justify-between px-2 pt-1 font-mono-xs text-mono-xs">
              <span className="font-bold text-primary">Chart 1: {activeSymbol1}</span>
              <select
                value={activeSymbol1}
                onChange={e => setActiveSymbol1(e.target.value)}
                className="bg-surface-container-lowest border border-outline-variant/40 rounded px-2 py-0.5 text-on-surface"
              >
                {PRESET_MARKETS.map(p => (
                  <option key={p.symbol} value={p.symbol}>
                    {p.name} ({p.symbol})
                  </option>
                ))}
              </select>
            </div>
            <div className="h-[600px] w-full">
              <TradingViewChart
                symbol={activeSymbol1}
                interval={chartInterval}
                height="100%"
                containerId="tv-dual-1"
              />
            </div>
          </div>

          {/* Chart 2 */}
          <div className="bg-surface-container rounded-xl p-space-sm border border-outline-variant/30 flex flex-col gap-2">
            <div className="flex items-center justify-between px-2 pt-1 font-mono-xs text-mono-xs">
              <span className="font-bold text-secondary">Chart 2: {activeSymbol2}</span>
              <select
                value={activeSymbol2}
                onChange={e => setActiveSymbol2(e.target.value)}
                className="bg-surface-container-lowest border border-outline-variant/40 rounded px-2 py-0.5 text-on-surface"
              >
                {PRESET_MARKETS.map(p => (
                  <option key={p.symbol} value={p.symbol}>
                    {p.name} ({p.symbol})
                  </option>
                ))}
              </select>
            </div>
            <div className="h-[600px] w-full">
              <TradingViewChart
                symbol={activeSymbol2}
                interval={chartInterval}
                height="100%"
                containerId="tv-dual-2"
              />
            </div>
          </div>
        </div>
      )}

      {layoutMode === 'quad' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-md">
          {/* Quad 1 */}
          <div className="bg-surface-container rounded-xl p-space-sm border border-outline-variant/30 flex flex-col gap-1">
            <div className="flex items-center justify-between px-2 pt-1 font-mono-xs text-mono-xs">
              <span className="font-bold text-primary">{activeSymbol1}</span>
              <select
                value={activeSymbol1}
                onChange={e => setActiveSymbol1(e.target.value)}
                className="bg-surface-container-lowest border border-outline-variant/40 rounded px-1.5 py-0.5 text-on-surface text-[11px]"
              >
                {PRESET_MARKETS.map(p => (
                  <option key={p.symbol} value={p.symbol}>{p.tag}</option>
                ))}
              </select>
            </div>
            <div className="h-[360px] w-full">
              <TradingViewChart
                symbol={activeSymbol1}
                interval={chartInterval}
                height="100%"
                hideSideToolbar={true}
                containerId="tv-quad-1"
              />
            </div>
          </div>

          {/* Quad 2 */}
          <div className="bg-surface-container rounded-xl p-space-sm border border-outline-variant/30 flex flex-col gap-1">
            <div className="flex items-center justify-between px-2 pt-1 font-mono-xs text-mono-xs">
              <span className="font-bold text-primary">{activeSymbol2}</span>
              <select
                value={activeSymbol2}
                onChange={e => setActiveSymbol2(e.target.value)}
                className="bg-surface-container-lowest border border-outline-variant/40 rounded px-1.5 py-0.5 text-on-surface text-[11px]"
              >
                {PRESET_MARKETS.map(p => (
                  <option key={p.symbol} value={p.symbol}>{p.tag}</option>
                ))}
              </select>
            </div>
            <div className="h-[360px] w-full">
              <TradingViewChart
                symbol={activeSymbol2}
                interval={chartInterval}
                height="100%"
                hideSideToolbar={true}
                containerId="tv-quad-2"
              />
            </div>
          </div>

          {/* Quad 3 */}
          <div className="bg-surface-container rounded-xl p-space-sm border border-outline-variant/30 flex flex-col gap-1">
            <div className="flex items-center justify-between px-2 pt-1 font-mono-xs text-mono-xs">
              <span className="font-bold text-primary">{activeSymbol3}</span>
              <select
                value={activeSymbol3}
                onChange={e => setActiveSymbol3(e.target.value)}
                className="bg-surface-container-lowest border border-outline-variant/40 rounded px-1.5 py-0.5 text-on-surface text-[11px]"
              >
                {PRESET_MARKETS.map(p => (
                  <option key={p.symbol} value={p.symbol}>{p.tag}</option>
                ))}
              </select>
            </div>
            <div className="h-[360px] w-full">
              <TradingViewChart
                symbol={activeSymbol3}
                interval={chartInterval}
                height="100%"
                hideSideToolbar={true}
                containerId="tv-quad-3"
              />
            </div>
          </div>

          {/* Quad 4 */}
          <div className="bg-surface-container rounded-xl p-space-sm border border-outline-variant/30 flex flex-col gap-1">
            <div className="flex items-center justify-between px-2 pt-1 font-mono-xs text-mono-xs">
              <span className="font-bold text-primary">{activeSymbol4}</span>
              <select
                value={activeSymbol4}
                onChange={e => setActiveSymbol4(e.target.value)}
                className="bg-surface-container-lowest border border-outline-variant/40 rounded px-1.5 py-0.5 text-on-surface text-[11px]"
              >
                {PRESET_MARKETS.map(p => (
                  <option key={p.symbol} value={p.symbol}>{p.tag}</option>
                ))}
              </select>
            </div>
            <div className="h-[360px] w-full">
              <TradingViewChart
                symbol={activeSymbol4}
                interval={chartInterval}
                height="100%"
                hideSideToolbar={true}
                containerId="tv-quad-4"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
