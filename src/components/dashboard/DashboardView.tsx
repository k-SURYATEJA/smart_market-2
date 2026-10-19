import React from 'react';
import { STOCKS_DATA } from '../../data/mockData';

interface DashboardViewProps {
  onSelectStock: (symbol: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onSelectStock,
}) => {
  const stocks = Object.values(STOCKS_DATA);

  return (
    <div className="flex flex-col w-full gap-space-md">
      {/* Market Breadth & Technical Momentum Ribbon */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-space-md">
        <div className="bg-surface-container rounded-xl p-space-md border border-outline-variant/20 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-outline uppercase">Market Breadth (NSE)</span>
            <span className="material-symbols-outlined text-primary text-[20px]">equalizer</span>
          </div>
          <div className="mt-2">
            <span className="font-mono-xl text-mono-xl font-bold text-secondary">2.82 A/D Ratio</span>
            <div className="flex items-center gap-1.5 mt-1 font-mono-xs text-mono-xs text-on-surface font-semibold">
              <span className="text-secondary font-bold">1,640 Advancing</span>
              <span className="text-outline">/</span>
              <span className="text-tertiary">580 Declining</span>
            </div>
          </div>
        </div>

        <div className="bg-surface-container rounded-xl p-space-md border border-outline-variant/20 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-outline uppercase">India VIX Volatility</span>
            <span className="material-symbols-outlined text-secondary text-[20px]">ssid_chart</span>
          </div>
          <div className="mt-2">
            <span className="font-mono-xl text-mono-xl font-bold text-on-surface">12.84</span>
            <span className="font-mono-xs text-mono-xs text-secondary mt-1 block font-semibold">
              -0.38 (-2.87%) · Low Volatility Trend
            </span>
          </div>
        </div>

        <div className="bg-surface-container rounded-xl p-space-md border border-outline-variant/20 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-outline uppercase">Market Sentiment Index</span>
            <span className="material-symbols-outlined text-primary text-[20px]">speed</span>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-2">
              <span className="font-mono-xl text-mono-xl font-bold text-primary">68.4</span>
              <span className="font-label-sm text-label-sm text-primary font-bold uppercase">Greed</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-surface-container-highest mt-2 overflow-hidden">
              <div className="h-full bg-primary rounded-full shadow-[0_0_8px_rgba(0,208,108,0.5)]" style={{ width: '68.4%' }} />
            </div>
          </div>
        </div>

        <div className="bg-surface-container rounded-xl p-space-md border border-outline-variant/20 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-outline uppercase">Trend Status</span>
            <span className="material-symbols-outlined text-primary text-[20px]">trending_up</span>
          </div>
          <div className="mt-2">
            <span className="font-mono-xl text-mono-xl font-bold text-secondary">Bullish Expansion</span>
            <span className="font-mono-xs text-mono-xs text-outline mt-1 block">
              Trading 4.2% Above 200 EMA
            </span>
          </div>
        </div>
      </section>

      {/* Main Grid: Watchlist & Top Movers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md items-start">
        {/* Market Movers & Watchlist Table (8 COLS) */}
        <div className="lg:col-span-8 flex flex-col bg-surface-container rounded-xl shadow-md border border-outline-variant/20 overflow-hidden">
          <div className="p-space-md bg-surface-container-low border-b border-outline-variant/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">view_list</span>
              <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
                Equities Technical Watchlist
              </h2>
            </div>
            <span className="font-mono-xs text-mono-xs text-outline">Real-time Technical Stream</span>
          </div>

          <div className="overflow-x-auto w-full">
            <table className="w-full text-left font-mono-xs text-mono-xs">
              <thead>
                <tr className="bg-surface-container-lowest text-outline font-label-sm uppercase">
                  <th className="py-2.5 px-3">Symbol</th>
                  <th className="py-2.5 px-3 text-right">LTP (₹)</th>
                  <th className="py-2.5 px-3 text-right">Change</th>
                  <th className="py-2.5 px-3 text-right">Day Range</th>
                  <th className="py-2.5 px-3 text-right">Volume</th>
                  <th className="py-2.5 px-3 text-center">Technical Analysis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {stocks.map(s => (
                  <tr
                    key={s.symbol}
                    className="hover:bg-surface-container-high transition-colors group"
                  >
                    <td
                      onClick={() => onSelectStock(s.symbol)}
                      className="py-3 px-3 cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded bg-surface-container-highest flex items-center justify-center font-bold text-primary">
                          {s.symbol.slice(0, 2)}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-on-surface group-hover:text-primary transition-colors">
                            {s.symbol}
                          </span>
                          <span className="text-[10px] text-outline truncate max-w-[140px]">
                            {s.sector}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-on-surface">
                      ₹{s.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span
                        className={`font-semibold ${
                          s.change >= 0 ? 'text-secondary' : 'text-tertiary'
                        }`}
                      >
                        {s.change >= 0 ? '+' : ''}₹{s.change.toFixed(2)} ({s.change >= 0 ? '+' : ''}
                        {s.changePercent.toFixed(2)}%)
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right text-outline">
                      ₹{s.dayHigh.toFixed(1)} / ₹{s.dayLow.toFixed(1)}
                    </td>
                    <td className="py-3 px-3 text-right text-on-surface-variant font-medium">
                      {s.volume}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => onSelectStock(s.symbol)}
                        className="px-3 py-1 rounded bg-primary text-black font-label-sm font-bold hover:bg-primary-fixed shadow-[0_0_8px_rgba(0,208,108,0.25)] transition-colors cursor-pointer inline-flex items-center gap-1"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[14px]">show_chart</span>
                        <span>Analyze</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Bento: Heatmap & Major Indices (4 COLS) */}
        <div className="lg:col-span-4 flex flex-col gap-space-md">
          {/* Major Indices */}
          <div className="bg-surface-container rounded-xl p-space-md border border-outline-variant/20 flex flex-col gap-space-sm">
            <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
              Market Indices
            </h3>
            <div className="space-y-2 font-mono-xs text-mono-xs">
              {[
                { name: 'NIFTY 50', val: '24,852.15', chg: '+142.30 (+0.58%)', up: true },
                { name: 'SENSEX', val: '81,720.40', chg: '+410.25 (+0.51%)', up: true },
                { name: 'BANK NIFTY', val: '51,340.80', chg: '-85.40 (-0.17%)', up: false },
                { name: 'NIFTY IT', val: '42,110.20', chg: '+310.80 (+0.74%)', up: true },
                { name: 'INDIA VIX', val: '12.84', chg: '-0.38 (-2.87%)', up: false, vix: true },
              ].map(idx => (
                <div
                  key={idx.name}
                  className="flex items-center justify-between p-2 rounded bg-surface-container-low border border-outline-variant/20"
                >
                  <span className="font-semibold text-on-surface">{idx.name}</span>
                  <div className="text-right">
                    <div className="text-on-surface font-bold">{idx.val}</div>
                    <div className={`text-[10px] ${idx.up ? 'text-secondary' : 'text-tertiary'}`}>
                      {idx.chg}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Heatmap View */}
          <div className="bg-surface-container rounded-xl p-space-md border border-outline-variant/20 flex flex-col gap-space-sm">
            <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
              Market Sector Breadth
            </h3>
            <div className="grid grid-cols-2 gap-2 font-mono-xs text-mono-xs">
              <div className="p-2.5 rounded bg-secondary-container/20 border border-secondary/30 flex flex-col justify-between">
                <span className="font-semibold text-on-surface">Auto &amp; EV</span>
                <span className="text-secondary font-bold text-sm mt-1">+2.48%</span>
              </div>
              <div className="p-2.5 rounded bg-secondary-container/20 border border-secondary/30 flex flex-col justify-between">
                <span className="font-semibold text-on-surface">Energy &amp; O2C</span>
                <span className="text-secondary font-bold text-sm mt-1">+1.44%</span>
              </div>
              <div className="p-2.5 rounded bg-secondary-container/10 border border-secondary/20 flex flex-col justify-between">
                <span className="font-semibold text-on-surface">Banking</span>
                <span className="text-secondary font-bold text-sm mt-1">+1.06%</span>
              </div>
              <div className="p-2.5 rounded bg-tertiary-container/20 border border-tertiary-container/30 flex flex-col justify-between">
                <span className="font-semibold text-on-surface">IT &amp; Cloud</span>
                <span className="text-tertiary font-bold text-sm mt-1">-0.77%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
