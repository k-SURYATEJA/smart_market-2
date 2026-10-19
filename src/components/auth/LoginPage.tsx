import React, { useState } from 'react';
import { ScreenId, UserProfile } from '../../types/market';

interface LoginPageProps {
  onLoginSuccess: (user: UserProfile) => void;
  onNavigate: (screen: ScreenId) => void;
  onContinueAsGuest: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onNavigate,
  onContinueAsGuest,
}) => {
  const [email, setEmail] = useState('alex.morgan@marketpulse.io');
  const [password, setPassword] = useState('marketpulse2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDemoLogin = () => {
    setIsLoading(true);
    setError(null);
    setTimeout(() => {
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
      setIsLoading(false);
      onLoginSuccess(demoUser);
    }, 400);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Please enter both your analyst email and password.');
      return;
    }

    if (!email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const generatedName =
        email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) ||
        'Chartered Analyst';

      const user: UserProfile = {
        id: `usr-${Date.now()}`,
        name: generatedName,
        email: email.trim(),
        role: 'Pro Technical Analyst',
        specialty: 'Equities & Swing Technicals',
        plan: 'Pro Terminal',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        joinedDate: 'Current Session',
      };
      onLoginSuccess(user);
    }, 550);
  };

  return (
    <div className="min-h-screen bg-black text-[#f4f4f5] flex flex-col justify-between selection:bg-primary selection:text-black">
      {/* 1. Dedicated Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-md border-b border-outline-variant/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo & Back link */}
          <div className="flex items-center gap-4">
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
          </div>

          {/* Right Action: Return to Home or Register */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="hidden sm:flex items-center gap-1.5 py-1.5 px-3 rounded-lg border border-outline-variant/40 bg-surface-container hover:border-primary text-on-surface-variant hover:text-white text-xs font-medium transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">home</span>
              <span>Back to Home</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('register')}
              className="py-1.5 px-3.5 rounded-lg bg-surface-container border border-outline-variant/40 hover:border-primary text-primary text-xs font-semibold transition-all cursor-pointer flex items-center gap-1"
            >
              <span>Create Account</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Main Login Body: Split Hero & Login Card */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Institutional Value Props & Live Market Snapshot */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-semibold tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
              <span>INSTITUTIONAL LOGIN GATEWAY</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
              Sign in to your <span className="text-primary underline decoration-primary/40 decoration-4 underline-offset-4">Technical &amp; Fundamental</span> Workstation
            </h1>

            <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed max-w-xl font-normal">
              Access real-time TradingView multi-chart layouts, Indian equity deep dives,
              balance sheet fundamentals, and macro catalyst feeds. Pure analysis—completely free of buy or sell execution distractions.
            </p>

            {/* Feature Checkpoints */}
            <div className="space-y-3 pt-2 text-sm text-on-surface-variant font-normal">
              <div className="flex items-center gap-2.5 text-on-surface">
                <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
                <span>Official TradingView Interactive Charting with 100+ Indicators</span>
              </div>
              <div className="flex items-center gap-2.5 text-on-surface">
                <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
                <span>Complete Fundamental Statements: P&amp;L, Balance Sheets &amp; RBI Policies</span>
              </div>
              <div className="flex items-center gap-2.5 text-on-surface">
                <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
                <span>Automated Breakout Scanner &amp; Mathematical Target Calculator</span>
              </div>
              <div className="flex items-center gap-2.5 text-on-surface">
                <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
                <span>Local Session Security with Zero Brokerage Routing</span>
              </div>
            </div>

            {/* Live Market Mini-Card */}
            <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-2 max-w-lg">
              <div className="flex items-center justify-between text-xs text-outline border-b border-outline-variant/20 pb-2">
                <span className="text-secondary font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary inline-block animate-pulse" />
                  NSE &amp; GLOBAL FOREX ACTIVE
                </span>
                <span className="font-mono text-xs">12ms Latency</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <span className="text-outline text-[11px] block font-medium">NIFTY 50</span>
                  <span className="text-white font-mono font-bold">24,852.15</span>
                  <span className="text-secondary font-mono text-[11px] block">+0.58%</span>
                </div>
                <div>
                  <span className="text-outline text-[11px] block font-medium">SENSEX</span>
                  <span className="text-white font-mono font-bold">81,720.40</span>
                  <span className="text-secondary font-mono text-[11px] block">+0.51%</span>
                </div>
                <div>
                  <span className="text-outline text-[11px] block font-medium">USD / INR</span>
                  <span className="text-white font-mono font-bold">83.92</span>
                  <span className="text-secondary font-mono text-[11px] block">+0.10%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Dedicated Login Form Card */}
          <div className="lg:col-span-6 w-full max-w-md mx-auto">
            <div className="bg-surface-container-low border border-primary/30 rounded-2xl shadow-2xl p-6 sm:p-8 relative overflow-hidden">
              {/* Green Accent Bar */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-emerald-300 to-primary" />

              <div className="mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Analyst Sign In
                </h2>
                <p className="text-xs text-outline mt-1 font-normal">
                  Enter your credentials to unlock terminal layouts and saved research
                </p>
              </div>

              {/* Instant One-Click Demo Access */}
              <div className="mb-5">
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-xl border border-primary/50 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-semibold flex items-center justify-center gap-2.5 transition-all cursor-pointer group shadow-[0_0_12px_rgba(0,208,108,0.25)]"
                >
                  <span className="material-symbols-outlined text-[18px] group-hover:scale-110 transition-transform">
                    bolt
                  </span>
                  <span>One-Click Demo Login (Pro Analyst)</span>
                </button>
              </div>

              <div className="flex items-center gap-3 mb-5">
                <div className="h-px bg-outline-variant/30 flex-1" />
                <span className="text-[11px] text-outline uppercase tracking-wider font-semibold">
                  or sign in with email
                </span>
                <div className="h-px bg-outline-variant/30 flex-1" />
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-xl bg-tertiary-container/20 border border-tertiary/40 text-tertiary text-xs flex items-center gap-2 animate-in fade-in">
                    <span className="material-symbols-outlined text-[18px]">error</span>
                    <span>{error}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">
                    Analyst Email Address
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3.5 top-3 text-outline text-[18px]">
                      mail
                    </span>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="analyst@marketpulse.io"
                      required
                      className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl pl-10 pr-3 py-2.5 text-sm text-white placeholder:text-outline/60 focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => onNavigate('forgot-password')}
                      className="text-xs text-primary hover:underline cursor-pointer font-medium"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3.5 top-3 text-outline text-[18px]">
                      key
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder:text-outline/60 focus:border-primary focus:outline-none transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-outline hover:text-white cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="rememberPage"
                      checked={rememberMe}
                      onChange={e => setRememberMe(e.target.checked)}
                      className="rounded border-outline-variant/40 text-primary focus:ring-primary accent-primary cursor-pointer"
                    />
                    <label
                      htmlFor="rememberPage"
                      className="text-xs text-on-surface-variant cursor-pointer select-none font-medium"
                    >
                      Remember this workstation
                    </label>
                  </div>
                  <span className="text-[11px] text-outline font-medium">
                    256-bit TLS
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-primary text-black font-bold rounded-xl hover:bg-emerald-400 active:scale-[0.99] transition-all text-sm flex items-center justify-center gap-2 shadow-[0_0_16px_rgba(0,208,108,0.4)] cursor-pointer mt-2"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      <span>Authenticating Terminal...</span>
                    </span>
                  ) : (
                    <>
                      <span>Sign In to Workstation</span>
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </>
                  )}
                </button>
              </form>

              {/* Bottom Navigation Links */}
              <div className="mt-6 pt-5 border-t border-outline-variant/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <span className="text-outline font-normal">
                  Don't have an analyst account?
                </span>
                <button
                  type="button"
                  onClick={() => onNavigate('register')}
                  className="text-primary hover:underline font-semibold cursor-pointer"
                >
                  Create Account →
                </button>
              </div>

              {/* Continue As Guest */}
              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={onContinueAsGuest}
                  className="text-xs text-outline hover:text-white transition-colors cursor-pointer underline decoration-outline/40 font-normal"
                >
                  Skip login and continue as Guest
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
              onClick={() => onNavigate('market-charts')}
              className="hover:text-primary transition-colors cursor-pointer"
            >
              TradingView Charts
            </button>
            <span>·</span>
            <button
              onClick={() => onNavigate('register')}
              className="hover:text-primary transition-colors cursor-pointer"
            >
              Sign Up
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
