import React, { useEffect, useState } from 'react';
import { ScreenId, UserProfile } from '../../types/market';

interface HeaderProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
  unreadCount: number;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  user: UserProfile | null;
  onOpenAuth: () => void;
  onOpenUserProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onNavigate,
  onOpenSearch,
  onOpenNotifications,
  unreadCount,
  sidebarOpen,
  onToggleSidebar,
  user,
  onOpenAuth,
  onOpenUserProfile,
}) => {
  // Live market ticker tick simulation
  const [nifty, setNifty] = useState({ val: 24852.15, chg: 142.30, pct: 0.58 });
  const [sensex, setSensex] = useState({ val: 81720.40, chg: 410.25, pct: 0.51 });
  const [bankNifty, setBankNifty] = useState({ val: 51340.80, chg: -85.40, pct: -0.17 });
  const [eurUsd, setEurUsd] = useState({ val: 1.0842, chg: 0.0018, pct: 0.17 });
  const [gbpUsd, setGbpUsd] = useState({ val: 1.2985, chg: -0.0032, pct: -0.25 });
  const [usdInr, setUsdInr] = useState({ val: 83.92, chg: 0.08, pct: 0.10 });
  const [currentTime, setCurrentTime] = useState('15:18 IST');

  // Time updater & micro-tick simulator
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const istHours = (now.getUTCHours() + 5 + Math.floor((now.getUTCMinutes() + 30) / 60)) % 24;
      const istMinutes = (now.getUTCMinutes() + 30) % 60;
      const formatted = `${String(istHours).padStart(2, '0')}:${String(istMinutes).padStart(2, '0')} IST`;
      setCurrentTime(formatted);

      // Micro fluctuations
      const delta = (Math.random() - 0.48) * 0.8;
      setNifty(prev => ({ ...prev, val: +(prev.val + delta).toFixed(2) }));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className={`fixed top-0 right-0 z-40 bg-surface-container-low border-b border-outline-variant/30 transition-all duration-200 ${sidebarOpen ? 'left-[260px]' : 'left-0'}`}>
      {/* Top action row */}
      <div className="h-16 px-space-md flex items-center justify-between gap-space-md">
        {/* Left mobile menu toggle & search input */}
        <div className="flex items-center gap-space-sm flex-1 max-w-xl">
          {!sidebarOpen && (
            <button
              onClick={onToggleSidebar}
              className="p-1 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-lg transition-colors shrink-0 cursor-pointer"
              title="Open Sidebar"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">menu</span>
            </button>
          )}

          {/* Quick Return to Home Page button */}
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-outline-variant/40 bg-surface-container hover:border-primary text-on-surface-variant hover:text-primary transition-all text-xs font-medium shrink-0 cursor-pointer"
            title="Return to Landing Page"
          >
            <span className="material-symbols-outlined text-[16px]">home</span>
            <span>Home</span>
          </button>

          <div
            onClick={onOpenSearch}
            className="w-full relative flex items-center cursor-pointer group"
          >
            <span className="material-symbols-outlined absolute left-3 text-outline group-hover:text-primary text-[18px] transition-colors">
              search
            </span>
            <input
              readOnly
              className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-lg pl-9 pr-14 py-1.5 text-xs text-on-surface placeholder:text-outline focus:border-primary focus:outline-none cursor-pointer tracking-normal"
              placeholder="Search stocks (e.g. RELIANCE, TCS) or currency pairs (EUR/USD)..."
              type="text"
            />
            <span className="absolute right-2 px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant font-mono text-[10px] font-semibold border border-outline-variant/40 group-hover:border-primary/50 group-hover:text-primary transition-colors">
              Ctrl+K
            </span>
          </div>
        </div>

        {/* Right status & profile controls */}
        <div className="flex items-center gap-space-md shrink-0">
          {/* Market Status Indicators */}
          <div className="hidden xl:flex items-center gap-space-sm">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-container border border-secondary-container/40">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary shadow-[0_0_8px_rgba(68,224,146,0.6)] animate-pulse" />
              <span className="font-mono text-xs text-secondary font-medium whitespace-nowrap">
                NSE OPEN {currentTime}
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-container border border-secondary-container/40">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary shadow-[0_0_8px_rgba(68,224,146,0.6)] animate-pulse" />
              <span className="font-mono text-xs text-secondary font-medium whitespace-nowrap">
                FOREX 24/5 ACTIVE
              </span>
            </div>
          </div>

          {/* Notifications button */}
          <button
            onClick={onOpenNotifications}
            className="relative p-1.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-lg transition-colors cursor-pointer"
            title="Notifications"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-primary text-black font-mono text-[10px] flex items-center justify-center font-bold shadow-[0_0_6px_rgba(0,208,108,0.5)]">
                {unreadCount}
              </span>
            )}
          </button>

          {/* User profile / login controls */}
          {user ? (
            <div
              onClick={onOpenUserProfile}
              className="flex items-center gap-space-sm pl-space-xs border-l border-outline-variant/30 select-none cursor-pointer hover:opacity-90 transition-opacity"
              title="View Profile / Logout"
            >
              <img
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover ring-1 ring-primary"
                src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              />
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs text-on-surface font-semibold leading-tight">
                  {user.name}
                </span>
                <span className="text-[10px] text-primary font-bold leading-tight tracking-wider uppercase">
                  {user.role}
                </span>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onNavigate('login')}
              className="py-1.5 px-3 rounded-lg bg-primary text-white font-semibold text-xs flex items-center gap-1 shadow-[0_0_8px_rgba(255,121,0,0.3)] hover:bg-[#ff8c1a] cursor-pointer transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">login</span>
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>

      {/* Ticker tape row */}
      <div className="h-9 px-space-md bg-surface-container-lowest border-t border-outline-variant/20 flex items-center gap-space-lg overflow-x-auto whitespace-nowrap scrollbar-none">
        <div className="flex items-center gap-1.5 font-mono-xs text-mono-xs">
          <span className="text-outline font-medium">NIFTY 50</span>
          <span className="text-on-surface font-semibold">{nifty.val.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          <span className="text-secondary font-medium">(+{nifty.chg.toFixed(2)} / +{nifty.pct.toFixed(2)}%)</span>
        </div>
        <span className="text-outline-variant/50">|</span>
        <div className="flex items-center gap-1.5 font-mono-xs text-mono-xs">
          <span className="text-outline font-medium">SENSEX</span>
          <span className="text-on-surface font-semibold">{sensex.val.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          <span className="text-secondary font-medium">(+{sensex.chg.toFixed(2)} / +{sensex.pct.toFixed(2)}%)</span>
        </div>
        <span className="text-outline-variant/50">|</span>
        <div className="flex items-center gap-1.5 font-mono-xs text-mono-xs">
          <span className="text-outline font-medium">BANK NIFTY</span>
          <span className="text-on-surface font-semibold">{bankNifty.val.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          <span className="text-tertiary font-medium">({bankNifty.chg.toFixed(2)} / {bankNifty.pct.toFixed(2)}%)</span>
        </div>
        <span className="text-outline-variant/50">|</span>
        <div className="flex items-center gap-1.5 font-mono-xs text-mono-xs">
          <span className="text-outline font-medium">EUR/USD</span>
          <span className="text-on-surface font-semibold">{eurUsd.val.toFixed(4)}</span>
          <span className="text-secondary font-medium">(+{eurUsd.chg.toFixed(4)} / +{eurUsd.pct.toFixed(2)}%)</span>
        </div>
        <span className="text-outline-variant/50">|</span>
        <div className="flex items-center gap-1.5 font-mono-xs text-mono-xs">
          <span className="text-outline font-medium">GBP/USD</span>
          <span className="text-on-surface font-semibold">{gbpUsd.val.toFixed(4)}</span>
          <span className="text-tertiary font-medium">({gbpUsd.chg.toFixed(4)} / {gbpUsd.pct.toFixed(2)}%)</span>
        </div>
        <span className="text-outline-variant/50">|</span>
        <div className="flex items-center gap-1.5 font-mono-xs text-mono-xs">
          <span className="text-outline font-medium">USD/INR</span>
          <span className="text-on-surface font-semibold">{usdInr.val.toFixed(2)}</span>
          <span className="text-secondary font-medium">(+{usdInr.chg.toFixed(2)} / +{usdInr.pct.toFixed(2)}%)</span>
        </div>
      </div>
    </header>
  );
};
