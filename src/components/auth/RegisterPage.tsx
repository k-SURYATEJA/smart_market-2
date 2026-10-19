import React, { useState } from 'react';
import { ScreenId, UserProfile } from '../../types/market';

interface RegisterPageProps {
  onRegisterSuccess: (user: UserProfile) => void;
  onNavigate: (screen: ScreenId) => void;
  onContinueAsGuest: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({
  onRegisterSuccess,
  onNavigate,
  onContinueAsGuest,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [specialty, setSpecialty] = useState('Equities & Swing Technicals');
  const [timeframe, setTimeframe] = useState('Daily & Positional Swing (1D/1W)');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify your password confirmation.');
      return;
    }

    if (!agreeTerms) {
      setError('Please accept the Research & Technical Analysis terms to proceed.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const newUser: UserProfile = {
        id: `usr-${Date.now()}`,
        name: name.trim(),
        email: email.trim(),
        role: 'Pro Chartered Analyst',
        specialty: specialty,
        plan: 'Pro Terminal',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        joinedDate: 'October 2026',
      };
      onRegisterSuccess(newUser);
    }, 600);
  };

  const handleDemoRegistration = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const demoUser: UserProfile = {
        id: 'usr-demo-01',
        name: 'Alex Morgan',
        email: 'alex.morgan@marketpulse.io',
        role: 'Senior Market Technician (CMT)',
        specialty: 'Equities & Swing Technicals',
        plan: 'Pro Terminal',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        joinedDate: 'October 2024',
      };
      onRegisterSuccess(demoUser);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-black text-[#f4f4f5] flex flex-col justify-between selection:bg-primary selection:text-black">
      {/* 1. Header */}
      <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-md border-b border-outline-variant/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 cursor-pointer group text-left select-none"
          >
            <img
              alt="Smart Market Logo"
              className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
              src="https://lh3.googleusercontent.com/aida/AEtjO1UogdCnsq4CnqcjUIRoH3QOpKXr8AtUC1QccdpaSbbj-_EH2vhUg0gZbrXAAfyROPqUburyuRZhWMan3zXRt-Dg34kve2uzywXuACDhpPMJQ0t-Z99uZWCxQ4Wk8cHp29L-gc878tOwDwlWZV189CcSH_kClsaLDTmPeINcMpXHeT_RzJOp7Zmtb9peAE5R_UPhFAQr3HK1mbZxYRZIaD8t0c-rMrQ9WyQ16DxhYKQehpeGvpwfTq4t3Y"
              referrerPolicy="no-referrer"
            />
            <div className="flex flex-col">
              <span className="font-headline-md text-base sm:text-lg font-bold tracking-tight text-white leading-none">
                Smart Market
              </span>
              <span className="font-mono-xs text-[9px] font-bold text-primary tracking-widest uppercase mt-0.5">
                Analytics Terminal
              </span>
            </div>
          </button>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-xs text-outline font-normal">
              Already have an account?
            </span>
            <button
              type="button"
              onClick={() => onNavigate('login')}
              className="py-1.5 px-3.5 rounded-lg bg-surface-container border border-outline-variant/40 hover:border-primary text-primary text-xs font-semibold transition-all cursor-pointer flex items-center gap-1"
            >
              <span>Sign In</span>
              <span className="material-symbols-outlined text-[14px]">login</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Why Register */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-semibold tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
              <span>NEW ANALYST REGISTRATION</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-[1.15]">
              Join the Elite Circle of <span className="text-primary underline decoration-primary/40 decoration-4 underline-offset-4">Technical &amp; Fundamental</span> Researchers
            </h1>

            <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed font-normal">
              Equip yourself with institutional TradingView multi-chart layouts, deep Indian stock analytics, balance sheets, and real-time RBI &amp; earnings catalysts.
            </p>

            <div className="space-y-3.5 pt-2 text-xs">
              <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5">
                  candlestick_chart
                </span>
                <div>
                  <h4 className="text-white font-bold text-sm">Pure TradingView Integration</h4>
                  <p className="text-outline text-xs mt-0.5 font-normal">
                    100+ indicators, responsive crosshair, multi-timeframe grids in high-contrast dark theme.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5">
                  feed
                </span>
                <div>
                  <h4 className="text-white font-bold text-sm">Comprehensive Corporate Disclosures</h4>
                  <p className="text-outline text-xs mt-0.5 font-normal">
                    Quarterly earnings, 4-year P&amp;L trajectories, FII/DII shareholding patterns, and dividend calendars.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5">
                  block
                </span>
                <div>
                  <h4 className="text-white font-bold text-sm">100% Zero Execution Distraction</h4>
                  <p className="text-outline text-xs mt-0.5 font-normal">
                    No buy/sell execution traps, no order slippage, no broker commissions.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Registration Card */}
          <div className="lg:col-span-7 w-full max-w-lg mx-auto">
            <div className="bg-surface-container-low border border-primary/30 rounded-2xl shadow-2xl p-6 sm:p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-emerald-300 to-primary" />

              <div className="mb-5">
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Create Analyst Account
                </h2>
                <p className="text-xs text-outline mt-1 font-normal">
                  Configure your professional terminal workspace profile
                </p>
              </div>

              {/* Demo Fill Alternative */}
              <button
                type="button"
                onClick={handleDemoRegistration}
                className="w-full mb-4 py-2.5 px-3 rounded-xl border border-primary/40 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">bolt</span>
                <span>Fast-Track: Register &amp; Load Demo Pro Profile</span>
              </button>

              <form onSubmit={handleSubmit} className="space-y-3.5">
                {error && (
                  <div className="p-3 rounded-xl bg-tertiary-container/20 border border-tertiary/40 text-tertiary text-xs flex items-center gap-2 animate-in fade-in">
                    <span className="material-symbols-outlined text-[18px]">error</span>
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      required
                      className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl px-3 py-2 text-sm text-white placeholder:text-outline/60 focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="rahul@analyst.com"
                      required
                      className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl px-3 py-2 text-sm text-white placeholder:text-outline/60 focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
                      Password (min 6 chars)
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        required
                        className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl px-3 pr-8 py-2 text-sm text-white placeholder:text-outline/60 focus:border-primary focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-2.5 text-outline hover:text-white cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          {showPassword ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
                      Confirm Password
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl px-3 py-2 text-sm text-white placeholder:text-outline/60 focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
                      Primary Market Specialty
                    </label>
                    <select
                      value={specialty}
                      onChange={e => setSpecialty(e.target.value)}
                      className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl px-3 py-2 text-xs text-white focus:border-primary focus:outline-none font-medium"
                    >
                      <option value="Equities & Swing Technicals">Equities &amp; Swing Technicals (NSE/BSE)</option>
                      <option value="Global Macro & Forex">Global Macro &amp; Forex (USD/INR, EUR/USD)</option>
                      <option value="Fundamental & Financial Modeling">Fundamental &amp; Balance Sheet Modeling</option>
                      <option value="Systematic Breakout Trading">Breakouts, Volume Spikes &amp; EMAs</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
                      Preferred Timeframe
                    </label>
                    <select
                      value={timeframe}
                      onChange={e => setTimeframe(e.target.value)}
                      className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl px-3 py-2 text-xs text-white focus:border-primary focus:outline-none font-medium"
                    >
                      <option value="Daily & Positional Swing (1D/1W)">Daily &amp; Positional Swing (1D / 1W)</option>
                      <option value="Intraday Momentum (5m/15m)">Intraday Momentum (5m / 15m)</option>
                      <option value="Multi-Timeframe Top-Down (15m/1D/1W)">Multi-Timeframe Top-Down</option>
                      <option value="Long-Term Fundamental Value">Long-Term Fundamental Value</option>
                    </select>
                  </div>
                </div>

                <div className="pt-1">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={e => setAgreeTerms(e.target.checked)}
                      className="mt-0.5 rounded border-outline-variant/40 text-primary focus:ring-primary accent-primary cursor-pointer"
                    />
                    <span className="text-xs text-outline leading-normal select-none font-normal">
                      I understand Smart Market is an analytical terminal exclusively designed for technical charting &amp; fundamental intelligence, with no buy/sell order execution.
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-primary text-black font-bold rounded-xl hover:bg-emerald-400 active:scale-[0.99] transition-all text-sm flex items-center justify-center gap-2 shadow-[0_0_16px_rgba(0,208,108,0.4)] cursor-pointer mt-3"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      <span>Creating Analyst Account...</span>
                    </span>
                  ) : (
                    <>
                      <span>Complete Registration &amp; Open Workstation</span>
                      <span className="material-symbols-outlined text-[18px]">check_circle</span>
                    </>
                  )}
                </button>
              </form>

              <div className="mt-5 pt-4 border-t border-outline-variant/20 flex items-center justify-between text-xs">
                <span className="text-outline font-normal">Already registered?</span>
                <button
                  type="button"
                  onClick={() => onNavigate('login')}
                  className="text-primary hover:underline font-semibold cursor-pointer"
                >
                  Sign In instead →
                </button>
              </div>

              <div className="mt-3 text-center">
                <button
                  type="button"
                  onClick={onContinueAsGuest}
                  className="text-xs text-outline hover:text-white transition-colors cursor-pointer underline decoration-outline/40 font-normal"
                >
                  Skip registration and continue as Guest
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 3. Footer */}
      <footer className="w-full bg-surface-container-lowest border-t border-outline-variant/30 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-outline font-normal">
          <p>
            Smart Market Analytics Terminal · Built for Technical &amp; Fundamental Research only.
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('home')}
              className="hover:text-primary transition-colors cursor-pointer"
            >
              Home Overview
            </button>
            <span>·</span>
            <button
              onClick={() => onNavigate('login')}
              className="hover:text-primary transition-colors cursor-pointer"
            >
              Sign In
            </button>
            <span>·</span>
            <button
              onClick={() => onNavigate('market-charts')}
              className="hover:text-primary transition-colors cursor-pointer"
            >
              TradingView Charts
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
