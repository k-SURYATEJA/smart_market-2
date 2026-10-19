import React, { useState } from 'react';
import { ScreenId } from '../../types/market';

interface ForgotPasswordPageProps {
  onNavigate: (screen: ScreenId) => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({
  onNavigate,
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid registered analyst email address.');
      return;
    }

    setError(null);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 600);
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
              alt="MarketPulse Logo"
              className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
              src="https://lh3.googleusercontent.com/aida/AEtjO1UogdCnsq4CnqcjUIRoH3QOpKXr8AtUC1QccdpaSbbj-_EH2vhUg0gZbrXAAfyROPqUburyuRZhWMan3zXRt-Dg34kve2uzywXuACDhpPMJQ0t-Z99uZWCxQ4Wk8cHp29L-gc878tOwDwlWZV189CcSH_kClsaLDTmPeINcMpXHeT_RzJOp7Zmtb9peAE5R_UPhFAQr3HK1mbZxYRZIaD8t0c-rMrQ9WyQ16DxhYKQehpeGvpwfTq4t3Y"
              referrerPolicy="no-referrer"
            />
            <div className="flex flex-col">
              <span className="font-headline-md text-base sm:text-lg font-bold tracking-tight text-white leading-none">
                MarketPulse
              </span>
              <span className="font-mono-xs text-[9px] font-bold text-primary tracking-widest uppercase mt-0.5">
                Analytics Terminal
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('login')}
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg border border-outline-variant/40 bg-surface-container hover:border-primary text-primary text-xs font-semibold transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Back to Sign In</span>
          </button>
        </div>
      </header>

      {/* 2. Main Body */}
      <main className="flex-1 max-w-md w-full mx-auto px-4 py-12 md:py-20 flex items-center justify-center">
        <div className="w-full bg-surface-container-low border border-primary/30 rounded-2xl shadow-2xl p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-emerald-300 to-primary" />

          {!isSubmitted ? (
            <>
              <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary text-primary flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[24px]">lock_reset</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Reset Workstation Access
              </h2>
              <p className="text-xs text-outline mt-1 mb-6 font-normal">
                Enter your email address and we will dispatch a terminal recovery link to restore your workstation profile.
              </p>

              {error && (
                <div className="p-3 mb-4 rounded-xl bg-tertiary-container/20 border border-tertiary/40 text-tertiary text-xs flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px]">error</span>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">
                    Registered Analyst Email
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

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-primary text-black font-bold rounded-xl hover:bg-emerald-400 active:scale-[0.99] transition-all text-sm flex items-center justify-center gap-2 shadow-[0_0_16px_rgba(0,208,108,0.4)] cursor-pointer"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      <span>Sending Instructions...</span>
                    </span>
                  ) : (
                    <>
                      <span>Dispatch Recovery Instructions</span>
                      <span className="material-symbols-outlined text-[18px]">send</span>
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-2 space-y-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-secondary/20 border border-secondary text-secondary flex items-center justify-center">
                <span className="material-symbols-outlined text-[30px]">mark_email_read</span>
              </div>

              <h2 className="text-xl font-bold text-white tracking-tight">
                Recovery Link Dispatched
              </h2>

              <p className="text-xs text-outline leading-relaxed font-normal">
                We have generated a secure password reset link and transmitted it to <span className="text-primary font-bold">{email}</span>.
              </p>

              <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/30 text-left text-xs">
                <span className="text-outline text-[10px] block uppercase mb-1 font-semibold">Temporary Analyst Passcode</span>
                <span className="text-primary font-mono text-sm tracking-widest font-bold">MP-924-817</span>
                <span className="text-[11px] text-outline block mt-1 font-normal">Valid for 15 minutes</span>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => onNavigate('login')}
                  className="w-full py-2.5 px-4 bg-primary text-black font-bold rounded-xl hover:bg-emerald-400 text-xs cursor-pointer shadow-[0_0_12px_rgba(0,208,108,0.35)] transition-all"
                >
                  Return to Sign In
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('home')}
                  className="text-xs text-outline hover:text-white py-1 cursor-pointer transition-colors font-medium"
                >
                  Back to Home Page
                </button>
              </div>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-outline-variant/20 text-center">
            <button
              type="button"
              onClick={() => onNavigate('login')}
              className="text-xs text-outline hover:text-primary transition-colors cursor-pointer font-medium"
            >
              Remember your password? Sign In →
            </button>
          </div>
        </div>
      </main>

      {/* 3. Footer */}
      <footer className="w-full bg-surface-container-lowest border-t border-outline-variant/30 py-6 px-4 sm:px-6 lg:px-8 text-center font-mono-xs text-xs text-outline">
        MarketPulse Analytics Terminal · Built for Technical &amp; Fundamental Research only.
      </footer>
    </div>
  );
};
