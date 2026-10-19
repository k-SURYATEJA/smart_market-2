import React, { useState } from 'react';
import { StockData } from '../../types/market';
import { TradingViewChart } from '../tradingview/TradingViewChart';

interface StockDetailsViewProps {
  stock: StockData;
  onOpenAlertModal: () => void;
  isWatchlisted: boolean;
  onToggleWatchlist: () => void;
  onSelectStock: (symbol: string) => void;
}

export const StockDetailsView: React.FC<StockDetailsViewProps> = ({
  stock,
  onOpenAlertModal,
  isWatchlisted,
  onToggleWatchlist,
  onSelectStock,
}) => {
  // Interactive UI states
  const [chartEngine, setChartEngine] = useState<'tradingview' | 'native'>('tradingview');
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1D' | '1W' | '1M' | '6M' | '1Y' | '5Y' | 'ALL'>('1Y');
  const [selectedResolution, setSelectedResolution] = useState<'1m' | '5m' | '15m' | '1H' | '1D'>('1H');
  const [showEma, setShowEma] = useState(true);
  const [showRsi, setShowRsi] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'financials' | 'shareholding' | 'quarterly' | 'analysts'>('overview');
  const [activeDrawingTool, setActiveDrawingTool] = useState<string | null>(null);
  const [hoveredCandle, setHoveredCandle] = useState<{
    x: number;
    open: number;
    high: number;
    low: number;
    close: number;
    vol: string;
  } | null>(null);

  // Timeframe adjusted multiplier for chart simulation
  const tfMultiplier =
    selectedTimeframe === '1D' ? 0.99
    : selectedTimeframe === '1W' ? 0.98
    : selectedTimeframe === '1M' ? 0.96
    : selectedTimeframe === '6M' ? 0.92
    : selectedTimeframe === '1Y' ? 1.00
    : selectedTimeframe === '5Y' ? 1.25
    : 1.45;

  return (
    <div className="flex flex-col w-full gap-space-md">
      {/* 1. STOCK HEADER HERO PANEL */}
      <section className="w-full bg-surface-container rounded-xl shadow-md p-space-md flex flex-col xl:flex-row xl:items-center justify-between gap-space-md relative overflow-hidden border border-outline-variant/20">
        {/* Ambient glow behind ticker */}
        <div className="absolute -left-10 -top-10 w-64 h-64 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

        {/* Identity & Current Price */}
        <div className="flex flex-col md:flex-row md:items-center gap-space-md relative z-10">
          <div className="w-14 h-14 rounded-xl bg-surface-container-highest flex items-center justify-center font-mono-xl text-mono-xl text-primary font-bold shadow-inner shrink-0">
            {stock.symbol.slice(0, 3)}
          </div>
          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-space-xs">
              <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight">
                {stock.name}
              </h1>
              <span className="font-mono-xs text-mono-xs px-2 py-0.5 rounded-full bg-surface-container-high text-outline">
                {stock.tickerTag}
              </span>
              <span className="font-mono-xs text-mono-xs px-2 py-0.5 rounded-full bg-surface-container-high text-primary font-medium">
                {stock.exchange}
              </span>
              <span className="font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-surface-container-highest text-surface-tint">
                {stock.sector}
              </span>
            </div>
            <div className="flex flex-wrap items-baseline gap-space-sm mt-1">
              <span className="font-mono-xl text-mono-xl font-bold text-on-surface">
                ₹{(stock.price * tfMultiplier).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <div
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-mono-sm text-mono-sm font-semibold ${
                  stock.change >= 0
                    ? 'bg-secondary-container/20 text-secondary'
                    : 'bg-tertiary-container/20 text-tertiary'
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">
                  {stock.change >= 0 ? 'trending_up' : 'trending_down'}
                </span>
                <span>
                  {stock.change >= 0 ? '+' : ''}₹{stock.change.toFixed(2)} ({stock.change >= 0 ? '+' : ''}
                  {stock.changePercent.toFixed(2)}%)
                </span>
              </div>
              <span className="font-mono-xs text-mono-xs text-outline">Real-time quote (0.12s latency)</span>
            </div>
          </div>
        </div>

        {/* Quick Stats Bar (OHLCV) */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-space-sm bg-surface-container-lowest p-space-sm rounded-lg relative z-10 border border-outline-variant/30">
          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm text-outline uppercase">Open</span>
            <span className="font-mono-sm text-mono-sm text-on-surface font-semibold">
              ₹{stock.open.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm text-outline uppercase">Day High</span>
            <span className="font-mono-sm text-mono-sm text-secondary font-semibold">
              ₹{stock.dayHigh.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm text-outline uppercase">Day Low</span>
            <span className="font-mono-sm text-mono-sm text-tertiary font-semibold">
              ₹{stock.dayLow.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm text-outline uppercase">Prev Close</span>
            <span className="font-mono-sm text-mono-sm text-on-surface font-semibold">
              ₹{stock.prevClose.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm text-outline uppercase">Volume</span>
            <span className="font-mono-sm text-mono-sm text-primary font-semibold">
              {stock.volume}
            </span>
          </div>
        </div>

        {/* Action Bar (Technical & Fundamental Analysis Focus) */}
        <div className="flex items-center gap-space-xs relative z-10 flex-wrap">
          <button
            onClick={() => setChartEngine(chartEngine === 'tradingview' ? 'native' : 'tradingview')}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2 bg-primary text-black font-label-md text-label-md rounded-lg shadow-[0_0_10px_rgba(0,208,108,0.3)] hover:bg-primary-fixed transition-colors cursor-pointer font-bold"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">candlestick_chart</span>
            <span>{chartEngine === 'tradingview' ? 'Switch to Technicals Engine' : 'Open TradingView Chart'}</span>
          </button>
          <button
            onClick={onToggleWatchlist}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-colors cursor-pointer font-label-md text-label-md font-semibold border ${
              isWatchlisted
                ? 'bg-primary/15 text-primary border-primary'
                : 'bg-surface-container-highest text-on-surface hover:text-primary border-outline-variant/30'
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">
              {isWatchlisted ? 'star_rate' : 'star'}
            </span>
            <span>{isWatchlisted ? 'Watchlisted' : 'Add to Watchlist'}</span>
          </button>
          <button
            onClick={onOpenAlertModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-surface-container-highest text-on-surface hover:text-primary border border-outline-variant/30 font-label-md text-label-md font-semibold transition-colors cursor-pointer"
            title="Set Price Alert"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">notifications_active</span>
            <span>Price Alert</span>
          </button>
        </div>
      </section>

      {/* 2. MAIN WORKSPACE: CHART & STATS BENTO */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md items-start">
        {/* CHART CONTAINER (8 COLS) */}
        <div className="lg:col-span-8 flex flex-col bg-surface-container rounded-xl shadow-md overflow-hidden border border-outline-variant/20">
          {/* Toolbar Top */}
          <div className="p-space-sm bg-surface-container-low flex flex-wrap items-center justify-between gap-space-sm border-b border-outline-variant/20">
            {/* Chart Engine Switcher: TradingView vs Native Technicals */}
            <div className="flex items-center gap-1 bg-surface-container-lowest p-1 rounded-lg border border-primary/30">
              <button
                onClick={() => setChartEngine('tradingview')}
                className={`px-3 py-1 rounded font-mono-xs text-mono-xs flex items-center gap-1 cursor-pointer transition-colors ${
                  chartEngine === 'tradingview'
                    ? 'bg-primary text-black font-bold shadow-sm'
                    : 'text-outline hover:text-on-surface'
                }`}
                type="button"
              >
                <span className="material-symbols-outlined text-[14px]">candlestick_chart</span>
                <span>TradingView Live</span>
              </button>
              <button
                onClick={() => setChartEngine('native')}
                className={`px-3 py-1 rounded font-mono-xs text-mono-xs flex items-center gap-1 cursor-pointer transition-colors ${
                  chartEngine === 'native'
                    ? 'bg-primary text-black font-bold shadow-sm'
                    : 'text-outline hover:text-on-surface'
                }`}
                type="button"
              >
                <span className="material-symbols-outlined text-[14px]">insights</span>
                <span>Technicals Engine</span>
              </button>
            </div>

            {/* Timeframes & Indicators (for Native or Quick Filter) */}
            {chartEngine === 'native' && (
              <div className="flex items-center gap-1 bg-surface-container-lowest p-1 rounded-lg border border-outline-variant/30">
                {(['1D', '1W', '1M', '6M', '1Y', '5Y', 'ALL'] as const).map(tf => (
                  <button
                    key={tf}
                    onClick={() => setSelectedTimeframe(tf)}
                    className={`px-2 py-0.5 rounded font-mono-xs text-mono-xs transition-colors cursor-pointer ${
                      selectedTimeframe === tf
                        ? 'bg-primary text-black font-bold shadow-sm'
                        : 'text-outline hover:text-on-surface'
                    }`}
                    type="button"
                  >
                    {tf}
                  </button>
                ))}
              </div>
            )}

            {/* Resolution & Indicators */}
            {chartEngine === 'native' && (
              <div className="flex items-center gap-space-xs flex-wrap">
                <div className="flex items-center gap-0.5 bg-surface-container-lowest p-1 rounded-lg font-mono-xs text-mono-xs text-on-surface-variant border border-outline-variant/30">
                  {(['1m', '5m', '15m', '1H', '1D'] as const).map(res => (
                    <button
                      key={res}
                      onClick={() => setSelectedResolution(res)}
                      className={`px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
                        selectedResolution === res
                          ? 'bg-surface-container-highest text-primary font-bold'
                          : 'hover:bg-surface-container text-on-surface-variant'
                      }`}
                      type="button"
                    >
                      {res}
                    </button>
                  ))}
                </div>

                <div className="hidden sm:flex items-center gap-1">
                  {showEma && (
                    <span className="px-2 py-1 rounded bg-surface-container-highest font-mono-xs text-mono-xs text-primary flex items-center gap-1">
                      EMA (20,50)
                      <button
                        type="button"
                        onClick={() => setShowEma(false)}
                        className="material-symbols-outlined text-[12px] cursor-pointer hover:text-on-surface"
                      >
                        close
                      </button>
                    </span>
                  )}
                  {showRsi && (
                    <span className="px-2 py-1 rounded bg-surface-container-highest font-mono-xs text-mono-xs text-primary flex items-center gap-1">
                      RSI (14)
                      <button
                        type="button"
                        onClick={() => setShowRsi(false)}
                        className="material-symbols-outlined text-[12px] cursor-pointer hover:text-on-surface"
                      >
                        close
                      </button>
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* If TradingView Engine is selected */}
          {chartEngine === 'tradingview' && (
            <div className="p-space-xs bg-black h-[540px] w-full">
              <TradingViewChart
                symbol={`BSE:${stock.symbol}`}
                interval="D"
                height="100%"
                containerId="stock-details-tv"
              />
            </div>
          )}

          {/* Chart Viewport with Drawing Sidebar (Native Engine) */}
          {chartEngine === 'native' && (
            <div className="flex w-full relative">
              {/* Drawing Toolbar (Hairline Left) */}
              <div className="w-10 bg-surface-container-lowest flex flex-col items-center py-2 gap-2 text-outline border-r border-outline-variant/20">
              {[
                { id: 'trendline', icon: 'show_chart', title: 'Trendline' },
                { id: 'ray', icon: 'horizontal_rule', title: 'Horizontal Ray' },
                { id: 'fib', icon: 'stacked_bar_chart', title: 'Fibonacci Retracement' },
                { id: 'text', icon: 'title', title: 'Text Note' },
                { id: 'ruler', icon: 'straighten', title: 'Ruler' },
              ].map(tool => (
                <button
                  key={tool.id}
                  onClick={() =>
                    setActiveDrawingTool(activeDrawingTool === tool.id ? null : tool.id)
                  }
                  className={`p-1 transition-colors cursor-pointer rounded ${
                    activeDrawingTool === tool.id
                      ? 'text-primary bg-primary/20'
                      : 'hover:text-primary'
                  }`}
                  title={tool.title}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">{tool.icon}</span>
                </button>
              ))}
              <button
                onClick={() => setActiveDrawingTool(null)}
                className="p-1 hover:text-primary transition-colors cursor-pointer"
                title="Erase"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">delete</span>
              </button>
            </div>

            {/* SVG Candlestick & Technicals Engine */}
            <div className="flex-1 bg-surface-container p-2 flex flex-col justify-between select-none relative">
              {/* Price Legend Overlay */}
              <div className="flex items-center gap-space-md font-mono-xs text-mono-xs text-outline px-2 py-1 z-10 bg-surface-container/85 backdrop-blur-sm rounded border border-outline-variant/20 overflow-x-auto whitespace-nowrap">
                <span>
                  O: <strong className="text-on-surface">2,962.10</strong>
                </span>
                <span>
                  H: <strong className="text-secondary">2,998.40</strong>
                </span>
                <span>
                  L: <strong className="text-tertiary">2,954.00</strong>
                </span>
                <span>
                  C: <strong className="text-secondary">2,984.50</strong>
                </span>
                {showEma && (
                  <>
                    <span className="text-primary font-medium">EMA(20): 2,940.12</span>
                    <span className="text-surface-tint font-medium">EMA(50): 2,904.85</span>
                  </>
                )}
                {activeDrawingTool && (
                  <span className="text-secondary font-bold">
                    [Tool: {activeDrawingTool.toUpperCase()}]
                  </span>
                )}
              </div>

              {/* Main SVG Canvas */}
              <div className="relative w-full">
                <svg
                  className="w-full h-80 overflow-visible text-outline-variant/40 cursor-crosshair"
                  preserveAspectRatio="none"
                  viewBox="0 0 800 360"
                  onMouseLeave={() => setHoveredCandle(null)}
                >
                  {/* Gridlines */}
                  <line stroke="currentColor" strokeDasharray="3 3" x1="0" x2="800" y1="40" y2="40" />
                  <line stroke="currentColor" strokeDasharray="3 3" x1="0" x2="800" y1="100" y2="100" />
                  <line stroke="currentColor" strokeDasharray="3 3" x1="0" x2="800" y1="160" y2="160" />
                  <line stroke="currentColor" strokeDasharray="3 3" x1="0" x2="800" y1="220" y2="220" />
                  <line stroke="currentColor" x1="0" x2="800" y1="280" y2="280" />

                  {/* Price Axis Scale on the Right */}
                  <text className="font-mono-xs text-[10px]" fill="#8c909f" x="740" y="44">
                    3,020.00
                  </text>
                  <text className="font-mono-xs text-[10px]" fill="#8c909f" x="740" y="104">
                    2,980.00
                  </text>
                  <text className="font-mono-xs text-[10px]" fill="#8c909f" x="740" y="164">
                    2,940.00
                  </text>
                  <text className="font-mono-xs text-[10px]" fill="#8c909f" x="740" y="224">
                    2,900.00
                  </text>

                  {/* Resistance Line (₹3,000 Key Level) */}
                  <line
                    opacity="0.8"
                    stroke="#ff5263"
                    strokeDasharray="4 4"
                    strokeWidth="1.5"
                    x1="0"
                    x2="730"
                    y1="75"
                    y2="75"
                  />
                  <text className="font-mono-xs text-[9px] font-bold" fill="#ff5263" x="10" y="70">
                    R1: 3,000.00 (Psychological Barrier)
                  </text>

                  {/* Support Level (₹2,920 Level) */}
                  <line
                    opacity="0.8"
                    stroke="#03c177"
                    strokeDasharray="4 4"
                    strokeWidth="1.5"
                    x1="0"
                    x2="730"
                    y1="205"
                    y2="205"
                  />
                  <text className="font-mono-xs text-[9px] font-bold" fill="#03c177" x="10" y="200">
                    S1: 2,920.00 (Institutional Demand)
                  </text>

                  {/* Dynamic EMA 20 & 50 Curves */}
                  {showEma && (
                    <>
                      <path
                        d="M 20 220 Q 150 200, 260 170 T 480 130 T 640 110 T 730 95"
                        fill="none"
                        opacity="0.9"
                        stroke="#adc6ff"
                        strokeWidth="2"
                      />
                      <path
                        d="M 20 250 Q 180 230, 320 210 T 520 170 T 730 140"
                        fill="none"
                        opacity="0.7"
                        stroke="#4d8eff"
                        strokeDasharray="2 2"
                        strokeWidth="1.5"
                      />
                    </>
                  )}

                  {/* CANDLESTICKS SEQUENCE */}
                  {/* 1. Green */}
                  <line stroke="#44e092" strokeWidth="1.5" x1="40" x2="40" y1="210" y2="245" />
                  <rect fill="#44e092" height="20" rx="1" width="12" x="34" y="218" />
                  {/* 2. Green */}
                  <line stroke="#44e092" strokeWidth="1.5" x1="75" x2="75" y1="195" y2="235" />
                  <rect fill="#44e092" height="25" rx="1" width="12" x="69" y="202" />
                  {/* 3. Red */}
                  <line stroke="#ffb4ab" strokeWidth="1.5" x1="110" x2="110" y1="190" y2="230" />
                  <rect fill="#ff5263" height="18" rx="1" width="12" x="104" y="200" />
                  {/* 4. Green */}
                  <line stroke="#44e092" strokeWidth="1.5" x1="145" x2="145" y1="180" y2="220" />
                  <rect fill="#44e092" height="25" rx="1" width="12" x="139" y="185" />
                  {/* 5. Green Breakout */}
                  <line stroke="#44e092" strokeWidth="1.5" x1="180" x2="180" y1="160" y2="200" />
                  <rect fill="#44e092" height="30" rx="1" width="12" x="174" y="165" />
                  {/* 6. Red Retest */}
                  <line stroke="#ffb4ab" strokeWidth="1.5" x1="215" x2="215" y1="162" y2="195" />
                  <rect fill="#ff5263" height="15" rx="1" width="12" x="209" y="170" />
                  {/* 7. Green */}
                  <line stroke="#44e092" strokeWidth="1.5" x1="250" x2="250" y1="150" y2="188" />
                  <rect fill="#44e092" height="22" rx="1" width="12" x="244" y="154" />
                  {/* 8. Green Consolidation */}
                  <line stroke="#44e092" strokeWidth="1.5" x1="285" x2="285" y1="145" y2="175" />
                  <rect fill="#44e092" height="16" rx="1" width="12" x="279" y="148" />
                  {/* 9. Red Drop */}
                  <line stroke="#ffb4ab" strokeWidth="1.5" x1="320" x2="320" y1="140" y2="185" />
                  <rect fill="#ff5263" height="24" rx="1" width="12" x="314" y="152" />
                  {/* 10. Hammer Green */}
                  <line stroke="#44e092" strokeWidth="1.5" x1="355" x2="355" y1="145" y2="195" />
                  <rect fill="#44e092" height="12" rx="1" width="12" x="349" y="148" />
                  {/* 11. Strong Green */}
                  <line stroke="#44e092" strokeWidth="1.5" x1="390" x2="390" y1="125" y2="160" />
                  <rect fill="#44e092" height="25" rx="1" width="12" x="384" y="130" />
                  {/* 12. Green Continuation */}
                  <line stroke="#44e092" strokeWidth="1.5" x1="425" x2="425" y1="110" y2="145" />
                  <rect fill="#44e092" height="24" rx="1" width="12" x="419" y="115" />
                  {/* 13. Red Pullback */}
                  <line stroke="#ffb4ab" strokeWidth="1.5" x1="460" x2="460" y1="112" y2="148" />
                  <rect fill="#ff5263" height="16" rx="1" width="12" x="454" y="120" />
                  {/* 14. Green */}
                  <line stroke="#44e092" strokeWidth="1.5" x1="495" x2="495" y1="100" y2="135" />
                  <rect fill="#44e092" height="22" rx="1" width="12" x="489" y="105" />
                  {/* 15. Doji */}
                  <line stroke="#d4e4fa" strokeWidth="1.5" x1="530" x2="530" y1="95" y2="125" />
                  <rect fill="#d4e4fa" height="4" rx="0.5" width="12" x="524" y="108" />
                  {/* 16. Green Surge */}
                  <line stroke="#44e092" strokeWidth="1.5" x1="565" x2="565" y1="85" y2="118" />
                  <rect fill="#44e092" height="24" rx="1" width="12" x="559" y="90" />
                  {/* 17. Red Wick */}
                  <line stroke="#ffb4ab" strokeWidth="1.5" x1="600" x2="600" y1="78" y2="115" />
                  <rect fill="#ff5263" height="18" rx="1" width="12" x="594" y="85" />
                  {/* 18. Green Push */}
                  <line stroke="#44e092" strokeWidth="1.5" x1="635" x2="635" y1="70" y2="105" />
                  <rect fill="#44e092" height="22" rx="1" width="12" x="629" y="75" />
                  {/* 19. Green */}
                  <line stroke="#44e092" strokeWidth="1.5" x1="670" x2="670" y1="65" y2="98" />
                  <rect fill="#44e092" height="20" rx="1" width="12" x="664" y="68" />
                  {/* 20. Live Candle with pulse indicator */}
                  <line stroke="#44e092" strokeWidth="1.5" x1="705" x2="705" y1="58" y2="92" />
                  <rect fill="#44e092" height="24" rx="1" width="12" x="699" y="62" />
                  {/* Current Price Pulsing Tag */}
                  <circle className="animate-ping" cx="705" cy="62" fill="#66fdac" r="3" />
                  <circle cx="705" cy="62" fill="#03c177" r="3" />

                  {/* BASE VOLUME HISTOGRAM (Bottom 60px) */}
                  <rect fill="#44e092" height="25" opacity="0.3" width="10" x="35" y="255" />
                  <rect fill="#44e092" height="30" opacity="0.3" width="10" x="70" y="250" />
                  <rect fill="#ff5263" height="20" opacity="0.3" width="10" x="105" y="260" />
                  <rect fill="#44e092" height="40" opacity="0.4" width="10" x="140" y="240" />
                  <rect fill="#44e092" height="45" opacity="0.5" width="10" x="175" y="235" />
                  <rect fill="#ff5263" height="18" opacity="0.25" width="10" x="210" y="262" />
                  <rect fill="#44e092" height="28" opacity="0.3" width="10" x="245" y="252" />
                  <rect fill="#44e092" height="22" opacity="0.3" width="10" x="280" y="258" />
                  <rect fill="#ff5263" height="35" opacity="0.4" width="10" x="315" y="245" />
                  <rect fill="#44e092" height="20" opacity="0.3" width="10" x="350" y="260" />
                  <rect fill="#44e092" height="42" opacity="0.45" width="10" x="385" y="238" />
                  <rect fill="#44e092" height="38" opacity="0.4" width="10" x="420" y="242" />
                  <rect fill="#ff5263" height="16" opacity="0.25" width="10" x="455" y="264" />
                  <rect fill="#44e092" height="32" opacity="0.35" width="10" x="490" y="248" />
                  <rect fill="#d4e4fa" height="14" opacity="0.2" width="10" x="525" y="266" />
                  <rect fill="#44e092" height="48" opacity="0.6" width="10" x="560" y="232" />
                  <rect fill="#ff5263" height="30" opacity="0.35" width="10" x="595" y="250" />
                  <rect fill="#44e092" height="40" opacity="0.45" width="10" x="630" y="240" />
                  <rect fill="#44e092" height="45" opacity="0.5" width="10" x="665" y="235" />
                  <rect fill="#44e092" height="52" opacity="0.7" width="10" x="700" y="228" />

                  {/* Active drawing tool indicator line if user selected ray */}
                  {activeDrawingTool === 'ray' && (
                    <line stroke="#adc6ff" strokeDasharray="3 3" strokeWidth="2" x1="0" x2="800" y1="120" y2="120" />
                  )}
                  {activeDrawingTool === 'trendline' && (
                    <line stroke="#66fdac" strokeWidth="2" x1="140" x2="705" y1="210" y2="80" />
                  )}
                </svg>

                {hoveredCandle && (
                  <div
                    className="absolute bg-surface-container-highest p-2 rounded shadow-lg border border-outline-variant/40 font-mono-xs text-mono-xs pointer-events-none z-20"
                    style={{ left: Math.min(hoveredCandle.x, 600), top: 10 }}
                  >
                    <div>Open: ₹{hoveredCandle.open}</div>
                    <div>High: ₹{hoveredCandle.high}</div>
                    <div>Low: ₹{hoveredCandle.low}</div>
                    <div>Close: ₹{hoveredCandle.close}</div>
                    <div>Vol: {hoveredCandle.vol}</div>
                  </div>
                )}
              </div>

              {/* SUB-CHART: RSI (14) OSCILLATOR PANE */}
              {showRsi && (
                <div className="mt-2 pt-2 bg-surface-container-low/70 rounded p-2 flex flex-col gap-1 border border-outline-variant/20">
                  <div className="flex items-center justify-between font-mono-xs text-mono-xs">
                    <span className="text-surface-tint font-semibold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-surface-tint" />
                      RSI (14) Close
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-secondary font-bold font-mono-sm">62.40</span>
                      <span className="text-outline">Overbought: 70 | Oversold: 30</span>
                    </div>
                  </div>
                  <svg className="w-full h-12 overflow-visible" preserveAspectRatio="none" viewBox="0 0 800 50">
                    {/* RSI Baseline Levels */}
                    <line opacity="0.4" stroke="#ff5263" strokeDasharray="2 2" strokeWidth="1" x1="0" x2="800" y1="12" y2="12" />
                    <line opacity="0.3" stroke="#8c909f" strokeDasharray="1 3" strokeWidth="1" x1="0" x2="800" y1="25" y2="25" />
                    <line opacity="0.4" stroke="#44e092" strokeDasharray="2 2" strokeWidth="1" x1="0" x2="800" y1="38" y2="38" />
                    {/* RSI Dynamic Trajectory Line */}
                    <path
                      d="M 20 36 Q 100 42, 180 32 T 340 38 T 460 22 T 580 18 T 720 16"
                      fill="none"
                      stroke="#adc6ff"
                      strokeWidth="1.8"
                    />
                    {/* Active RSI Cursor Head */}
                    <circle cx="720" cy="16" fill="#adc6ff" r="3" />
                  </svg>
                </div>
              )}
            </div>
          </div>
          )}
        </div>

        {/* 3. KEY STATS & FUNDAMENTALS (4 COLS) */}
        <div className="lg:col-span-4 flex flex-col gap-space-md">
          {/* Valuation & Snapshot Card */}
          <div className="bg-surface-container rounded-xl shadow-md p-space-md flex flex-col gap-space-md border border-outline-variant/20">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
              <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
                Key Fundamentals
              </h2>
              <span className="font-mono-xs text-mono-xs px-2 py-0.5 rounded bg-surface-container-highest text-secondary font-semibold">
                Q3 FY25 TTM
              </span>
            </div>

            {/* 52-Week Range Slider Visualization */}
            <div className="bg-surface-container-lowest p-space-sm rounded-lg flex flex-col gap-1.5 border border-outline-variant/30">
              <div className="flex items-center justify-between font-mono-xs text-mono-xs text-outline">
                <span>
                  52W Low: <strong className="text-on-surface">₹{stock.week52Low.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
                </span>
                <span>
                  52W High: <strong className="text-on-surface">₹{stock.week52High.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-surface-container-highest relative overflow-visible my-1">
                <div className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-tertiary-container via-primary to-secondary rounded-full w-full opacity-60" />
                {/* Indicator Pin for Current Price */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center"
                  style={{ left: `${stock.rangePositionPercent}%` }}
                >
                  <span className="w-3 h-3 bg-secondary rounded-full shadow-[0_0_8px_rgba(68,224,146,0.8)] border border-surface-container-lowest" />
                </div>
              </div>
              <div className="flex items-center justify-between font-mono-xs text-mono-xs">
                <span className="text-outline">Range Position</span>
                <span className="text-secondary font-bold">{stock.rangePositionPercent}% (Near High)</span>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-space-sm font-mono-xs text-mono-xs">
              <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col border border-outline-variant/20">
                <span className="text-outline uppercase font-label-sm text-label-sm">Market Cap</span>
                <span className="font-mono-sm text-mono-sm font-bold text-on-surface mt-0.5">
                  {stock.marketCapCr}
                </span>
                <span className="text-surface-tint font-mono-xs text-[10px]">{stock.marketCapUsd}</span>
              </div>
              <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col border border-outline-variant/20">
                <span className="text-outline uppercase font-label-sm text-label-sm">P/E Ratio</span>
                <span className="font-mono-sm text-mono-sm font-bold text-on-surface mt-0.5">
                  {stock.peRatio.toFixed(2)}
                </span>
                <span className="text-outline font-mono-xs text-[10px]">Ind. P/E: {stock.indPeRatio.toFixed(2)}</span>
              </div>
              <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col border border-outline-variant/20">
                <span className="text-outline uppercase font-label-sm text-label-sm">P/B Ratio</span>
                <span className="font-mono-sm text-mono-sm font-bold text-on-surface mt-0.5">
                  {stock.pbRatio.toFixed(2)}
                </span>
                <span className="text-outline font-mono-xs text-[10px]">{stock.pbEvaluation}</span>
              </div>
              <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col border border-outline-variant/20">
                <span className="text-outline uppercase font-label-sm text-label-sm">EPS (TTM)</span>
                <span className="font-mono-sm text-mono-sm font-bold text-secondary mt-0.5">
                  ₹{stock.epsTtm.toFixed(2)}
                </span>
                <span className="text-secondary font-mono-xs text-[10px]">{stock.epsGrowthYoY}</span>
              </div>
              <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col border border-outline-variant/20">
                <span className="text-outline uppercase font-label-sm text-label-sm">Dividend Yield</span>
                <span className="font-mono-sm text-mono-sm font-bold text-on-surface mt-0.5">
                  {stock.dividendYield.toFixed(2)}%
                </span>
                <span className="text-outline font-mono-xs text-[10px]">{stock.dividendPerShare}</span>
              </div>
              <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col border border-outline-variant/20">
                <span className="text-outline uppercase font-label-sm text-label-sm">Beta (1Y)</span>
                <span className="font-mono-sm text-mono-sm font-bold text-primary mt-0.5">
                  {stock.beta1Y.toFixed(2)}
                </span>
                <span className="text-primary font-mono-xs text-[10px]">{stock.betaVolatility}</span>
              </div>
              <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col border border-outline-variant/20">
                <span className="text-outline uppercase font-label-sm text-label-sm">Face Value</span>
                <span className="font-mono-sm text-mono-sm font-bold text-on-surface mt-0.5">
                  ₹{stock.faceValue.toFixed(2)}
                </span>
                <span className="text-outline font-mono-xs text-[10px]">{stock.series}</span>
              </div>
              <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col border border-outline-variant/20">
                <span className="text-outline uppercase font-label-sm text-label-sm">Book Value</span>
                <span className="font-mono-sm text-mono-sm font-bold text-on-surface mt-0.5">
                  ₹{stock.bookValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-outline font-mono-xs text-[10px]">Per share</span>
              </div>
            </div>
          </div>

          {/* Quick Executive Insight Banner */}
          <div className="bg-surface-container rounded-xl shadow-md p-space-md flex flex-col gap-space-sm relative overflow-hidden border border-outline-variant/20">
            <div className="flex items-center gap-space-sm">
              <span className="material-symbols-outlined text-primary text-[22px]">insights</span>
              <span className="font-headline-md text-headline-md font-semibold text-on-surface">
                Alpha Signal
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              {stock.alphaSignalSummary}
            </p>
          </div>
        </div>
      </div>

      {/* 4. HISTORICAL RETURNS COMPARISON GRID */}
      <section className="w-full bg-surface-container rounded-xl shadow-md p-space-md flex flex-col gap-space-sm border border-outline-variant/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[20px]">query_stats</span>
            <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
              Historical Performance &amp; Alpha Tracking
            </h2>
          </div>
          <span className="font-mono-xs text-mono-xs text-outline">
            Benchmark: NIFTY 50 Total Return Index (TRI)
          </span>
        </div>

        {/* Returns Grid Table */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left font-mono-xs text-mono-xs">
            <thead>
              <tr className="bg-surface-container-lowest text-outline font-label-sm text-label-sm uppercase">
                <th className="py-2.5 px-3 rounded-l-lg">Asset / Period</th>
                {stock.historicalAlpha.map(col => (
                  <th key={col.period} className="py-2.5 px-3 text-right">
                    {col.period}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y-0">
              {/* Row: Stock */}
              <tr className="bg-surface-container hover:bg-surface-container-high transition-colors">
                <td className="py-2.5 px-3 font-semibold text-on-surface flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  {stock.symbol}
                </td>
                {stock.historicalAlpha.map(col => (
                  <td
                    key={col.period}
                    className={`py-2.5 px-3 text-right font-bold ${
                      col.stockReturn >= 0 ? 'text-secondary' : 'text-tertiary'
                    }`}
                  >
                    {col.stockReturn >= 0 ? '+' : ''}{col.stockReturn.toFixed(2)}%
                  </td>
                ))}
              </tr>

              {/* Row: NIFTY 50 */}
              <tr className="bg-surface-container-low hover:bg-surface-container-high transition-colors text-outline">
                <td className="py-2.5 px-3 font-medium text-on-surface-variant flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-outline" />
                  NIFTY 50
                </td>
                {stock.historicalAlpha.map(col => (
                  <td key={col.period} className="py-2.5 px-3 text-right text-secondary">
                    +{col.benchmarkReturn.toFixed(2)}%
                  </td>
                ))}
              </tr>

              {/* Row: Alpha (Spread) */}
              <tr className="bg-surface-container-lowest font-semibold">
                <td className="py-2 px-3 text-primary uppercase font-label-sm text-label-sm">
                  Alpha / Spread
                </td>
                {stock.historicalAlpha.map(col => (
                  <td
                    key={col.period}
                    className={`py-2 px-3 text-right font-mono-xs font-bold ${
                      col.alpha >= 0 ? 'text-secondary' : 'text-tertiary'
                    }`}
                  >
                    {col.alpha >= 0 ? '+' : ''}{col.alpha.toFixed(2)}%
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 5. CONTENT TABS WORKSPACE */}
      <section className="w-full bg-surface-container rounded-xl shadow-md p-space-md flex flex-col gap-space-md border border-outline-variant/20">
        {/* Tab Navigation Bar */}
        <div className="flex items-center gap-1 overflow-x-auto bg-surface-container-lowest p-1 rounded-lg border border-outline-variant/30 scrollbar-none">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'financials', label: 'Financials & P&L' },
            { id: 'shareholding', label: 'Shareholding Pattern' },
            { id: 'quarterly', label: 'Quarterly Results' },
            { id: 'analysts', label: 'Analyst Ratings & News' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 py-2 rounded font-label-md text-label-md transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-surface-container-high text-on-surface font-bold shadow-sm'
                  : 'text-outline hover:text-on-surface hover:bg-surface-container'
              }`}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md items-start">
            {/* Business Profile & Segments (7 COLS) */}
            <div className="lg:col-span-7 flex flex-col gap-space-md">
              <div className="flex flex-col gap-space-xs">
                <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
                  Company Profile
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  {stock.profile}
                </p>
              </div>

              {/* Segment Breakdown Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm">
                {stock.segments.map(seg => (
                  <div
                    key={seg.name}
                    className="p-space-sm bg-surface-container-low rounded-lg flex flex-col gap-1 border border-outline-variant/20"
                  >
                    <span className="material-symbols-outlined text-primary text-[20px]">
                      {seg.icon}
                    </span>
                    <span className="font-label-md text-label-md text-on-surface font-semibold">
                      {seg.name}
                    </span>
                    <span className="font-mono-xs text-mono-xs text-outline">
                      {seg.description}
                    </span>
                  </div>
                ))}
              </div>

              {/* Ownership Breakdown */}
              <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col gap-space-sm border border-outline-variant/20">
                <div className="flex items-center justify-between">
                  <h4 className="font-label-md text-label-md font-semibold text-on-surface">
                    Shareholding Distribution
                  </h4>
                  <span className="font-mono-xs text-mono-xs text-outline">As of Dec 2024</span>
                </div>
                {/* Segmented Pill Bar */}
                <div className="w-full h-3 rounded-full bg-surface-container-lowest flex overflow-hidden">
                  <div
                    className="bg-primary h-full"
                    style={{ width: `${stock.shareholding.promoters}%` }}
                    title={`Promoters: ${stock.shareholding.promoters}%`}
                  />
                  <div
                    className="bg-secondary h-full"
                    style={{ width: `${stock.shareholding.fii}%` }}
                    title={`FII: ${stock.shareholding.fii}%`}
                  />
                  <div
                    className="bg-surface-bright h-full"
                    style={{ width: `${stock.shareholding.dii}%` }}
                    title={`DII: ${stock.shareholding.dii}%`}
                  />
                  <div
                    className="bg-outline h-full"
                    style={{ width: `${stock.shareholding.retail}%` }}
                    title={`Public / Retail: ${stock.shareholding.retail}%`}
                  />
                </div>
                {/* Legend Tags */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono-xs text-mono-xs pt-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-primary" />
                    <span className="text-on-surface font-medium">
                      Promoters: {stock.shareholding.promoters}%
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-secondary" />
                    <span className="text-on-surface font-medium">
                      FII: {stock.shareholding.fii}%
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-surface-bright" />
                    <span className="text-on-surface font-medium">
                      DII: {stock.shareholding.dii}%
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-outline" />
                    <span className="text-on-surface font-medium">
                      Retail: {stock.shareholding.retail}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Analyst Consensus & Price Targets (5 COLS) */}
            <div className="lg:col-span-5 bg-surface-container-low rounded-xl p-space-md flex flex-col gap-space-md border border-outline-variant/20">
              <div className="flex items-center justify-between">
                <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
                  Analyst Ratings
                </h3>
                <span className="font-mono-xs text-mono-xs px-2 py-0.5 rounded bg-surface-container-high text-primary font-bold">
                  {stock.analystRatings.coverageHouses} Coverage Houses
                </span>
              </div>

              <div className="flex items-center gap-space-md bg-surface-container-lowest p-space-sm rounded-lg border border-outline-variant/30">
                <div className="flex flex-col">
                  <span className="font-headline-xl text-headline-xl font-bold text-secondary leading-none">
                    {stock.analystRatings.buyPercent}%
                  </span>
                  <span className="font-label-sm text-label-sm text-outline mt-1 uppercase">
                    Buy Consensus
                  </span>
                </div>
                <div className="flex-1 flex flex-col gap-1.5">
                  {/* Buy Bar */}
                  <div className="flex items-center gap-2 font-mono-xs text-mono-xs">
                    <span className="w-10 text-secondary font-medium">Buy</span>
                    <div className="flex-1 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                      <div
                        className="h-full bg-secondary rounded-full"
                        style={{ width: `${stock.analystRatings.buyPercent}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-on-surface font-semibold">
                      {stock.analystRatings.buyPercent}%
                    </span>
                  </div>
                  {/* Hold Bar */}
                  <div className="flex items-center gap-2 font-mono-xs text-mono-xs">
                    <span className="w-10 text-outline font-medium">Hold</span>
                    <div className="flex-1 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                      <div
                        className="h-full bg-outline rounded-full"
                        style={{ width: `${stock.analystRatings.holdPercent}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-on-surface font-semibold">
                      {stock.analystRatings.holdPercent}%
                    </span>
                  </div>
                  {/* Sell Bar */}
                  <div className="flex items-center gap-2 font-mono-xs text-mono-xs">
                    <span className="w-10 text-tertiary font-medium">Sell</span>
                    <div className="flex-1 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                      <div
                        className="h-full bg-tertiary-container rounded-full"
                        style={{ width: `${stock.analystRatings.sellPercent}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-on-surface font-semibold">
                      {stock.analystRatings.sellPercent}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Consensus Target Price */}
              <div className="bg-surface-container-lowest p-space-sm rounded-lg flex items-center justify-between border border-outline-variant/30">
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-outline uppercase">
                    Consensus 12M Target
                  </span>
                  <span className="font-mono-lg text-mono-lg font-bold text-primary mt-0.5">
                    ₹{stock.analystRatings.consensusTarget.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-mono-xs text-mono-xs text-secondary font-bold">
                    +{stock.analystRatings.upsidePercent.toFixed(2)}% Upside
                  </span>
                  <span className="font-mono-xs text-mono-xs text-outline">
                    High: ₹{stock.analystRatings.targetHigh.toLocaleString()} | Low: ₹{stock.analystRatings.targetLow.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Latest Research Note Preview */}
              <div className="flex items-start gap-space-sm pt-1">
                <span className="material-symbols-outlined text-primary text-[20px] mt-0.5 shrink-0">
                  verified
                </span>
                <div className="flex flex-col font-body-sm text-body-sm">
                  <span className="text-on-surface font-semibold">
                    {stock.analystRatings.latestNoteAuthor}
                  </span>
                  <span className="text-outline text-xs mt-0.5 leading-relaxed">
                    &quot;{stock.analystRatings.latestNoteQuote}&quot;
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: FINANCIALS & P&L */}
        {activeTab === 'financials' && (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left font-mono-xs text-mono-xs">
              <thead>
                <tr className="bg-surface-container-lowest text-outline font-label-sm uppercase">
                  <th className="py-2.5 px-3 rounded-l-lg">Metric (₹ in Crores)</th>
                  {stock.financials.map(f => (
                    <th key={f.year} className="py-2.5 px-3 text-right">
                      {f.year}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                <tr className="hover:bg-surface-container-high transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-on-surface">Revenue from Operations</td>
                  {stock.financials.map(f => (
                    <td key={f.year} className="py-2.5 px-3 text-right font-semibold text-on-surface">
                      ₹{f.revenueCr.toLocaleString()} Cr
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-surface-container-high transition-colors">
                  <td className="py-2.5 px-3 font-medium text-outline">Operating EBITDA</td>
                  {stock.financials.map(f => (
                    <td key={f.year} className="py-2.5 px-3 text-right text-primary font-medium">
                      ₹{f.ebitdaCr.toLocaleString()} Cr
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-surface-container-high transition-colors">
                  <td className="py-2.5 px-3 font-medium text-outline">Operating Margin (%)</td>
                  {stock.financials.map(f => (
                    <td key={f.year} className="py-2.5 px-3 text-right text-secondary font-medium">
                      {f.marginPercent.toFixed(2)}%
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-surface-container-high transition-colors">
                  <td className="py-2.5 px-3 font-bold text-secondary">Net Profit After Tax (PAT)</td>
                  {stock.financials.map(f => (
                    <td key={f.year} className="py-2.5 px-3 text-right font-bold text-secondary">
                      ₹{f.netProfitCr.toLocaleString()} Cr
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: SHAREHOLDING PATTERN */}
        {activeTab === 'shareholding' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
            <div className="bg-surface-container-low p-space-md rounded-lg border border-outline-variant/20">
              <span className="font-label-md text-label-md text-primary font-semibold">Promoter Holdings</span>
              <p className="font-mono-xl text-mono-xl font-bold text-on-surface mt-2">{stock.shareholding.promoters}%</p>
              <p className="font-mono-xs text-mono-xs text-outline mt-1">Pledge Status: 0.00% (Clean balance sheet)</p>
            </div>
            <div className="bg-surface-container-low p-space-md rounded-lg border border-outline-variant/20">
              <span className="font-label-md text-label-md text-secondary font-semibold">FII / Foreign Institutional</span>
              <p className="font-mono-xl text-mono-xl font-bold text-secondary mt-2">{stock.shareholding.fii}%</p>
              <p className="font-mono-xs text-mono-xs text-outline mt-1">Held across 2,410 foreign portfolio accounts</p>
            </div>
            <div className="bg-surface-container-low p-space-md rounded-lg border border-outline-variant/20">
              <span className="font-label-md text-label-md text-surface-tint font-semibold">DII / Mutual Funds &amp; Insurance</span>
              <p className="font-mono-xl text-mono-xl font-bold text-surface-tint mt-2">{stock.shareholding.dii}%</p>
              <p className="font-mono-xs text-mono-xs text-outline mt-1">Key holders: LIC, SBI MF, HDFC MF, ICICI Pru</p>
            </div>
          </div>
        )}

        {/* Tab 4: QUARTERLY RESULTS */}
        {activeTab === 'quarterly' && (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left font-mono-xs text-mono-xs">
              <thead>
                <tr className="bg-surface-container-lowest text-outline font-label-sm uppercase">
                  <th className="py-2.5 px-3 rounded-l-lg">Quarter Period</th>
                  <th className="py-2.5 px-3 text-right">Revenue (Cr)</th>
                  <th className="py-2.5 px-3 text-right">Net Profit (Cr)</th>
                  <th className="py-2.5 px-3 text-right">EBITDA Margin</th>
                  <th className="py-2.5 px-3 text-right rounded-r-lg">YoY Growth</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {stock.quarterly.map(q => (
                  <tr key={q.quarter} className="hover:bg-surface-container-high transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-on-surface">{q.quarter}</td>
                    <td className="py-2.5 px-3 text-right text-on-surface font-medium">₹{q.revenueCr.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-right text-secondary font-bold">₹{q.netProfitCr.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-right text-primary">{q.marginPercent.toFixed(2)}%</td>
                    <td className="py-2.5 px-3 text-right text-secondary font-bold">+{q.yoyGrowth.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 5: ANALYST RATINGS & NEWS */}
        {activeTab === 'analysts' && (
          <div className="flex flex-col gap-space-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-sm">
              <div className="p-space-sm bg-surface-container-low rounded-lg border border-outline-variant/20">
                <span className="font-label-sm text-label-sm text-outline uppercase">Leading Brokerage Consensus</span>
                <div className="mt-2 space-y-1 font-mono-xs text-mono-xs">
                  <div className="flex justify-between py-1 border-b border-outline-variant/20">
                    <span className="text-on-surface">Morgan Stanley</span>
                    <span className="text-secondary font-bold">Overweight | Target ₹3,500</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-outline-variant/20">
                    <span className="text-on-surface">Goldman Sachs</span>
                    <span className="text-secondary font-bold">Buy | Target ₹3,420</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-outline-variant/20">
                    <span className="text-on-surface">Jefferies</span>
                    <span className="text-secondary font-bold">Buy | Target ₹3,380</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-on-surface">Nomura</span>
                    <span className="text-outline font-bold">Neutral | Target ₹3,050</span>
                  </div>
                </div>
              </div>

              <div className="p-space-sm bg-surface-container-low rounded-lg border border-outline-variant/20 flex flex-col justify-between">
                <div>
                  <span className="font-label-sm text-label-sm text-outline uppercase">Institutional Commentary</span>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 leading-relaxed">
                    &quot;Valuation multiple rerating expected as capital expenditure peak recedes in new energy gigafactories and telecom free cash flows expand.&quot;
                  </p>
                </div>
                <div className="pt-2 text-outline font-mono-xs text-mono-xs">
                  Source: Bloomberg Consensus Terminal · Oct 2026
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Verbatim Compliance Banner */}
      <div className="w-full bg-surface-container-lowest rounded-lg py-2 px-space-md text-center border border-outline-variant/20">
        <p className="font-mono-xs text-mono-xs text-outline">
          Market data is for informational purposes only and is not investment advice.
        </p>
      </div>
    </div>
  );
};
