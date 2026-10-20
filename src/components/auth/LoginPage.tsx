import React, { useState } from 'react';
import { ScreenId, UserProfile } from '../../types/market';

interface LoginPageProps {
  onLoginSuccess: (user: UserProfile) => void;
  onNavigate: (screen: ScreenId) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const completeLogin = () => {
    const generatedName = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Market Analyst';
    onLoginSuccess({
      id: `usr-${Date.now()}`,
      name: generatedName,
      email: email.trim(),
      role: 'Pro Technical Analyst',
      specialty: 'Equities & Swing Technicals',
      plan: 'Pro Terminal',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      joinedDate: 'Current Session',
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    if (!email.trim() || !password.trim()) return setError('Enter your email and password.');
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError('Enter a valid email address.');
    setIsLoading(true);
    setTimeout(() => { setIsLoading(false); completeLogin(); }, 550);
  };

  return (
    <div className="min-h-screen bg-[#080d1a] text-white flex flex-col">
      <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 lg:px-12">
        <button type="button" onClick={() => onNavigate('home')} className="text-lg font-bold tracking-tight text-white">
          Smart <span className="text-primary">Market</span>
        </button>
        <button type="button" onClick={() => onNavigate('register')} className="text-sm text-primary hover:text-primary-container transition-colors">Create account</button>
      </header>
      <main className="flex-1 grid lg:grid-cols-[1fr_440px] gap-10 items-center max-w-6xl w-full mx-auto px-6 lg:px-12 py-12">
        <section className="hidden lg:block max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary mb-6">Market intelligence, simplified</p>
          <h1 className="text-5xl xl:text-6xl font-bold leading-[1.05] tracking-[-0.04em]">Make sharper<br /><span className="text-primary">market decisions.</span></h1>
          <p className="mt-6 text-base leading-7 text-slate-400 max-w-md">Your focused workspace for charts, signals, and the research that moves with you.</p>
        </section>
        <section className="w-full max-w-[440px] mx-auto">
          <div className="rounded-2xl border border-white/10 bg-[#101827] p-7 sm:p-9 shadow-2xl">
            <div className="mb-7"><h2 className="text-2xl font-bold">Welcome back</h2><p className="text-sm text-slate-400 mt-2">Log in to continue to your workspace.</p></div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {error && <div role="alert" className="rounded-lg border border-tertiary/40 bg-tertiary/10 px-3 py-2 text-xs text-tertiary">{error}</div>}
              <label className="flex flex-col gap-2 text-xs font-semibold text-slate-300">Email address<input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" required className="rounded-lg border border-white/15 bg-[#0b1220] px-3 py-3 text-sm text-white outline-none focus:border-primary" /></label>
              <label className="flex flex-col gap-2 text-xs font-semibold text-slate-300">Password<div className="relative"><input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" required className="w-full rounded-lg border border-white/15 bg-[#0b1220] px-3 py-3 pr-11 text-sm text-white outline-none focus:border-primary" /><button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-slate-500 hover:text-white"><span className="material-symbols-outlined text-[18px]">{showPassword ? 'visibility_off' : 'visibility'}</span></button></div></label>
              <div className="flex items-center justify-between text-xs"><label className="flex items-center gap-2 text-slate-400"><input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} className="accent-primary" /> Remember me</label><button type="button" onClick={() => onNavigate('forgot-password')} className="text-primary hover:underline">Forgot password?</button></div>
              <button type="submit" disabled={isLoading} className="rounded-lg bg-primary py-3 text-sm font-bold text-black transition hover:bg-primary-container disabled:opacity-60">{isLoading ? 'Logging in...' : 'Log in'}</button>
            </form>
            <div className="mt-7 border-t border-white/10 pt-6 text-center text-sm text-slate-400">Don&apos;t have an account? <button type="button" onClick={() => onNavigate('register')} className="font-semibold text-primary hover:underline">Sign up</button></div>
          </div>
        </section>
      </main>
      <footer className="px-6 py-5 text-center text-xs text-slate-500">© 2026 Smart Market · Privacy · Terms</footer>
    </div>
  );
};
