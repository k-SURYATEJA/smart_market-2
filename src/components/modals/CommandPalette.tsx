import React, { useState, useEffect, useRef } from 'react';
import { STOCKS_DATA, FOREX_PAIRS } from '../../data/mockData';
import { ScreenId } from '../../types/market';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStock: (symbol: string) => void;
  onNavigate: (screen: ScreenId) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectStock,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const screens: { id: ScreenId; title: string; category: string; icon: string }[] = [
    { id: 'home', title: 'Home Page (Landing Overview)', category: 'Navigation', icon: 'home' },
    { id: 'login', title: 'Analyst Login Webpage', category: 'Authentication', icon: 'login' },
    { id: 'register', title: 'Create Pro Analyst Account', category: 'Authentication', icon: 'person_add' },
    { id: 'market-charts', title: 'Market Charts (TradingView Integrated)', category: 'Technical Analysis', icon: 'candlestick_chart' },
    { id: 'stock-details', title: 'Stock Deep Dive (Technicals & Fundamentals)', category: 'Technical Analysis', icon: 'monitoring' },
    { id: 'stock-screener', title: 'Technical & Fundamental Screener', category: 'Technical Analysis', icon: 'filter_alt' },
    { id: 'indian-market-terminal', title: 'Order Flow & Level-2 Depth', category: 'Technical Analysis', icon: 'format_align_justify' },
    { id: 'forex', title: 'Forex Currency Technicals', category: 'Technical Analysis', icon: 'currency_exchange' },
    { id: 'risk-reward-calculator', title: 'Risk & Target Position Calculator', category: 'Technical Analysis', icon: 'calculate' },
    { id: 'dashboard', title: 'Market Overview & Sector Breadth', category: 'Markets', icon: 'dashboard' },
    { id: 'indices-and-sectors', title: 'Indices & Sector Performance', category: 'Markets', icon: 'pie_chart' },
    { id: 'impacted-news', title: 'Impacted News & Macro Catalysts', category: 'Fundamental Analysis', icon: 'feed' },
    { id: 'trading-journal', title: 'Research & Analysis Notes Journal', category: 'Fundamental Analysis', icon: 'menu_book' },
    { id: 'settings', title: 'Workstation & Chart Settings', category: 'System', icon: 'tune' },
  ];

  const stocks = Object.values(STOCKS_DATA);

  // Filter items
  const filteredStocks = stocks.filter(
    s =>
      s.symbol.toLowerCase().includes(query.toLowerCase()) ||
      s.name.toLowerCase().includes(query.toLowerCase())
  );

  const filteredForex = FOREX_PAIRS.filter(f =>
    f.pair.toLowerCase().includes(query.toLowerCase())
  );

  const filteredScreens = screens.filter(s =>
    s.title.toLowerCase().includes(query.toLowerCase())
  );

  const totalResults = [
    ...filteredStocks.map(s => ({ type: 'stock' as const, data: s })),
    ...filteredForex.map(f => ({ type: 'forex' as const, data: f })),
    ...filteredScreens.map(sc => ({ type: 'screen' as const, data: sc })),
  ];

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
          e.preventDefault();
          // open triggered from outside
        }
        return;
      }

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % Math.max(1, totalResults.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + totalResults.length) % Math.max(1, totalResults.length));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const selected = totalResults[selectedIndex];
        if (selected) {
          if (selected.type === 'stock') {
            onSelectStock(selected.data.symbol);
            onNavigate('stock-details');
          } else if (selected.type === 'forex') {
            onNavigate('forex-terminal');
          } else if (selected.type === 'screen') {
            onNavigate(selected.data.id);
          }
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, totalResults, onClose, onSelectStock, onNavigate]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/70 backdrop-blur-xs">
      <div className="w-full max-w-xl bg-surface-container rounded-xl border border-outline-variant/40 shadow-2xl overflow-hidden animate-in fade-in duration-150">
        {/* Search Input */}
        <div className="p-3 border-b border-outline-variant/30 flex items-center gap-2 bg-surface-container-low">
          <span className="material-symbols-outlined text-outline text-[20px]">search</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a stock (RELIANCE, TCS), currency (EUR/USD), or screen..."
            className="w-full bg-transparent font-mono-xs text-mono-xs text-on-surface placeholder:text-outline focus:outline-none"
          />
          <span className="px-1.5 py-0.5 rounded bg-surface-container text-outline font-mono-xs text-[10px] border border-outline-variant/30">
            ESC
          </span>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {totalResults.length === 0 ? (
            <div className="p-6 text-center text-outline font-mono-xs text-mono-xs">
              No matching assets or screens found for &quot;{query}&quot;.
            </div>
          ) : (
            totalResults.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              if (item.type === 'stock') {
                const s = item.data;
                return (
                  <div
                    key={`stock-${s.symbol}`}
                    onClick={() => {
                      onSelectStock(s.symbol);
                      onNavigate('stock-details');
                      onClose();
                    }}
                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-primary text-on-primary-fixed font-semibold'
                        : 'hover:bg-surface-container-high text-on-surface'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-mono-xs">
                      <span className="px-1.5 py-0.5 rounded bg-surface-container-highest text-primary font-bold text-[10px]">
                        EQ
                      </span>
                      <span>{s.symbol}</span>
                      <span className="text-outline text-[11px] truncate max-w-[200px]">
                        {s.name}
                      </span>
                    </div>
                    <div className="font-mono-xs font-bold">
                      ₹{s.price.toFixed(2)}
                    </div>
                  </div>
                );
              }

              if (item.type === 'forex') {
                const f = item.data;
                return (
                  <div
                    key={`forex-${f.pair}`}
                    onClick={() => {
                      onNavigate('forex-terminal');
                      onClose();
                    }}
                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-primary text-on-primary-fixed font-semibold'
                        : 'hover:bg-surface-container-high text-on-surface'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-mono-xs">
                      <span className="px-1.5 py-0.5 rounded bg-surface-container-highest text-secondary font-bold text-[10px]">
                        FX
                      </span>
                      <span>{f.pair}</span>
                      <span className="text-outline text-[11px]">Spot Currency</span>
                    </div>
                    <div className="font-mono-xs font-bold">{f.rate.toFixed(4)}</div>
                  </div>
                );
              }

              const sc = item.data;
              return (
                <div
                  key={`screen-${sc.id}`}
                  onClick={() => {
                    onNavigate(sc.id);
                    onClose();
                  }}
                  className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-primary text-on-primary-fixed font-semibold'
                      : 'hover:bg-surface-container-high text-on-surface'
                  }`}
                >
                  <div className="flex items-center gap-2 font-mono-xs">
                    <span className="material-symbols-outlined text-[16px] text-outline">
                      {sc.icon}
                    </span>
                    <span>{sc.title}</span>
                  </div>
                  <span className="text-[10px] text-outline uppercase">{sc.category}</span>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="p-2 border-t border-outline-variant/30 bg-surface-container-lowest flex items-center justify-between font-mono-xs text-[10px] text-outline">
          <span>Navigate with ↑ ↓</span>
          <span>Select with ↵</span>
          <span>Close with ESC</span>
        </div>
      </div>
    </div>
  );
};
