import React, { useState } from 'react';
import { STOCKS_DATA } from '../../data/mockData';
import { StockData } from '../../types/market';
import { StockLiveDetailsModal } from './StockLiveDetailsModal';

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

  // Live Stock Details Modal State (opens right on screener without navigating away)
  const [activeStock, setActiveStock] = useState<StockData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const stocks = Object.values(STOCKS_DATA);

  const handleOpenStockDetails = (stock: StockData) => {
    setActiveStock(stock);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const filteredStocks = stocks.filter(s => {
    const matchesSearch =
      s.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector =
      selectedSector === 'All' ||
      s.sector.toLowerCase().includes(selectedSector.toLowerCase()) ||
      (selectedSector === 'Telecom' && s.sector.toLowerCase().includes('telecom')) ||
      (selectedSector === 'Infra' && s.sector.toLowerCase().includes('infra'));
    return matchesSearch && matchesSector;
  });

  filteredStocks.sort((a, b) => {
    let valA = 0;
    let valB = 0;
    if (sortBy === 'marketCap') {
      const getCapVal = (sym: string) => {
        if (sym === 'RELIANCE') return 2018400;
        if (sym === 'TCS') return 1492300;
        if (sym === 'HDFCBANK') return 1329800;
        if (sym === 'BHARTIARTL') return 982400;
        if (sym === 'ICICIBANK') return 878200;
        if (sym === 'INFY') return 786500;
        if (sym === 'SBIN') return 730400;
        if (sym === 'ITC') return 615400;
        if (sym === 'LT') return 506200;
        return 346200;
      };
      valA = getCapVal(a.symbol);
      valB = getCapVal(b.symbol);
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
    <div className="flex flex-col w-full gap-5">
      {/* Header & Filter Controls */}
      <section className="w-full bg-[#131b2e] rounded-2xl shadow-xl p-5 sm:p-6 flex flex-col gap-4 border border-white/15">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[#FF7900] text-[26px]">manage_search</span>
              <h2 className="text-xl font-black text-white tracking-tight">
                NSE Technical Screener &amp; Asset Details
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-[#FF7900]/20 text-[#FF9B42] border border-[#FF7900]/40 font-mono text-[10px] font-bold uppercase tracking-wider">
                TradingView Data
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Screen across Indian equities. Click any asset row or the <strong>View Details</strong> button to open full in-depth company information without leaving the screener.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs px-3 py-1.5 rounded-xl bg-[#0b1020] text-[#FF7900] font-black border border-white/10 shadow-inner">
              {filteredStocks.length} Assets Found
            </span>
          </div>
        </div>

        {/* Filter bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-2">
          {/* Search box */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3.5 top-2.5 text-slate-400 text-[20px]">
              search
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search ticker or company (e.g. Reliance, TCS)..."
              className="w-full bg-[#0b1020] border border-white/20 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-400 focus:border-[#FF7900] focus:outline-none transition-colors"
            />
          </div>

          {/* Sector filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
            {['All', 'Oil & Gas', 'Technology', 'Banking', 'Auto', 'Telecom', 'FMCG', 'Infra'].map(sec => (
              <button
                key={sec}
                onClick={() => setSelectedSector(sec)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedSector === sec
                    ? 'bg-[#FF7900] text-black font-black shadow-[0_0_12px_rgba(255,121,0,0.35)]'
                    : 'bg-[#0b1020] text-slate-300 hover:text-white hover:bg-white/10 border border-white/10'
                }`}
                type="button"
              >
                {sec}
              </button>
            ))}
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-2 justify-end">
            <span className="text-xs text-slate-300 font-semibold">Sort by:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as typeof sortBy)}
              className="bg-[#0b1020] border border-white/20 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF7900] cursor-pointer"
            >
              <option value="marketCap">Market Cap</option>
              <option value="pe">P/E Ratio</option>
              <option value="change">Day Change %</option>
              <option value="price">Share Price</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-2 rounded-xl bg-[#0b1020] border border-white/20 text-white hover:text-[#FF7900] transition-colors cursor-pointer"
              title="Toggle sort direction"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">
                {sortOrder === 'desc' ? 'arrow_downward' : 'arrow_upward'}
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Screener Data Table */}
      <div className="w-full bg-[#131b2e] rounded-2xl shadow-xl border border-white/15 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs sm:text-sm">
            <thead>
              <tr className="bg-[#1e293b] text-white font-bold border-b border-white/20 uppercase tracking-wider text-[11px] font-sans">
                <th className="py-3.5 px-4">Company / Asset</th>
                <th className="py-3.5 px-4 text-right">LTP (₹)</th>
                <th className="py-3.5 px-4 text-right">Day %</th>
                <th className="py-3.5 px-4 text-right">Market Cap</th>
                <th className="py-3.5 px-4 text-right">P/E Ratio</th>
                <th className="py-3.5 px-4 text-right">P/B Ratio</th>
                <th className="py-3.5 px-4 text-right">52W Position</th>
                <th className="py-3.5 px-4 text-right">Div Yield</th>
                <th className="py-3.5 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 text-slate-200">
              {filteredStocks.map(stock => (
                <tr
                  key={stock.symbol}
                  onClick={() => handleOpenStockDetails(stock)}
                  className="hover:bg-[#1e293b]/70 transition-colors group cursor-pointer"
                >
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#0b1020] border border-white/15 flex items-center justify-center font-bold text-[#FF7900] shrink-0 group-hover:scale-105 transition-transform shadow-sm">
                        {stock.symbol.slice(0, 3)}
                      </div>
                      <div>
                        <div className="font-bold text-white group-hover:text-[#FF7900] transition-colors flex items-center gap-2 font-sans text-sm">
                          <span>{stock.name}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/10 font-mono text-slate-300">
                            {stock.tradingViewSymbol || `BSE:${stock.symbol}`}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 font-sans mt-0.5">
                          {stock.symbol} • {stock.sector}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right font-black text-white text-sm">
                    ₹{stock.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span
                      className={`font-bold px-2 py-0.5 rounded-md text-xs inline-block ${
                        stock.change >= 0
                          ? 'bg-[#24c78b]/20 text-[#24c78b] border border-[#24c78b]/30'
                          : 'bg-[#ff4d5a]/20 text-[#ff4d5a] border border-[#ff4d5a]/30'
                      }`}
                    >
                      {stock.change >= 0 ? '+' : ''}
                      {stock.changePercent.toFixed(2)}%
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right text-white font-medium">
                    {stock.marketCapCr}
                  </td>
                  <td className="py-3.5 px-4 text-right text-slate-100 font-semibold">{stock.peRatio.toFixed(2)}</td>
                  <td className="py-3.5 px-4 text-right text-slate-100 font-semibold">{stock.pbRatio.toFixed(2)}</td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center gap-2">
                      <div className="w-16 h-2 bg-black/40 rounded-full overflow-hidden border border-white/10">
                        <div
                          className="h-full bg-gradient-to-r from-[#FF7900] to-[#24c78b] rounded-full"
                          style={{ width: `${stock.rangePositionPercent}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-300 font-semibold">
                        {stock.rangePositionPercent}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right text-slate-100 font-semibold">
                    {stock.dividendYield.toFixed(2)}%
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenStockDetails(stock);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-[#FF7900] text-black font-sans text-xs font-black hover:bg-[#ff9b42] shadow-[0_0_10px_rgba(255,121,0,0.35)] transition-all cursor-pointer inline-flex items-center gap-1.5"
                      type="button"
                      title="Open full company details"
                    >
                      <span className="material-symbols-outlined text-[16px]">visibility</span>
                      <span>View Details</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Stock Live Details Modal with Clear Company Information */}
      {activeStock && (
        <StockLiveDetailsModal
          stock={activeStock}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          allStocks={filteredStocks}
          onSelectStock={(nextStock) => setActiveStock(nextStock)}
          onOpenFullDeepDive={onSelectStock}
        />
      )}
    </div>
  );
};
