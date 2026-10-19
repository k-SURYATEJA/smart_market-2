import React, { useState } from 'react';
import { FOREX_PAIRS } from '../../data/mockData';
import { TradingViewChart } from '../tradingview/TradingViewChart';

export const ForexTerminalView: React.FC = () => {
  const [selectedPair, setSelectedPair] = useState(FOREX_PAIRS[0]);
  const [chartMode, setChartMode] = useState<'tradingview' | 'native'>('tradingview');

  return (
    <div className="flex flex-col w-full gap-space-md">
      {/* Forex Rates Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-space-sm">
        {FOREX_PAIRS.map(item => (
          <div
            key={item.pair}
            onClick={() => setSelectedPair(item)}
            className={`p-space-sm rounded-xl border transition-all cursor-pointer ${
              selectedPair.pair === item.pair
                ? 'bg-primary/10 border-primary shadow-[0_0_8px_rgba(0,208,108,0.25)]'
                : 'bg-surface-container border-outline-variant/20 hover:border-outline'
            }`}
          >
            <div className="flex items-center justify-between font-mono-xs text-mono-xs">
              <span className="font-bold text-on-surface">{item.pair}</span>
              <span
                className={`font-semibold ${
                  item.change >= 0 ? 'text-secondary' : 'text-tertiary'
                }`}
              >
                {item.change >= 0 ? '+' : ''}
                {item.changePercent.toFixed(2)}%
              </span>
            </div>
            <div className="font-mono-lg text-mono-lg font-bold text-on-surface mt-1">
              {item.rate.toFixed(item.pair === 'USD/JPY' ? 2 : 4)}
            </div>
            <div className="text-[10px] text-outline mt-0.5 font-mono-xs">
              Spread: {item.spread} pips
            </div>
          </div>
        ))}
      </div>

      {/* Main Forex Workstation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md items-start">
        {/* Forex Chart Viewport (8 COLS) */}
        <div className="lg:col-span-8 flex flex-col bg-surface-container rounded-xl shadow-md border border-outline-variant/30 overflow-hidden">
          <div className="p-space-sm bg-surface-container-low border-b border-outline-variant/30 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">currency_exchange</span>
              <h3 className="font-headline-md font-bold text-on-surface">
                {selectedPair.pair} Technical Chart
              </h3>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-surface-container-lowest p-0.5 rounded border border-primary/30">
                <button
                  onClick={() => setChartMode('tradingview')}
                  className={`px-2.5 py-0.5 rounded font-mono-xs text-mono-xs cursor-pointer transition-colors ${
                    chartMode === 'tradingview' ? 'bg-primary text-black font-bold' : 'text-outline hover:text-on-surface'
                  }`}
                  type="button"
                >
                  TradingView
                </button>
                <button
                  onClick={() => setChartMode('native')}
                  className={`px-2.5 py-0.5 rounded font-mono-xs text-mono-xs cursor-pointer transition-colors ${
                    chartMode === 'native' ? 'bg-primary text-black font-bold' : 'text-outline hover:text-on-surface'
                  }`}
                  type="button"
                >
                  Tick Canvas
                </button>
              </div>

              <div className="hidden sm:flex items-center gap-2 font-mono-xs text-mono-xs">
                <span className="text-outline">High: {selectedPair.high}</span>
                <span className="text-outline">Low: {selectedPair.low}</span>
              </div>
            </div>
          </div>

          {chartMode === 'tradingview' ? (
            <div className="p-space-xs bg-black h-[480px] w-full">
              <TradingViewChart
                symbol={
                  selectedPair.pair === 'USD/INR'
                    ? 'FX_IDC:USDINR'
                    : `FX:${selectedPair.pair.replace('/', '')}`
                }
                interval="60"
                height="100%"
                containerId="forex-tv-chart"
              />
            </div>
          ) : (
            <div className="p-4 bg-surface-container">
              <svg
                className="w-full h-72 text-outline-variant/30"
                preserveAspectRatio="none"
                viewBox="0 0 700 280"
              >
                <line stroke="currentColor" strokeDasharray="2 2" x1="0" x2="700" y1="50" y2="50" />
                <line stroke="currentColor" strokeDasharray="2 2" x1="0" x2="700" y1="120" y2="120" />
                <line stroke="currentColor" strokeDasharray="2 2" x1="0" x2="700" y1="190" y2="190" />
                <line stroke="currentColor" x1="0" x2="700" y1="260" y2="260" />

                {/* Forex candles trajectory */}
                <path
                  d="M 20 180 Q 120 160, 220 140 T 420 110 T 560 90 T 680 75"
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="2"
                />
                <path
                  d="M 20 200 Q 140 185, 260 170 T 480 145 T 680 120"
                  fill="none"
                  stroke="#facc15"
                  strokeDasharray="3 3"
                  strokeWidth="1.5"
                />

                {/* Live tick marker */}
                <circle cx="680" cy="75" fill="#22c55e" r="4" className="animate-ping" />
                <circle cx="680" cy="75" fill="#22c55e" r="4" />
              </svg>
            </div>
          )}
        </div>

        {/* Forex Technical & Volatility Analytics (4 COLS) */}
        <div className="lg:col-span-4 flex flex-col bg-surface-container rounded-xl shadow-md border border-outline-variant/30 p-space-md gap-space-md">
          <div className="pb-2 border-b border-outline-variant/30">
            <h3 className="font-headline-md font-bold text-on-surface">
              Technical Indicators
            </h3>
            <span className="font-mono-xs text-primary font-bold">
              {selectedPair.pair} Spot
            </span>
          </div>

          {/* Key Moving Average Signals */}
          <div className="space-y-2 font-mono-xs text-mono-xs">
            <div className="flex items-center justify-between p-2 rounded bg-surface-container-low border border-outline-variant/20">
              <span className="text-outline">EMA (20) Trend</span>
              <span className="text-secondary font-bold">Bullish (Above Line)</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-surface-container-low border border-outline-variant/20">
              <span className="text-outline">EMA (50) Trend</span>
              <span className="text-secondary font-bold">Bullish Momentum</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-surface-container-low border border-outline-variant/20">
              <span className="text-outline">RSI (14) Status</span>
              <span className="text-primary font-bold">58.4 (Neutral-Bullish)</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-surface-container-low border border-outline-variant/20">
              <span className="text-outline">Average True Range (ATR)</span>
              <span className="text-on-surface font-bold">64 pips / day</span>
            </div>
          </div>

          {/* Session Timing & Overlap */}
          <div className="p-3 bg-surface-container-lowest rounded-lg border border-outline-variant/30 font-mono-xs text-mono-xs space-y-2">
            <span className="font-label-sm uppercase text-outline block">Active Market Sessions</span>
            <div className="flex items-center justify-between">
              <span className="text-outline">London Session:</span>
              <span className="text-secondary font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                Active
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-outline">New York Session:</span>
              <span className="text-secondary font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                Active (Peak Liquidity)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-outline">Tokyo / Asian Session:</span>
              <span className="text-outline">Closed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
