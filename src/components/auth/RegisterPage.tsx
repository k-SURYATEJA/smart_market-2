import React, { useState } from 'react';
import { ScreenId, UserProfile } from '../../types/market';
import { registerUser, getPasswordStrength } from '../../services/authService';

interface RegisterPageProps {
  onRegisterSuccess: (user: UserProfile) => void;
  onNavigate: (screen: ScreenId) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onRegisterSuccess, onNavigate }) => {
  const [name, setName]                         = useState('');
  const [email, setEmail]                       = useState('');
  const [specialty, setSpecialty]               = useState('Equities & Swing Technicals');
  const [password, setPassword]                 = useState('');
  const [confirmPassword, setConfirmPassword]   = useState('');
  const [agreeTerms, setAgreeTerms]             = useState(false);
  const [showPassword, setShowPassword]         = useState(false);
  const [showConfirm, setShowConfirm]           = useState(false);
  const [error, setError]                       = useState<string | null>(null);
  const [isLoading, setIsLoading]               = useState(false);

  const pwStrength = getPasswordStrength(password);
  const strengthLabel = ['', 'Weak', 'Fair', 'Strong'][pwStrength];
  const strengthColor = ['', 'text-tertiary', 'text-yellow-400', 'text-secondary'][pwStrength];
  const strengthBarColors = [
    ['bg-outline-variant/30', 'bg-outline-variant/30', 'bg-outline-variant/30'],
    ['bg-tertiary', 'bg-outline-variant/30', 'bg-outline-variant/30'],
    ['bg-yellow-400', 'bg-yellow-400', 'bg-outline-variant/30'],
    ['bg-secondary', 'bg-secondary', 'bg-secondary'],
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!agreeTerms) {
      setError('Please accept the terms to continue.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await registerUser(name, email, password, specialty);
      if (result.success && result.profile) {
        onRegisterSuccess(result.profile);
      } else {
        setError(result.errorMessage ?? 'Registration failed. Please try again.');
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080d1a] text-white flex flex-col">
      {/* Header */}
      <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 lg:px-12 shrink-0">
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF9B42] via-[#FF7900] to-[#E06300] flex items-center justify-center shadow-[0_0_12px_rgba(255,121,0,0.35)]">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white stroke-current">
              <path d="M4 17L12 5L20 17H14L12 13L10 17H4Z" fill="currentColor" fillOpacity="0.9" />
              <path d="M12 13L15 18H9L12 13Z" fill="#141519" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-base font-black tracking-tight text-white leading-none">
              Smart <span className="text-[#FF7900]">Market</span>
            </span>
            <span className="text-[9px] font-bold text-[#FF7900] tracking-widest uppercase mt-0.5">
              Analytics Terminal
            </span>
          </div>
        </button>
        <button
          type="button"
          onClick={() => onNavigate('login')}
          className="text-sm text-[#FF7900] hover:text-[#ff9b42] transition-colors font-medium"
        >
          Log in
        </button>
      </header>

      {/* Main */}
      <main className="flex-1 grid lg:grid-cols-[1fr_500px] gap-10 items-center max-w-6xl w-full mx-auto px-6 lg:px-12 py-10">
        {/* Left hero — desktop only */}
        <section className="hidden lg:block max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#FF7900] mb-6">
            Your market workspace
          </p>
          <h1 className="text-5xl xl:text-6xl font-bold leading-[1.05] tracking-[-0.04em]">
            Build a better<br />
            <span className="text-[#FF7900]">market routine.</span>
          </h1>
          <p className="mt-6 text-base leading-7 text-slate-400 max-w-md">
            Create your account and keep your charts, watchlists, and research in one focused place.
          </p>
          <div className="mt-8 flex flex-col gap-3">
            {[
              { icon: 'monitoring',        label: 'Detailed Stock Deep Dives' },
              { icon: 'menu_book',         label: 'Research & Notes Journal' },
              { icon: 'feed',              label: 'Impacted News & Events Feed' },
            ].map(f => (
              <div key={f.icon} className="flex items-center gap-3 text-sm text-slate-400">
                <span className="material-symbols-outlined text-[18px] text-[#FF7900]">{f.icon}</span>
                {f.label}
              </div>
            ))}
          </div>
        </section>

        {/* Register card */}
        <section className="w-full max-w-[500px] mx-auto">
          <div className="rounded-2xl border border-white/10 bg-[#101827] p-7 sm:p-8 shadow-2xl">
            <div className="mb-6">
              <h2 className="text-2xl font-bold">Create your account</h2>
              <p className="text-sm text-slate-400 mt-1.5">Set up your Smart Market workspace.</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
              {error && (
                <div
                  role="alert"
                  aria-live="assertive"
                  className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2.5 text-xs text-red-400 flex items-start gap-2"
                >
                  <span className="material-symbols-outlined text-[15px] mt-0.5 shrink-0">error</span>
                  <span>{error}</span>
                </div>
              )}

              {/* Name + Email grid */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="reg-name" className="text-xs font-semibold text-slate-300">
                    Full name
                  </label>
                  <input
                    id="reg-name"
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Alex Morgan"
                    required
                    autoComplete="name"
                    className="rounded-lg border border-white/15 bg-[#0b1220] px-3 py-2.5 text-sm text-white outline-none focus:border-[#FF7900] focus:ring-1 focus:ring-[#FF7900]/30 transition-colors placeholder:text-slate-600"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="reg-email" className="text-xs font-semibold text-slate-300">
                    Email address
                  </label>
                  <input
                    id="reg-email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    required
                    autoComplete="email"
                    className="rounded-lg border border-white/15 bg-[#0b1220] px-3 py-2.5 text-sm text-white outline-none focus:border-[#FF7900] focus:ring-1 focus:ring-[#FF7900]/30 transition-colors placeholder:text-slate-600"
                  />
                </div>
              </div>

              {/* Specialty */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="reg-specialty" className="text-xs font-semibold text-slate-300">
                  Analysis specialty
                </label>
                <select
                  id="reg-specialty"
                  value={specialty}
                  onChange={e => setSpecialty(e.target.value)}
                  className="rounded-lg border border-white/15 bg-[#0b1220] px-3 py-2.5 text-sm text-white outline-none focus:border-[#FF7900] focus:ring-1 focus:ring-[#FF7900]/30 transition-colors"
                >
                  <option value="Equities & Swing Technicals">Equities &amp; Swing Technicals (NSE/BSE)</option>
                  <option value="Global Macro & Forex">Global Macro &amp; Forex (G10 &amp; USD/INR)</option>
                  <option value="Fundamental & Financial Modeling">Fundamental &amp; Corporate Financials</option>
                  <option value="Systematic Breakout Trading">Breakouts, Volume Spread &amp; Moving Averages</option>
                </select>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="reg-password" className="text-xs font-semibold text-slate-300">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="reg-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Create a secure password (min. 8 chars)"
                    required
                    autoComplete="new-password"
                    className="w-full rounded-lg border border-white/15 bg-[#0b1220] px-3 py-2.5 pr-11 text-sm text-white outline-none focus:border-[#FF7900] focus:ring-1 focus:ring-[#FF7900]/30 transition-colors placeholder:text-slate-600"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
                {/* Password strength */}
                {password.length > 0 && (
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="flex gap-1 flex-1">
                      {strengthBarColors[pwStrength].map((cls, i) => (
                        <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${cls}`} />
                      ))}
                    </div>
                    <span className={`text-[10px] font-semibold ${strengthColor}`}>
                      {strengthLabel}
                    </span>
                  </div>
                )}
              </div>

              {/* Confirm password */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="reg-confirm" className="text-xs font-semibold text-slate-300">
                  Confirm password
                </label>
                <div className="relative">
                  <input
                    id="reg-confirm"
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your password"
                    required
                    autoComplete="new-password"
                    className="w-full rounded-lg border border-white/15 bg-[#0b1220] px-3 py-2.5 pr-11 text-sm text-white outline-none focus:border-[#FF7900] focus:ring-1 focus:ring-[#FF7900]/30 transition-colors placeholder:text-slate-600"
                  />
                  <button
                    type="button"
                    aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
                    onClick={() => setShowConfirm(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {showConfirm ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
                {confirmPassword.length > 0 && password !== confirmPassword && (
                  <p className="text-[10px] text-red-400 mt-0.5">Passwords do not match.</p>
                )}
              </div>

              {/* Terms */}
              <label htmlFor="reg-terms" className="flex items-start gap-2 pt-1 text-xs leading-5 text-slate-400 cursor-pointer select-none">
                <input
                  id="reg-terms"
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={e => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 accent-[#FF7900] w-3.5 h-3.5 shrink-0"
                />
                I agree to the Smart Market terms and privacy policy.
              </label>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="mt-1 rounded-lg bg-[#FF7900] py-3 text-sm font-bold text-black transition-all hover:bg-[#ff9b42] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_0_16px_rgba(255,121,0,0.3)]"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Creating account…</span>
                  </>
                ) : (
                  <>
                    <span>Create account</span>
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 border-t border-white/10 pt-5 text-center text-sm text-slate-400">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => onNavigate('login')}
                className="font-semibold text-[#FF7900] hover:underline"
              >
                Log in
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="px-6 py-5 text-center text-xs text-slate-600 shrink-0">
        © 2026 Smart Market · Demo authentication — not for production use · Privacy · Terms
      </footer>
    </div>
  );
};
