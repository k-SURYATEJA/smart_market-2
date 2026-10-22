import React, { useState } from 'react';
import { ScreenId } from '../../types/market';

interface SidebarProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  isOpen: boolean;
  onClose: () => void;
  user: { name: string } | null;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentScreen,
  onNavigate,
  isOpen,
  onClose,
  user,
}) => {
  const [technicalOpen, setTechnicalOpen] = useState<boolean>(true);
  const [fundamentalOpen, setFundamentalOpen] = useState<boolean>(true);

  const isScreenActive = (screen: ScreenId) => currentScreen === screen;

  const activeLinkClass =
    'bg-primary/15 text-primary font-bold border-l-2 border-primary shadow-[0_0_10px_rgba(0,208,108,0.25)]';
  const inactiveLinkClass =
    'text-on-surface-variant hover:bg-surface-container hover:text-primary';

  const handleLinkClick = (screen: ScreenId) => {
    onNavigate(screen);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40 lg:hidden backdrop-blur-xs"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-full w-[260px] bg-surface-container-lowest border-r border-outline-variant/30 z-50 flex flex-col justify-between overflow-y-auto transition-transform duration-200 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col">
          {/* Header brand lockup */}
          <div className="h-16 px-space-md flex items-center justify-between border-b border-outline-variant/30 bg-surface-container-low shrink-0">
            <div
              className="flex items-center gap-space-sm cursor-pointer select-none"
              onClick={() => handleLinkClick('home')}
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF9B42] via-[#FF7900] to-[#E06300] flex items-center justify-center p-1 shadow-[0_0_12px_rgba(255,121,0,0.35)] shrink-0">
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white stroke-current">
                  <path d="M4 17L12 5L20 17H14L12 13L10 17H4Z" fill="currentColor" fillOpacity="0.9" />
                  <path d="M12 13L15 18H9L12 13Z" fill="#141519" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-headline-md text-base font-black tracking-tight text-on-surface leading-none">
                  Pip<span className="text-[#FF7900]">Pulse</span>
                </span>
                <span className="font-mono-xs text-[9px] font-bold text-primary tracking-widest uppercase mt-0.5">
                  FOREX TRADING
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-lg transition-colors cursor-pointer"
              title="Close Menu"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">menu_open</span>
            </button>
          </div>

          {/* Main Navigation */}
          <nav className="flex flex-col py-space-sm px-space-xs gap-0.5">
            {/* OVERVIEW & CHARTS */}
            <div className="px-space-md pt-2 pb-1 text-[10px] font-mono-xs font-bold uppercase tracking-wider text-outline">
              Markets &amp; Workstation
            </div>

            {/* TradingView Market Charts (Flagship) */}
            <button
              type="button"
              onClick={() => handleLinkClick('market-charts')}
              className={`flex items-center gap-space-sm px-space-md py-2 rounded-lg text-left transition-all w-full cursor-pointer ${
                isScreenActive('market-charts') ? activeLinkClass : inactiveLinkClass
              }`}
            >
              <span className="material-symbols-outlined text-[18px] text-primary">candlestick_chart</span>
              <span className="font-label-md text-label-md flex-1">Market Charts</span>
              <span className="px-1.5 py-0.5 rounded bg-primary text-black font-mono-xs text-[9px] font-bold uppercase tracking-wider">
                TradingView
              </span>
            </button>

            {/* Dashboard */}
            <button
              type="button"
              onClick={() => handleLinkClick('dashboard')}
              className={`flex items-center gap-space-sm px-space-md py-2 rounded-lg text-left transition-all w-full cursor-pointer ${
                isScreenActive('dashboard') ? activeLinkClass : inactiveLinkClass
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">dashboard</span>
              <span className="font-label-md text-label-md flex-1">Market Dashboard</span>
            </button>

            {/* Indices & Sectors */}
            <button
              type="button"
              onClick={() => handleLinkClick('indices-and-sectors')}
              className={`flex items-center gap-space-sm px-space-md py-2 rounded-lg text-left transition-all w-full cursor-pointer ${
                isScreenActive('indices-and-sectors') ? activeLinkClass : inactiveLinkClass
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">pie_chart</span>
              <span className="font-label-md text-label-md flex-1">Indices &amp; Sectors</span>
            </button>

            {/* TECHNICAL ANALYSIS SECTION */}
            <div className="flex flex-col mt-2">
              <button
                type="button"
                onClick={() => setTechnicalOpen(!technicalOpen)}
                className="flex items-center justify-between px-space-md py-1.5 text-[10px] font-mono-xs font-bold uppercase tracking-wider text-primary cursor-pointer select-none hover:text-primary-fixed"
              >
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px]">show_chart</span>
                  <span>Technical Analysis</span>
                </div>
                <span
                  className={`material-symbols-outlined text-[14px] transition-transform ${
                    technicalOpen ? 'rotate-180' : ''
                  }`}
                >
                  expand_more
                </span>
              </button>

              {technicalOpen && (
                <div className="flex flex-col pl-3 pr-space-xs py-0.5 gap-0.5 border-l border-primary/20 ml-4">
                  {/* Stock Details & Charts */}
                  <button
                    type="button"
                    onClick={() => handleLinkClick('stock-details')}
                    className={`py-1.5 px-space-sm rounded-lg text-left font-label-md text-label-md transition-all flex items-center gap-2 ${
                      isScreenActive('stock-details') ? activeLinkClass : inactiveLinkClass
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">monitoring</span>
                    <span>Stock Deep Dive</span>
                  </button>

                  {/* Stock Screener */}
                  <button
                    type="button"
                    onClick={() => handleLinkClick('stock-screener')}
                    className={`py-1.5 px-space-sm rounded-lg text-left font-label-md text-label-md transition-all flex items-center gap-2 ${
                      isScreenActive('stock-screener') || isScreenActive('indian-stocks') ? activeLinkClass : inactiveLinkClass
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">filter_alt</span>
                    <span>Technical Screener</span>
                  </button>

                  {/* Level-2 Order Flow & Depth */}
                  <button
                    type="button"
                    onClick={() => handleLinkClick('indian-market-terminal')}
                    className={`py-1.5 px-space-sm rounded-lg text-left font-label-md text-label-md transition-all flex items-center gap-2 ${
                      isScreenActive('indian-market-terminal') ? activeLinkClass : inactiveLinkClass
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">format_align_justify</span>
                    <span>Order Flow &amp; Depth</span>
                  </button>

                  {/* Technical Indicators to Explore (TradingView Standards) */}
                  <button
                    type="button"
                    onClick={() => handleLinkClick('indicators')}
                    className={`py-1.5 px-space-sm rounded-lg text-left font-label-md text-label-md transition-all flex items-center gap-2 ${
                      isScreenActive('indicators') || isScreenActive('forex') || isScreenActive('forex-terminal') ? activeLinkClass : inactiveLinkClass
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">query_stats</span>
                    <span>Indicators to Explore</span>
                  </button>

                  {/* SIP & Investment Calculator */}
                  <button
                    type="button"
                    onClick={() => handleLinkClick('risk-reward-calculator')}
                    className={`py-1.5 px-space-sm rounded-lg text-left font-label-md text-label-md transition-all flex items-center gap-2 ${
                      isScreenActive('risk-reward-calculator') ? activeLinkClass : inactiveLinkClass
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">calculate</span>
                    <span>Calculator</span>
                  </button>
                </div>
              )}
            </div>

            {/* FUNDAMENTAL ANALYSIS SECTION */}
            <div className="flex flex-col mt-2">
              <button
                type="button"
                onClick={() => setFundamentalOpen(!fundamentalOpen)}
                className="flex items-center justify-between px-space-md py-1.5 text-[10px] font-mono-xs font-bold uppercase tracking-wider text-primary cursor-pointer select-none hover:text-primary-fixed"
              >
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px]">newspaper</span>
                  <span>Fundamental Analysis</span>
                </div>
                <span
                  className={`material-symbols-outlined text-[14px] transition-transform ${
                    fundamentalOpen ? 'rotate-180' : ''
                  }`}
                >
                  expand_more
                </span>
              </button>

              {fundamentalOpen && (
                <div className="flex flex-col pl-3 pr-space-xs py-0.5 gap-0.5 border-l border-primary/20 ml-4">
                  {/* Impacted News */}
                  <button
                    type="button"
                    onClick={() => handleLinkClick('impacted-news')}
                    className={`py-1.5 px-space-sm rounded-lg text-left font-label-md text-label-md transition-all flex items-center gap-2 ${
                      isScreenActive('impacted-news') ? activeLinkClass : inactiveLinkClass
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">feed</span>
                    <span>Impacted News &amp; Events</span>
                  </button>

                  {/* Research Journal */}
                  <button
                    type="button"
                    onClick={() => handleLinkClick('trading-journal')}
                    className={`py-1.5 px-space-sm rounded-lg text-left font-label-md text-label-md transition-all flex items-center gap-2 ${
                      isScreenActive('trading-journal') ? activeLinkClass : inactiveLinkClass
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">menu_book</span>
                    <span>Research &amp; Notes Journal</span>
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Bottom utility links */}
        <div className="p-space-xs border-t border-outline-variant/30 flex flex-col gap-0.5 shrink-0 bg-surface-container-low">
          {!user && (
            <button
              type="button"
              onClick={() => handleLinkClick('login')}
              className={`flex items-center gap-space-sm px-space-md py-2 rounded-lg text-left transition-all w-full cursor-pointer ${
                isScreenActive('login') ? activeLinkClass : inactiveLinkClass
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">account_circle</span>
              <span className="font-label-md text-label-md flex-1">Analyst Login Page</span>
              <span className="text-[9px] font-mono-xs text-primary font-bold uppercase">Portal</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => handleLinkClick('settings')}
            className={`flex items-center gap-space-sm px-space-md py-2 rounded-lg text-left transition-all w-full cursor-pointer ${
              isScreenActive('settings') ? activeLinkClass : inactiveLinkClass
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">tune</span>
            <span className="font-label-md text-label-md flex-1">Workstation Settings</span>
          </button>

          <button
            type="button"
            onClick={() => handleLinkClick('help-and-support')}
            className={`flex items-center gap-space-sm px-space-md py-2 rounded-lg text-left transition-all w-full ${
              isScreenActive('help-and-support') ? activeLinkClass : inactiveLinkClass
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">help</span>
            <span className="font-label-md text-label-md flex-1">Help &amp; Documentation</span>
          </button>
        </div>
      </aside>
    </>
  );
};
