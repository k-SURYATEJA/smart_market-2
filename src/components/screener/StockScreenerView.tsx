import React, { useState } from 'react';
import { STOCKS_DATA } from '../../data/mockData';

interface StockScreenerViewProps {
  onSelectStock: (symbol: string) => void;
}

export const StockScreenerView: React.FC<StockScreenerViewProps> = ({
  onSelectStock,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'marketCap' | 'pe' | 'change' | 'price'>('marketCap');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const stocks = Object.values(STOCKS_DATA);

  const filteredStocks = stocks.filter(s => {
    const matchesSearch =
      s.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector =
      selectedSector === 'All' || s.sector.toLowerCase().includes(selectedSector.toLowerCase());
    return matchesSearch && matchesSector;
  });

  filteredStocks.sort((a, b) => {
    let valA = 0;
    let valB = 0;
    if (sortBy === 'marketCap') {
      valA = a.symbol === 'RELIANCE' ? 2018400 : a.symbol === 'TCS' ? 1492300 : a.symbol === 'HDFCBANK' ? 1329800 : a.symbol === 'INFY' ? 786500 : 346200;
      valB = b.symbol === 'RELIANCE' ? 2018400 : b.symbol === 'TCS' ? 1492300 : b.symbol === 'HDFCBANK' ? 1329800 : b.symbol === 'INFY' ? 786500 : 346200;
    } else if (sortBy === 'pe') {
      valA = a.peRatio;
      valB = b.peRatio;
    } else if (sortBy === 'change') {
      valA = a.changePercent;
      valB = b.changePercent;
    } else if (sortBy === 'price') {
      valA = a.price;
      valB = b.price;
    }
    return sortOrder === 'desc' ? valB - valA : valA - valB;
  });

  return (
    <div className="flex flex-col w-full gap-space-md">
      {/* Header & Filter Controls */}
      <section className="w-full bg-surface-container rounded-xl shadow-md p-space-md flex flex-col gap-space-md border border-outline-variant/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
          <div>
            <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">
              NSE Stock Screener &amp; Filters
            </h2>
            <p className="font-body-sm text-body-sm text-outline mt-0.5">
              Screen across fundamental ratios, valuation multiples, and technical momentum.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono-xs text-mono-xs px-2.5 py-1 rounded bg-surface-container-highest text-primary font-bold">
              {filteredStocks.length} Results
            </span>
          </div>
        </div>

        {/* Filter bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-sm">
          {/* Search box */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-outline text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by company or ticker..."
              className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-lg pl-9 pr-3 py-2 font-mono-xs text-mono-xs text-on-surface placeholder:text-outline focus:border-primary focus:outline-none"
            />
          </div>

          {/* Sector filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
            {['All', 'Oil & Gas', 'Technology', 'Banking', 'Auto'].map(sec => (
              <button
                key={sec}
                onClick={() => setSelectedSector(sec)}
                className={`px-3 py-1.5 rounded font-mono-xs text-mono-xs whitespace-nowrap transition-colors cursor-pointer ${
                  selectedSector === sec
                    ? 'bg-primary text-on-primary-fixed font-bold'
                    : 'bg-surface-container-lowest text-outline hover:text-on-surface border border-outline-variant/30'
                }`}
                type="button"
              >
                {sec}
              </button>
            ))}
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-2 justify-end">
            <span className="font-mono-xs text-mono-xs text-outline">Sort:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as typeof sortBy)}
              className="bg-surface-container-lowest border border-outline-variant/40 rounded px-2.5 py-1.5 font-mono-xs text-mono-xs text-on-surface focus:outline-none"
            >
              <option value="marketCap">Market Cap</option>
              <option value="pe">P/E Ratio</option>
              <option value="change">Day Change %</option>
              <option value="price">Share Price</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-1.5 rounded bg-surface-container-lowest border border-outline-variant/40 text-on-surface hover:text-primary transition-colors cursor-pointer"
              title="Toggle sort direction"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">
                {sortOrder === 'desc' ? 'arrow_downward' : 'arrow_upward'}
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Screener Data Table */}
      <div className="w-full bg-surface-container rounded-xl shadow-md border border-outline-variant/20 overflow-x-auto">
        <table className="w-full text-left font-mono-xs text-mono-xs">
          <thead>
            <tr className="bg-surface-container-lowest text-outline font-label-sm uppercase">
              <th className="py-3 px-3">Company / Ticker</th>
              <th className="py-3 px-3 text-right">LTP (₹)</th>
              <th className="py-3 px-3 text-right">Day %</th>
              <th className="py-3 px-3 text-right">Market Cap</th>
              <th className="py-3 px-3 text-right">P/E</th>
              <th className="py-3 px-3 text-right">P/B</th>
              <th className="py-3 px-3 text-right">52W Position</th>
              <th className="py-3 px-3 text-right">Div Yield</th>
              <th className="py-3 px-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/20">
            {filteredStocks.map(stock => (
              <tr
                key={stock.symbol}
                className="hover:bg-surface-container-high transition-colors group"
              >
                <td
                  onClick={() => onSelectStock(stock.symbol)}
                  className="py-3 px-3 cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded bg-surface-container-highest flex items-center justify-center font-bold text-primary shrink-0">
                      {stock.symbol.slice(0, 3)}
                    </div>
                    <div>
                      <div className="font-semibold text-on-surface group-hover:text-primary transition-colors">
                        {stock.name}
                      </div>
                      <div className="text-[10px] text-outline">
                        {stock.symbol} · {stock.sector}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-3 text-right font-bold text-on-surface">
                  ₹{stock.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </td>
                <td className="py-3 px-3 text-right">
                  <span
                    className={`font-semibold ${
                      stock.change >= 0 ? 'text-secondary' : 'text-tertiary'
                    }`}
                  >
                    {stock.change >= 0 ? '+' : ''}
                    {stock.changePercent.toFixed(2)}%
                  </span>
                </td>
                <td className="py-3 px-3 text-right text-on-surface font-medium">
                  {stock.marketCapCr}
                </td>
                <td className="py-3 px-3 text-right text-on-surface">{stock.peRatio.toFixed(2)}</td>
                <td className="py-3 px-3 text-right text-on-surface">{stock.pbRatio.toFixed(2)}</td>
                <td className="py-3 px-3 text-right">
                  <div className="inline-flex items-center gap-1.5">
                    <div className="w-16 h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                      <div
                        className="h-full bg-secondary rounded-full"
                        style={{ width: `${stock.rangePositionPercent}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-outline">
                      {stock.rangePositionPercent}%
                    </span>
                  </div>
                </td>
                <td className="py-3 px-3 text-right text-on-surface">
                  {stock.dividendYield.toFixed(2)}%
                </td>
                <td className="py-3 px-3 text-center">
                  <button
                    onClick={() => onSelectStock(stock.symbol)}
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
  );
};
