import React, { useState } from 'react';
import { STOCKS_DATA } from '../../data/mockData';
import { TradingViewChart } from '../tradingview/TradingViewChart';

interface TradingTerminalViewProps {
  onSelectStock?: (symbol: string) => void;
}

export const TradingTerminalView: React.FC<TradingTerminalViewProps> = ({
  onSelectStock,
}) => {
  const [selectedSymbol, setSelectedSymbol] = useState('RELIANCE');
  const [activeTab, setActiveTab] = useState<'depth' | 'chart'>('depth');

  const stock = STOCKS_DATA[selectedSymbol] || STOCKS_DATA.RELIANCE;

  // Level 2 Depth ladder calculation
  const depthData = {
    bids: [
      { price: stock.price - 0.20, orders: 48, qty: 12450 },
      { price: stock.price - 0.50, orders: 62, qty: 28900 },
      { price: stock.price - 1.00, orders: 112, qty: 54200 },
      { price: stock.price - 1.50, orders: 84, qty: 32100 },
      { price: stock.price - 2.00, orders: 140, qty: 68900 },
    ],
    asks: [
      { price: stock.price + 0.30, orders: 36, qty: 9800 },
      { price: stock.price + 0.60, orders: 54, qty: 21400 },
      { price: stock.price + 1.10, orders: 98, qty: 47600 },
      { price: stock.price + 1.60, orders: 76, qty: 38200 },
      { price: stock.price + 2.10, orders: 130, qty: 61500 },
    ],
  };

  const totalBidQty = depthData.bids.reduce((acc, b) => acc + b.qty, 0);
  const totalAskQty = depthData.asks.reduce((acc, a) => acc + a.qty, 0);
  const bidRatio = ((totalBidQty / (totalBidQty + totalAskQty)) * 100).toFixed(1);

  // Technical Pivots
  const pivotPoint = +(stock.price).toFixed(2);
  const r1 = +(stock.price * 1.012).toFixed(2);
  const r2 = +(stock.price * 1.025).toFixed(2);
  const s1 = +(stock.price * 0.988).toFixed(2);
  const s2 = +(stock.price * 0.975).toFixed(2);

  return (
    <div className="flex flex-col w-full gap-space-md">
      {/* Header and Ticker Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm bg-surface-container rounded-xl p-space-sm border border-outline-variant/30">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
          {Object.keys(STOCKS_DATA).map(sym => (
            <button
              key={sym}
              onClick={() => setSelectedSymbol(sym)}
              className={`px-3 py-1.5 rounded font-mono-xs text-mono-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                selectedSymbol === sym
                  ? 'bg-primary text-black font-bold shadow-[0_0_8px_rgba(0,208,108,0.3)]'
                  : 'bg-surface-container-lowest text-outline hover:text-on-surface'
              }`}
              type="button"
            >
              {sym} ₹{STOCKS_DATA[sym].price.toFixed(1)}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 font-mono-xs text-mono-xs text-outline pr-2 shrink-0">
          <div className="flex items-center gap-1 bg-surface-container-lowest p-1 rounded border border-outline-variant/30">
            <button
              onClick={() => setActiveTab('depth')}
              className={`px-2 py-0.5 rounded cursor-pointer ${
                activeTab === 'depth' ? 'bg-primary text-black font-bold' : 'text-outline hover:text-on-surface'
              }`}
            >
              Depth &amp; Flow
            </button>
            <button
              onClick={() => setActiveTab('chart')}
              className={`px-2 py-0.5 rounded cursor-pointer ${
                activeTab === 'chart' ? 'bg-primary text-black font-bold' : 'text-outline hover:text-on-surface'
              }`}
            >
              TradingView
            </button>
          </div>

          {onSelectStock && (
            <button
              onClick={() => onSelectStock(stock.symbol)}
              className="px-2.5 py-1 rounded bg-primary text-black font-mono-xs font-bold hover:bg-primary-fixed transition-colors flex items-center gap-1 cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[14px]">monitoring</span>
              <span>Deep Dive</span>
            </button>
          )}
        </div>
      </div>

      {activeTab === 'chart' ? (
        <div className="bg-surface-container rounded-xl p-space-sm border border-outline-variant/30 h-[620px] w-full">
          <TradingViewChart symbol={`BSE:${stock.symbol}`} height="100%" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md items-start">
          {/* Left: Level 2 Market Depth (7 COLS) */}
          <div className="lg:col-span-7 flex flex-col bg-surface-container rounded-xl shadow-md border border-outline-variant/30 overflow-hidden">
            <div className="p-space-sm bg-surface-container-low border-b border-outline-variant/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[18px]">format_align_justify</span>
                <h3 className="font-headline-md font-bold text-on-surface">
                  Level-2 Liquidity &amp; Order Flow ({stock.symbol})
                </h3>
              </div>
              <span className="font-mono-xs text-outline">5-Depth Ladder</span>
            </div>

            <div className="p-space-md flex flex-col gap-space-md">
              {/* Bid vs Ask Volume Imbalance Bar */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between font-mono-xs text-mono-xs">
                  <span className="text-secondary font-bold">
                    Bid Volume: {totalBidQty.toLocaleString()} ({bidRatio}%)
                  </span>
                  <span className="text-tertiary font-bold">
                    Ask Volume: {totalAskQty.toLocaleString()} ({(100 - Number(bidRatio)).toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-surface-container-lowest flex overflow-hidden">
                  <div
                    className="bg-secondary h-full"
                    style={{ width: `${bidRatio}%` }}
                  />
                  <div
                    className="bg-tertiary-container h-full"
                    style={{ width: `${100 - Number(bidRatio)}%` }}
                  />
                </div>
              </div>

              {/* Depth Ladder */}
              <div className="grid grid-cols-2 gap-space-sm">
                {/* Bids Column */}
                <div className="bg-surface-container-low rounded-lg p-2.5 border border-outline-variant/30">
                  <div className="grid grid-cols-3 font-label-sm text-outline uppercase pb-1 border-b border-outline-variant/20">
                    <span>Orders</span>
                    <span className="text-right">Qty</span>
                    <span className="text-right text-secondary">Bid (₹)</span>
                  </div>
                  <div className="space-y-1 mt-1 font-mono-xs text-mono-xs">
                    {depthData.bids.map((b, i) => (
                      <div key={i} className="grid grid-cols-3 relative py-0.5">
                        <div
                          className="absolute inset-0 bg-secondary/10 rounded pointer-events-none"
                          style={{ width: `${(b.qty / 70000) * 100}%` }}
                        />
                        <span className="text-outline relative z-10">{b.orders}</span>
                        <span className="text-right text-on-surface font-medium relative z-10">
                          {b.qty.toLocaleString()}
                        </span>
                        <span className="text-right text-secondary font-bold relative z-10">
                          ₹{b.price.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Asks Column */}
                <div className="bg-surface-container-low rounded-lg p-2.5 border border-outline-variant/30">
                  <div className="grid grid-cols-3 font-label-sm text-outline uppercase pb-1 border-b border-outline-variant/20">
                    <span className="text-tertiary">Ask (₹)</span>
                    <span className="text-right">Qty</span>
                    <span className="text-right">Orders</span>
                  </div>
                  <div className="space-y-1 mt-1 font-mono-xs text-mono-xs">
                    {depthData.asks.map((a, i) => (
                      <div key={i} className="grid grid-cols-3 relative py-0.5">
                        <div
                          className="absolute inset-0 right-0 bg-tertiary-container/10 rounded pointer-events-none"
                          style={{ width: `${(a.qty / 70000) * 100}%` }}
                        />
                        <span className="text-tertiary font-bold relative z-10">
                          ₹{a.price.toFixed(2)}
                        </span>
                        <span className="text-right text-on-surface font-medium relative z-10">
                          {a.qty.toLocaleString()}
                        </span>
                        <span className="text-right text-outline relative z-10">{a.orders}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Technical Pivots & Key Price Thresholds (5 COLS) */}
          <div className="lg:col-span-5 flex flex-col bg-surface-container rounded-xl shadow-md border border-outline-variant/30 p-space-md gap-space-md">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/30">
              <h3 className="font-headline-md font-bold text-on-surface">
                Key Technical Levels
              </h3>
              <span className="font-mono-xs text-primary font-bold">
                {stock.symbol}
              </span>
            </div>

            <div className="space-y-2 font-mono-xs text-mono-xs">
              <div className="flex items-center justify-between p-2 rounded bg-surface-container-low border border-outline-variant/20">
                <span className="text-tertiary font-bold">R2 (Major Resistance)</span>
                <span className="font-bold text-on-surface">₹{r2}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-surface-container-low border border-outline-variant/20">
                <span className="text-tertiary font-medium">R1 (Minor Resistance)</span>
                <span className="font-bold text-on-surface">₹{r1}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-primary/10 border border-primary/30">
                <span className="text-primary font-bold">Central Pivot Point (PP)</span>
                <span className="font-bold text-primary">₹{pivotPoint}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-surface-container-low border border-outline-variant/20">
                <span className="text-secondary font-medium">S1 (Immediate Support)</span>
                <span className="font-bold text-on-surface">₹{s1}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-surface-container-low border border-outline-variant/20">
                <span className="text-secondary font-bold">S2 (Key Institutional Demand)</span>
                <span className="font-bold text-on-surface">₹{s2}</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-surface-container-lowest border border-outline-variant/30 text-outline font-mono-xs space-y-1">
              <div className="flex justify-between">
                <span>Spread:</span>
                <span className="text-on-surface font-bold">₹0.50 (0.017%)</span>
              </div>
              <div className="flex justify-between">
                <span>Implied Volatility (IV):</span>
                <span className="text-primary font-bold">14.2% (Moderate)</span>
              </div>
              <div className="flex justify-between">
                <span>Volume Weight (VWAP):</span>
                <span className="text-secondary font-bold">₹{(stock.price - 4.5).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
