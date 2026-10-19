import React, { useState } from 'react';

export const SettingsView: React.FC = () => {
  const [defaultChartEngine, setDefaultChartEngine] = useState<'tradingview' | 'native'>('tradingview');
  const [defaultInterval, setDefaultInterval] = useState<string>('D');
  const [newsSentimentFilter, setNewsSentimentFilter] = useState<'All' | 'HighImpact'>('All');
  const [soundAlerts, setSoundAlerts] = useState<boolean>(true);
  const [showVolumeProfile, setShowVolumeProfile] = useState<boolean>(true);
  const [showEmaRibbon, setShowEmaRibbon] = useState<boolean>(true);
  const [savedToast, setSavedToast] = useState(false);

  const handleSave = () => {
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  return (
    <div className="flex flex-col w-full gap-space-md max-w-4xl">
      <div>
        <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">
          Workstation &amp; Analytics Settings
        </h2>
        <p className="font-body-sm text-body-sm text-outline mt-0.5">
          Configure default charting engines, technical indicator presets, and fundamental news filters.
        </p>
      </div>

      {savedToast && (
        <div className="p-3 bg-primary/20 border border-primary text-primary rounded-lg font-mono-xs text-mono-xs font-bold flex items-center gap-2 animate-in fade-in">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          Analytics preferences saved successfully!
        </div>
      )}

      {/* Analyst Profile */}
      <div className="bg-surface-container rounded-xl p-space-md border border-outline-variant/20 flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
        <div className="flex items-center gap-space-md">
          <img
            alt="Profile"
            className="w-14 h-14 rounded-full object-cover ring-2 ring-primary"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDEDVetxpXfyxZYOeMTo8XwgvnrSIW_NgUegInDshi3tzAAbU6SwWQGCnFmm-UidJfyqNSvTUSW-tNxU0XIE_GWcC4ptSdJ7mBYQ0wcAtJ2alF9zBq8S0GebBO-Br7cR5XIztgLnskSzijkKU7H0TKL5y7Lt1-HPirMbvPKF8xJ-ZECiF-gCBENpD3UVLGPEU_EwnA8XV4w5YaoXJ6tKj4u9gnqRPij8xjJh14jEG8CrMTrDpgwFhwG"
            referrerPolicy="no-referrer"
          />
          <div>
            <h3 className="font-headline-md font-bold text-on-surface">Alex Morgan</h3>
            <div className="flex items-center gap-2 mt-0.5 font-mono-xs text-mono-xs">
              <span className="text-primary font-bold">SENIOR MARKET ANALYST</span>
              <span className="text-outline">· CMT &amp; CFA charterholder</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded bg-surface-container-highest text-primary font-mono-xs text-mono-xs font-bold border border-primary/30">
            Pure Black &amp; Yellow Theme Active
          </span>
        </div>
      </div>

      {/* Technical Charting Configuration */}
      <div className="bg-surface-container rounded-xl p-space-md border border-outline-variant/20 flex flex-col gap-space-md font-mono-xs text-mono-xs">
        <h3 className="font-headline-md font-bold text-on-surface pb-2 border-b border-outline-variant/20 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">candlestick_chart</span>
          Technical Charting Engine
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
          <div>
            <label className="text-outline uppercase font-label-sm block mb-1">
              Primary Chart Engine
            </label>
            <div className="grid grid-cols-2 gap-2 bg-surface-container-lowest p-1 rounded border border-outline-variant/30">
              <button
                type="button"
                onClick={() => setDefaultChartEngine('tradingview')}
                className={`py-1.5 rounded cursor-pointer transition-colors ${
                  defaultChartEngine === 'tradingview'
                    ? 'bg-primary text-black font-bold'
                    : 'text-outline hover:text-on-surface'
                }`}
              >
                TradingView Live
              </button>
              <button
                type="button"
                onClick={() => setDefaultChartEngine('native')}
                className={`py-1.5 rounded cursor-pointer transition-colors ${
                  defaultChartEngine === 'native'
                    ? 'bg-primary text-black font-bold'
                    : 'text-outline hover:text-on-surface'
                }`}
              >
                Technicals Engine
              </button>
            </div>
          </div>

          <div>
            <label className="text-outline uppercase font-label-sm block mb-1">
              Default Chart Timeframe
            </label>
            <div className="grid grid-cols-4 gap-1.5 bg-surface-container-lowest p-1 rounded border border-outline-variant/30">
              {['15', '60', 'D', 'W'].map(tf => (
                <button
                  key={tf}
                  type="button"
                  onClick={() => setDefaultInterval(tf)}
                  className={`py-1 rounded cursor-pointer transition-colors ${
                    defaultInterval === tf
                      ? 'bg-primary text-black font-bold'
                      : 'text-outline hover:text-on-surface'
                  }`}
                >
                  {tf === '60' ? '1H' : tf}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Technical Overlays Toggle */}
        <div className="pt-2 border-t border-outline-variant/20 flex flex-col gap-2">
          <span className="text-outline uppercase font-label-sm">Active Technical Overlays</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <label className="flex items-center gap-2 p-2 rounded bg-surface-container-low border border-outline-variant/30 cursor-pointer">
              <input
                type="checkbox"
                checked={showEmaRibbon}
                onChange={e => setShowEmaRibbon(e.target.checked)}
                className="accent-primary"
              />
              <span className="text-on-surface">Exponential Moving Averages (20 / 50 / 200 EMA)</span>
            </label>
            <label className="flex items-center gap-2 p-2 rounded bg-surface-container-low border border-outline-variant/30 cursor-pointer">
              <input
                type="checkbox"
                checked={showVolumeProfile}
                onChange={e => setShowVolumeProfile(e.target.checked)}
                className="accent-primary"
              />
              <span className="text-on-surface">Volume &amp; Liquidity Profile Histogram</span>
            </label>
          </div>
        </div>
      </div>

      {/* Fundamental Intelligence & Alerts */}
      <div className="bg-surface-container rounded-xl p-space-md border border-outline-variant/20 flex flex-col gap-space-md font-mono-xs text-mono-xs">
        <h3 className="font-headline-md font-bold text-on-surface pb-2 border-b border-outline-variant/20 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">feed</span>
          Fundamental News &amp; Alert Preferences
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
          <div>
            <label className="text-outline uppercase font-label-sm block mb-1">
              News Feed Priority
            </label>
            <div className="grid grid-cols-2 gap-2 bg-surface-container-lowest p-1 rounded border border-outline-variant/30">
              <button
                type="button"
                onClick={() => setNewsSentimentFilter('All')}
                className={`py-1.5 rounded cursor-pointer transition-colors ${
                  newsSentimentFilter === 'All'
                    ? 'bg-primary text-black font-bold'
                    : 'text-outline hover:text-on-surface'
                }`}
              >
                All Market News
              </button>
              <button
                type="button"
                onClick={() => setNewsSentimentFilter('HighImpact')}
                className={`py-1.5 rounded cursor-pointer transition-colors ${
                  newsSentimentFilter === 'HighImpact'
                    ? 'bg-primary text-black font-bold'
                    : 'text-outline hover:text-on-surface'
                }`}
              >
                High Impact Catalysts
              </button>
            </div>
          </div>

          <div>
            <label className="text-outline uppercase font-label-sm block mb-1">
              Real-time Audio Chimes
            </label>
            <button
              type="button"
              onClick={() => setSoundAlerts(!soundAlerts)}
              className={`w-full py-2 px-3 rounded flex items-center justify-between border cursor-pointer transition-colors ${
                soundAlerts
                  ? 'bg-primary/10 border-primary text-primary font-bold'
                  : 'bg-surface-container-lowest border-outline-variant/30 text-outline'
              }`}
            >
              <span>Price Target Trigger Audio</span>
              <span className="material-symbols-outlined text-[18px]">
                {soundAlerts ? 'volume_up' : 'volume_off'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts for Technical & Fundamental Analysis */}
      <div className="bg-surface-container rounded-xl p-space-md border border-outline-variant/20 flex flex-col gap-space-sm font-mono-xs text-mono-xs">
        <h3 className="font-headline-md font-bold text-on-surface pb-2 border-b border-outline-variant/20">
          Analysis Hotkey Cheat Sheet
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          <div className="flex items-center justify-between p-2 rounded bg-surface-container-low border border-outline-variant/20">
            <span className="text-outline">Open Command Palette / Search:</span>
            <kbd className="px-2 py-0.5 rounded bg-surface-container-highest text-primary border border-primary/30 font-bold">
              Ctrl + K
            </kbd>
          </div>
          <div className="flex items-center justify-between p-2 rounded bg-surface-container-low border border-outline-variant/20">
            <span className="text-outline">Arm Price Trigger Alert:</span>
            <kbd className="px-2 py-0.5 rounded bg-surface-container-highest text-primary border border-primary/30 font-bold">
              Alt + A
            </kbd>
          </div>
          <div className="flex items-center justify-between p-2 rounded bg-surface-container-low border border-outline-variant/20">
            <span className="text-outline">Toggle Fullscreen Chart:</span>
            <kbd className="px-2 py-0.5 rounded bg-surface-container-highest text-primary border border-primary/30 font-bold">
              Shift + F
            </kbd>
          </div>
          <div className="flex items-center justify-between p-2 rounded bg-surface-container-low border border-outline-variant/20">
            <span className="text-outline">Cycle Timeframes (1D / 1H / 15m):</span>
            <kbd className="px-2 py-0.5 rounded bg-surface-container-highest text-primary border border-primary/30 font-bold">
              Alt + T
            </kbd>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={handleSave}
          className="px-6 py-2.5 bg-primary text-black rounded-lg font-label-md font-bold hover:bg-primary-fixed transition-colors cursor-pointer shadow-[0_0_12px_rgba(0,208,108,0.35)] flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">save</span>
          <span>Save Preferences</span>
        </button>
      </div>
    </div>
  );
};
