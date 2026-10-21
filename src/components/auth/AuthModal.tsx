import React, { useState } from 'react';
import { ScreenId, UserProfile } from '../../types/market';
import { loginUser, registerUser, getPasswordStrength } from '../../services/authService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
  initialMode?: 'signin' | 'signup';
  onNavigate?: (screen: ScreenId) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialMode = 'signin',
  onNavigate,
}) => {
  const [mode, setMode]               = useState<'signin' | 'signup'>(initialMode);
  const [email, setEmail]             = useState('');
  const [password, setPassword]       = useState('');
  const [name, setName]               = useState('');
  const [specialty, setSpecialty]     = useState('Equities & Swing Technicals');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]             = useState<string | null>(null);
  const [isLoading, setIsLoading]     = useState(false);

  if (!isOpen) return null;

  const pwStrength = getPasswordStrength(password);
  const strengthLabel = ['', 'Weak', 'Fair', 'Strong'][pwStrength];
  const strengthColor  = ['', 'text-tertiary', 'text-yellow-400', 'text-secondary'][pwStrength];
  const strengthBarColors = [
    ['bg-outline-variant/30', 'bg-outline-variant/30', 'bg-outline-variant/30'],
    ['bg-tertiary', 'bg-outline-variant/30', 'bg-outline-variant/30'],
    ['bg-yellow-400', 'bg-yellow-400', 'bg-outline-variant/30'],
    ['bg-secondary', 'bg-secondary', 'bg-secondary'],
  ];

  const switchMode = (next: 'signin' | 'signup') => {
    setMode(next);
    setError(null);
    setEmail('');
    setPassword('');
    setName('');
  };

  const handleForgotPassword = () => {
    onClose();
    onNavigate?.('forgot-password');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    setIsLoading(true);
    try {
      if (mode === 'signin') {
        const result = await loginUser(email, password);
        if (result.success && result.profile) {
          onLoginSuccess(result.profile);
          onClose();
        } else {
          setError(result.errorMessage ?? 'Login failed.');
        }
      } else {
        const result = await registerUser(name, email, password, specialty);
        if (result.success && result.profile) {
          onLoginSuccess(result.profile);
          onClose();
        } else {
          setError(result.errorMessage ?? 'Registration failed.');
        }
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-surface-container-low border border-primary/30 rounded-2xl shadow-2xl overflow-hidden relative"
        onClick={e => e.stopPropagation()}
      >
        {/* Top accent strip */}
        <div className="h-1 w-full bg-gradient-to-r from-primary via-[#ff9b42] to-primary" />

        {/* Modal header */}
        <div className="px-6 pt-5 pb-4 flex items-center justify-between border-b border-outline-variant/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/50 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[18px]">lock</span>
            </div>
            <div>
              <h2 className="font-headline-md text-base font-bold text-on-surface">
                {mode === 'signin' ? 'Sign In to Terminal' : 'Create Analyst Account'}
              </h2>
              <p className="text-xs text-outline font-normal">
                Smart Market Analytics Terminal
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Mode toggle tabs */}
        <div className="px-6 pt-4 pb-1">
          <div className="grid grid-cols-2 p-1 rounded-xl bg-surface-container border border-outline-variant/30">
            {(['signin', 'signup'] as const).map(m => (
              <button
                key={m}
                type="button"
                onClick={() => switchMode(m)}
                className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                  mode === m
                    ? 'bg-primary text-black font-bold shadow-[0_0_8px_rgba(255,121,0,0.35)]'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {m === 'signin' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 pb-6 pt-3 space-y-3.5" noValidate>
          {error && (
            <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/40 text-red-400 text-xs flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] shrink-0">error</span>
              <span>{error}</span>
            </div>
          )}

          {mode === 'signup' && (
            <div>
              <label htmlFor="modal-name" className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
                Full Name
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">person</span>
                <input
                  id="modal-name"
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  autoComplete="name"
                  className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl pl-9 pr-3 py-2 text-sm text-on-surface placeholder:text-outline/60 focus:border-primary focus:outline-none transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label htmlFor="modal-email" className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">mail</span>
              <input
                id="modal-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="analyst@marketpulse.io"
                autoComplete="email"
                className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl pl-9 pr-3 py-2 text-sm text-on-surface placeholder:text-outline/60 focus:border-primary focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="modal-password" className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                Password
              </label>
              {mode === 'signin' && (
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-xs text-primary hover:underline font-medium"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">key</span>
              <input
                id="modal-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••"
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl pl-9 pr-10 py-2 text-sm text-on-surface placeholder:text-outline/60 focus:border-primary focus:outline-none transition-colors"
              />
              <button
                type="button"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
            {/* Password strength bar (signup only) */}
            {mode === 'signup' && password.length > 0 && (
              <div className="flex items-center gap-2 mt-1.5">
                <div className="flex gap-1 flex-1">
                  {strengthBarColors[pwStrength].map((cls, i) => (
                    <div key={i} className={`h-0.5 flex-1 rounded-full transition-colors ${cls}`} />
                  ))}
                </div>
                <span className={`text-[10px] font-semibold ${strengthColor}`}>{strengthLabel}</span>
              </div>
            )}
          </div>

          {mode === 'signup' && (
            <div>
              <label htmlFor="modal-specialty" className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
                Analysis Specialty
              </label>
              <select
                id="modal-specialty"
                value={specialty}
                onChange={e => setSpecialty(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl px-3 py-2 text-xs text-on-surface focus:border-primary focus:outline-none font-medium transition-colors"
              >
                <option value="Equities & Swing Technicals">Equities &amp; Swing Technicals (NSE/BSE)</option>
                <option value="Global Macro & Forex">Global Macro &amp; Forex (G10 &amp; USD/INR)</option>
                <option value="Fundamental & Financial Modeling">Fundamental &amp; Corporate Financials</option>
                <option value="Systematic Breakout Trading">Breakouts, Volume Spread &amp; Moving Averages</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 bg-primary text-black rounded-xl hover:bg-[#ff9b42] active:scale-[0.99] transition-all text-xs flex items-center justify-center gap-2 font-bold shadow-[0_0_12px_rgba(255,121,0,0.35)] cursor-pointer mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                <span>Authenticating…</span>
              </>
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
  Smart Market Analytics Terminal · Make informed market decisions
</p>

        </form>
      </div>
    </div>
  );
};
