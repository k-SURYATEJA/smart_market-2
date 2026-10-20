import React, { useState } from 'react';
import { ScreenId, UserProfile } from '../../types/market';

interface RegisterPageProps { onRegisterSuccess: (user: UserProfile) => void; onNavigate: (screen: ScreenId) => void; onContinueAsGuest: () => void; }

export const RegisterPage: React.FC<RegisterPageProps> = ({ onRegisterSuccess, onNavigate, onContinueAsGuest }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault(); setError(null);
    if (!name.trim()) return setError('Enter your full name.');
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError('Enter a valid email address.');
    if (password.length < 6) return setError('Password must contain at least 6 characters.');
    if (password !== confirmPassword) return setError('Passwords do not match.');
    if (!agreeTerms) return setError('Please accept the terms to continue.');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onRegisterSuccess({ id: `usr-${Date.now()}`, name: name.trim(), email: email.trim(), role: 'Pro Chartered Analyst', specialty: 'Equities & Swing Technicals', plan: 'Pro Terminal', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', joinedDate: 'Current Session' });
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#080d1a] text-white flex flex-col">
      <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 lg:px-12">
        <button type="button" onClick={() => onNavigate('home')} className="text-lg font-bold tracking-tight text-white">Smart <span className="text-primary">Market</span></button>
        <button type="button" onClick={() => onNavigate('login')} className="text-sm text-primary hover:text-primary-container transition-colors">Log in</button>
      </header>
      <main className="flex-1 grid lg:grid-cols-[1fr_500px] gap-10 items-center max-w-6xl w-full mx-auto px-6 lg:px-12 py-10">
        <section className="hidden lg:block max-w-xl"><p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary mb-6">Your market workspace</p><h1 className="text-5xl xl:text-6xl font-bold leading-[1.05] tracking-[-0.04em]">Build a better<br /><span className="text-primary">market routine.</span></h1><p className="mt-6 text-base leading-7 text-slate-400 max-w-md">Create your account and keep your charts, watchlists, and research in one focused place.</p></section>
        <section className="w-full max-w-[500px] mx-auto"><div className="rounded-2xl border border-white/10 bg-[#101827] p-7 sm:p-8 shadow-2xl"><div className="mb-6"><h2 className="text-2xl font-bold">Create your account</h2><p className="text-sm text-slate-400 mt-2">Set up your Smart Market workspace.</p></div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && <div role="alert" className="rounded-lg border border-tertiary/40 bg-tertiary/10 px-3 py-2 text-xs text-tertiary">{error}</div>}
            <div className="grid sm:grid-cols-2 gap-4"><label className="flex flex-col gap-2 text-xs font-semibold text-slate-300">Full name<input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Alex Morgan" required className="rounded-lg border border-white/15 bg-[#0b1220] px-3 py-3 text-sm text-white outline-none focus:border-primary" /></label><label className="flex flex-col gap-2 text-xs font-semibold text-slate-300">Email address<input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" required className="rounded-lg border border-white/15 bg-[#0b1220] px-3 py-3 text-sm text-white outline-none focus:border-primary" /></label></div>
            <label className="flex flex-col gap-2 text-xs font-semibold text-slate-300">Password<div className="relative"><input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Create a secure password" required className="w-full rounded-lg border border-white/15 bg-[#0b1220] px-3 py-3 pr-11 text-sm text-white outline-none focus:border-primary" /><button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-slate-500 hover:text-white"><span className="material-symbols-outlined text-[18px]">{showPassword ? 'visibility_off' : 'visibility'}</span></button></div></label>
            <label className="flex flex-col gap-2 text-xs font-semibold text-slate-300">Confirm password<input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Re-enter your password" required className="rounded-lg border border-white/15 bg-[#0b1220] px-3 py-3 text-sm text-white outline-none focus:border-primary" /></label>
            <label className="flex items-start gap-2 pt-1 text-xs leading-5 text-slate-400"><input type="checkbox" checked={agreeTerms} onChange={e => setAgreeTerms(e.target.checked)} className="mt-1 accent-primary" /> I agree to the Smart Market terms and privacy policy.</label>
            <button type="submit" disabled={isLoading} className="mt-1 rounded-lg bg-primary py-3 text-sm font-bold text-black transition hover:bg-primary-container disabled:opacity-60">{isLoading ? 'Creating account...' : 'Create account'}</button>
          </form>
          <div className="mt-6 border-t border-white/10 pt-5 text-center text-sm text-slate-400">Already have an account? <button type="button" onClick={() => onNavigate('login')} className="font-semibold text-primary hover:underline">Log in</button></div>
          <button type="button" onClick={onContinueAsGuest} className="mt-4 w-full text-xs text-slate-500 hover:text-white">Continue as guest</button>
        </div></section>
      </main>
      <footer className="px-6 py-5 text-center text-xs text-slate-500">© 2026 Smart Market · Privacy · Terms</footer>
    </div>
  );
};
