import React, { useState } from 'react';
import { UserProfile } from '../../types/market';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
  initialMode?: 'signin' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialMode = 'signin',
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('Equities & Swing Technicals');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

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
      onClose();
    }, 400);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === 'signin') {
      if (!email.trim() || !password.trim()) {
        setError('Please enter both email and password.');
        return;
      }

      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        const user: UserProfile = {
          id: `usr-${Date.now()}`,
          name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Market Analyst',
          email: email.trim(),
          role: 'Pro Technical Analyst',
          specialty: specialty,
          plan: 'Pro Terminal',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          joinedDate: 'Today',
        };
        onLoginSuccess(user);
        onClose();
      }, 500);
    } else {
      if (!name.trim()) {
        setError('Please enter your full name.');
        return;
      }
      if (!email.trim() || !email.includes('@')) {
        setError('Please enter a valid work or personal email address.');
        return;
      }
      if (password.length < 6) {
        setError('Password should be at least 6 characters.');
        return;
      }

      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        const newUser: UserProfile = {
          id: `usr-${Date.now()}`,
          name: name.trim(),
          email: email.trim(),
          role: 'Chartered Technical Analyst',
          specialty: specialty,
          plan: 'Pro Terminal',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          joinedDate: 'New Member',
        };
        onLoginSuccess(newUser);
        onClose();
      }, 600);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-surface-container-low border border-primary/30 rounded-2xl shadow-2xl overflow-hidden relative"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Accent Strip */}
        <div className="h-1.5 w-full bg-gradient-to-r from-primary via-emerald-300 to-primary" />

        {/* Modal Header */}
        <div className="px-6 pt-5 pb-4 flex items-center justify-between border-b border-outline-variant/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary flex items-center justify-center text-primary font-bold shadow-[0_0_10px_rgba(0,208,108,0.3)]">
              <span className="material-symbols-outlined text-[18px]">lock</span>
            </div>
            <div>
              <h2 className="font-headline-md text-base font-bold text-on-surface">
                {mode === 'signin' ? 'Sign In to Terminal' : 'Create Analyst Account'}
              </h2>
              <p className="text-xs text-outline font-normal">
                Smart Market Technical &amp; Fundamental Intelligence
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Mode Toggle Tabs */}
        <div className="px-6 pt-4 pb-1">
          <div className="grid grid-cols-2 p-1 rounded-xl bg-surface-container border border-outline-variant/30">
            <button
              type="button"
              onClick={() => { setMode('signin'); setError(null); }}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                mode === 'signin'
                  ? 'bg-primary text-black font-bold shadow-[0_0_8px_rgba(0,208,108,0.35)]'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('signup'); setError(null); }}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                mode === 'signup'
                  ? 'bg-primary text-black font-bold shadow-[0_0_8px_rgba(0,208,108,0.35)]'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Quick Demo Access banner */}
        <div className="px-6 pt-3">
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={isLoading}
            className="w-full py-2.5 px-3 rounded-xl border border-primary/40 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer group"
          >
            <span className="material-symbols-outlined text-[16px] group-hover:scale-110 transition-transform">
              bolt
            </span>
            <span>One-Click Demo Login (Pro Analyst)</span>
          </button>
        </div>

        <div className="px-6 py-2 flex items-center gap-3">
          <div className="h-px bg-outline-variant/30 flex-1" />
          <span className="text-[10px] text-outline uppercase tracking-wider font-semibold">or continue with email</span>
          <div className="h-px bg-outline-variant/30 flex-1" />
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-3.5">
          {error && (
            <div className="p-2.5 rounded-lg bg-tertiary-container/20 border border-tertiary/40 text-tertiary text-xs flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">error</span>
              <span>{error}</span>
            </div>
          )}

          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
                Full Name
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-outline text-[18px]">
                  person
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl pl-9 pr-3 py-2 text-sm text-on-surface placeholder:text-outline/60 focus:border-primary focus:outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-outline text-[18px]">
                mail
              </span>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="analyst@marketpulse.io"
                className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl pl-9 pr-3 py-2 text-sm text-on-surface placeholder:text-outline/60 focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                Password
              </label>
              {mode === 'signin' && (
                <button
                  type="button"
                  onClick={() => alert('Demo password reset link dispatched to terminal logs.')}
                  className="text-xs text-primary hover:underline font-medium"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-outline text-[18px]">
                key
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl pl-9 pr-10 py-2 text-sm text-on-surface placeholder:text-outline/60 focus:border-primary focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-outline hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[16px]">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
                Analysis Specialty
              </label>
              <select
                value={specialty}
                onChange={e => setSpecialty(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl px-3 py-2 text-xs text-on-surface focus:border-primary focus:outline-none font-medium"
              >
                <option value="Equities & Swing Technicals">Equities &amp; Swing Technicals (NSE/BSE)</option>
                <option value="Global Macro & Forex">Global Macro &amp; Forex (G10 &amp; USD/INR)</option>
                <option value="Fundamental & Financial Modeling">Fundamental &amp; Corporate Financials</option>
                <option value="Systematic Breakout Trading">Breakouts, Volume Spread &amp; Moving Averages</option>
              </select>
            </div>
          )}

          {mode === 'signin' && (
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                className="rounded border-outline-variant/40 text-primary focus:ring-primary accent-primary cursor-pointer"
              />
              <label htmlFor="remember" className="text-xs text-outline cursor-pointer select-none font-normal">
                Remember this workstation session
              </label>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 bg-primary text-black rounded-xl hover:bg-emerald-400 active:scale-[0.99] transition-all text-xs flex items-center justify-center gap-2 font-bold shadow-[0_0_12px_rgba(0,208,108,0.4)] cursor-pointer mt-2"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                <span>Authenticating...</span>
              </span>
            ) : mode === 'signin' ? (
              <>
                <span>Sign In to Workstation</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </>
            ) : (
              <>
                <span>Create Pro Terminal Account</span>
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
              </>
            )}
          </button>

          <p className="text-center text-[11px] text-outline pt-1 font-normal">
            Protected with local terminal encryption · No financial brokerage or trading execution
          </p>
        </form>
      </div>
    </div>
  );
};
