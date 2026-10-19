import React, { useState, useEffect, useRef } from 'react';
import { ScreenId, UserProfile } from '../../types/market';

interface HomePageProps {
  onGetStarted: () => void;
  onNavigateToSection: (screen: ScreenId) => void;
  onSelectStock: (symbol: string) => void;
  user: UserProfile | null;
  onOpenAuth: (mode?: 'signin' | 'signup') => void;
  onOpenUserProfile: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onGetStarted,
  onNavigateToSection,
  onSelectStock,
  user,
  onOpenAuth,
  onOpenUserProfile,
}) => {
  // Navigation dropdown states
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Live currency ticker states
  const [eurUsd, setEurUsd] = useState({ val: 1.0864, chg: 0.0026, pct: 0.24 });
  const [gbpUsd, setGbpUsd] = useState({ val: 1.2985, chg: 0.0023, pct: 0.18 });
  const [usdJpy, setUsdJpy] = useState({ val: 154.20, chg: 0.48, pct: 0.31 });
  const [audUsd, setAudUsd] = useState({ val: 0.6682, chg: 0.0019, pct: 0.28 });
  const [goldUsd, setGoldUsd] = useState({ val: 2718.50, chg: 14.80, pct: 0.55 });

  // Floating 3D visual interactivity
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);

  // Micro-tick animation for live chart
  useEffect(() => {
    const timer = setInterval(() => {
      setEurUsd(prev => ({
        ...prev,
        val: +(prev.val + (Math.random() - 0.48) * 0.0003).toFixed(4),
      }));
      setGbpUsd(prev => ({
        ...prev,
        val: +(prev.val + (Math.random() - 0.48) * 0.0003).toFixed(4),
      }));
      setUsdJpy(prev => ({
        ...prev,
        val: +(prev.val + (Math.random() - 0.48) * 0.04).toFixed(2),
      }));
    }, 2400);
    return () => clearInterval(timer);
  }, []);

  // Keyboard shortcut '/' to trigger search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((document.activeElement?.tagName || ''))) {
        e.preventDefault();
        setSearchModalOpen(true);
      }
      if (e.key === 'Escape') {
        setSearchModalOpen(false);
        setToolsDropdownOpen(false);
        setMoreDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const forexPairs = [
    { symbol: 'EUR/USD', name: 'Euro / US Dollar', price: eurUsd.val.toFixed(4), change: `+${eurUsd.pct.toFixed(2)}%`, isPositive: true },
    { symbol: 'GBP/USD', name: 'British Pound / USD', price: gbpUsd.val.toFixed(4), change: `+${gbpUsd.pct.toFixed(2)}%`, isPositive: true },
    { symbol: 'USD/JPY', name: 'US Dollar / Japanese Yen', price: usdJpy.val.toFixed(2), change: `+${usdJpy.pct.toFixed(2)}%`, isPositive: true },
    { symbol: 'AUD/USD', name: 'Australian Dollar / USD', price: audUsd.val.toFixed(4), change: `+${audUsd.pct.toFixed(2)}%`, isPositive: true },
    { symbol: 'XAU/USD', name: 'Spot Gold / US Dollar', price: `$${goldUsd.val.toFixed(2)}`, change: `+${goldUsd.pct.toFixed(2)}%`, isPositive: true },
    { symbol: 'USD/CAD', name: 'US Dollar / Canadian Dollar', price: '1.3812', change: '-0.12%', isPositive: false },
    { symbol: 'USD/CHF', name: 'US Dollar / Swiss Franc', price: '0.8654', change: '-0.08%', isPositive: false },
  ];

  const filteredPairs = forexPairs.filter(p =>
    p.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#17181D] text-[#F7F7F8] flex flex-col selection:bg-[#FF7900] selection:text-white relative overflow-x-hidden">
      
      {/* =========================================================================
          2. NAVIGATION BAR (Reference proportions: 76-84px height, #141519, #303139)
          ========================================================================= */}
      <header className="sticky top-0 z-50 bg-[#141519]/95 backdrop-blur-md border-b border-[#303139] transition-all">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 h-[80px] flex items-center justify-between gap-4">
          
          {/* Left: Original Geometric Trading Logo & Brand Name */}
          <div 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            {/* Geometric PipPulse Logo (Angled interlocking triangles with orange gradient) */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF9B42] via-[#FF7900] to-[#E06300] p-0.5 shadow-[0_0_20px_rgba(255,121,0,0.4)] group-hover:scale-105 transition-transform flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-white stroke-current">
                <path d="M4 17L12 5L20 17H14L12 13L10 17H4Z" fill="currentColor" fillOpacity="0.9" />
                <path d="M12 13L15 18H9L12 13Z" fill="#141519" />
              </svg>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-white leading-none">
                  Pip<span className="text-[#FF7900]">Pulse</span>
                </span>
                <span className="px-1.5 py-0.5 rounded bg-[#FF7900]/20 text-[#FF9B42] border border-[#FF7900]/40 text-[9px] font-bold uppercase tracking-widest">
                  PRO
                </span>
              </div>
              <span className="text-[10px] font-bold text-[#A4A7B0] tracking-wider uppercase mt-0.5">
                FOREX TRADING
              </span>
            </div>
          </div>

          {/* Center: Navigation Links & Search */}
          <nav className="hidden lg:flex items-center gap-7 text-[13px] font-semibold text-[#A4A7B0]">
            <button
              type="button"
              onClick={() => onNavigateToSection('forex')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Markets
            </button>

            {/* Trading Tools Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setToolsDropdownOpen(!toolsDropdownOpen);
                  setMoreDropdownOpen(false);
                }}
                className={`flex items-center gap-1 hover:text-white transition-colors cursor-pointer ${
                  toolsDropdownOpen ? 'text-[#FF7900]' : ''
                }`}
              >
                <span>Trading Tools</span>
                <span className="material-symbols-outlined text-[16px]">expand_more</span>
              </button>

              {toolsDropdownOpen && (
                <div className="absolute top-full left-0 mt-3 w-56 rounded-2xl bg-[#141519] border border-[#303139] shadow-2xl p-2 z-50">
                  <button
                    onClick={() => { onNavigateToSection('market-charts'); setToolsDropdownOpen(false); }}
                    className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-[#1C1D23] hover:text-white text-xs flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[#FF7900] text-[18px]">candlestick_chart</span>
                    <div>
                      <span className="block font-bold text-white">TradingView Charts</span>
                      <span className="text-[10px] text-[#A4A7B0]">Multi-timeframe technicals</span>
                    </div>
                  </button>
                  <button
                    onClick={() => { onNavigateToSection('stock-screener'); setToolsDropdownOpen(false); }}
                    className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-[#1C1D23] hover:text-white text-xs flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[#FF7900] text-[18px]">filter_alt</span>
                    <div>
                      <span className="block font-bold text-white">Currency Screener</span>
                      <span className="text-[10px] text-[#A4A7B0]">Momentum &amp; volatility scans</span>
                    </div>
                  </button>
                  <button
                    onClick={() => { onNavigateToSection('risk-reward-calculator'); setToolsDropdownOpen(false); }}
                    className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-[#1C1D23] hover:text-white text-xs flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[#FF7900] text-[18px]">calculate</span>
                    <div>
                      <span className="block font-bold text-white">Lot &amp; Risk Sizing</span>
                      <span className="text-[10px] text-[#A4A7B0]">Mathematical position engine</span>
                    </div>
                  </button>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => onNavigateToSection('trading-journal')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Strategies
            </button>

            <button
              type="button"
              onClick={() => onNavigateToSection('impacted-news')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Economic Calendar
            </button>

            {/* More Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setMoreDropdownOpen(!moreDropdownOpen);
                  setToolsDropdownOpen(false);
                }}
                className={`flex items-center gap-1 hover:text-white transition-colors cursor-pointer ${
                  moreDropdownOpen ? 'text-[#FF7900]' : ''
                }`}
              >
                <span>More</span>
                <span className="material-symbols-outlined text-[16px]">expand_more</span>
              </button>

              {moreDropdownOpen && (
                <div className="absolute top-full left-0 mt-3 w-48 rounded-2xl bg-[#141519] border border-[#303139] shadow-2xl p-2 z-50">
                  <button
                    onClick={() => { onNavigateToSection('settings'); setMoreDropdownOpen(false); }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#1C1D23] hover:text-white text-xs flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[#A4A7B0] text-[16px]">settings</span>
                    <span>Platform Settings</span>
                  </button>
                  <button
                    onClick={() => { onNavigateToSection('help-and-support'); setMoreDropdownOpen(false); }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#1C1D23] hover:text-white text-xs flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[#A4A7B0] text-[16px]">help</span>
                    <span>Help &amp; API Docs</span>
                  </button>
                </div>
              )}
            </div>

            {/* Reference Search Field Interaction (`Search /`) */}
            <div
              onClick={() => setSearchModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1C1D23] border border-[#303139] hover:border-[#FF7900]/60 transition-all cursor-pointer text-[#A4A7B0] hover:text-white"
            >
              <span className="material-symbols-outlined text-[16px]">search</span>
              <span className="text-xs">Search</span>
              <span className="px-1.5 py-0.2 rounded bg-[#303139]/70 text-[#F7F7F8] font-mono text-[10px] font-bold">
                /
              </span>
            </div>
          </nav>

          {/* Right: Log In, Sign Up & Action Icons */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onOpenUserProfile}
                  className="flex items-center gap-2 p-1 pl-2 pr-3 rounded-xl bg-[#1C1D23] border border-[#FF7900]/40 hover:border-[#FF7900] transition-all cursor-pointer text-left"
                >
                  <img
                    src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover ring-1 ring-[#FF7900]"
                  />
                  <div className="hidden sm:block">
                    <span className="block text-xs text-white font-semibold leading-none">
                      {user.name.split(' ')[0]}
                    </span>
                    <span className="block text-[9px] text-[#FF7900] font-bold uppercase tracking-wider">
                      PRO TRADER
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={onGetStarted}
                  className="py-2.5 px-4 rounded-xl bg-[#FF7900] hover:bg-[#FF8C1A] text-white text-xs font-bold flex items-center gap-1.5 shadow-[0_0_15px_rgba(255,121,0,0.35)] cursor-pointer transition-all"
                >
                  <span>Trading Terminal</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => onNavigateToSection('login')}
                  className="py-2 px-3 text-sm font-semibold text-[#F7F7F8] hover:text-[#FF7900] transition-colors cursor-pointer"
                >
                  Log In
                </button>

                {/* Prominent Orange Sign Up Button (matching reference) */}
                <button
                  type="button"
                  onClick={() => onNavigateToSection('register')}
                  className="py-2.5 px-6 rounded-lg bg-[#FF7900] hover:bg-[#FF8C1A] active:scale-[0.98] text-white text-sm font-bold shadow-[0_0_18px_rgba(255,121,0,0.35)] transition-all cursor-pointer"
                >
                  Sign Up
                </button>
              </>
            )}

            {/* Reference Utility Icons (Mobile app, Theme, Grid) */}
            <div className="hidden sm:flex items-center gap-1 text-[#A4A7B0] pl-1 border-l border-[#303139]/80">
              <button 
                type="button" 
                title="Mobile Platform"
                onClick={() => onNavigateToSection('forex')}
                className="p-1.5 hover:text-white hover:bg-[#1C1D23] rounded-lg transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">smartphone</span>
              </button>
              <button 
                type="button" 
                title="Terminal Theme"
                className="p-1.5 hover:text-white hover:bg-[#1C1D23] rounded-lg transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">dark_mode</span>
              </button>
              <button 
                type="button" 
                title="Platform Applications"
                onClick={onGetStarted}
                className="p-1.5 hover:text-white hover:bg-[#1C1D23] rounded-lg transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">grid_view</span>
              </button>
            </div>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#A4A7B0] hover:text-white rounded-lg hover:bg-[#1C1D23] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[24px]">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Nav Menu Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#141519] border-b border-[#303139] px-4 py-4 space-y-2">
            <button
              onClick={() => { onNavigateToSection('forex'); setMobileMenuOpen(false); }}
              className="w-full text-left py-2 px-3 rounded-lg text-sm font-semibold text-white hover:bg-[#1C1D23]"
            >
              Markets
            </button>
            <button
              onClick={() => { onNavigateToSection('market-charts'); setMobileMenuOpen(false); }}
              className="w-full text-left py-2 px-3 rounded-lg text-sm font-semibold text-white hover:bg-[#1C1D23]"
            >
              Trading Tools (Charts &amp; Screener)
            </button>
            <button
              onClick={() => { onNavigateToSection('trading-journal'); setMobileMenuOpen(false); }}
              className="w-full text-left py-2 px-3 rounded-lg text-sm font-semibold text-white hover:bg-[#1C1D23]"
            >
              Strategies &amp; Journal
            </button>
            <button
              onClick={() => { onNavigateToSection('impacted-news'); setMobileMenuOpen(false); }}
              className="w-full text-left py-2 px-3 rounded-lg text-sm font-semibold text-white hover:bg-[#1C1D23]"
            >
              Economic Calendar
            </button>
            <div className="pt-2 flex gap-2">
              <button
                onClick={() => { onNavigateToSection('login'); setMobileMenuOpen(false); }}
                className="flex-1 py-2.5 rounded-lg border border-[#303139] text-center text-sm font-bold text-white hover:bg-[#1C1D23]"
              >
                Log In
              </button>
              <button
                onClick={() => { onNavigateToSection('register'); setMobileMenuOpen(false); }}
                className="flex-1 py-2.5 rounded-lg bg-[#FF7900] text-center text-sm font-bold text-white shadow-lg"
              >
                Sign Up
              </button>
            </div>
          </div>
        )}
      </header>

      {/* =========================================================================
          3. HERO SECTION (Reference layout: 2 columns, 54% / 46%, max-w 1180px,
             orange pill badge, large headline, 54px CTA, 3D artwork + 3 orange cards)
          ========================================================================= */}
      <section 
        ref={heroRef}
        onMouseMove={handleMouseMove}
        className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden border-b border-[#303139]/60"
      >
        {/* Subtle Warm Orange Radial Glow in Background (matches reference) */}
        <div className="absolute top-1/3 right-1/4 w-[600px] h-[500px] bg-[#FF7900]/12 rounded-full blur-[140px] pointer-events-none" />
        
        {/* Subtle Fine Grid Texture */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none" 
          style={{ backgroundImage: 'radial-gradient(#FF7900 1px, transparent 1px)', backgroundSize: '24px 24px' }}
        />

        <div className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[540px]">
            
            {/* -------------------------------------------------------------
                LEFT COLUMN (~54% width): Main Marketing Content & CTA
                ------------------------------------------------------------- */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              {/* Outlined Pill Badge (matches "Made for INDIA" pill in reference) */}
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#FF7900] bg-[#141519]/80 shadow-[0_0_15px_rgba(255,121,0,0.15)]">
                <span className="w-2 h-2 rounded-full bg-[#FF7900] animate-ping" />
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  BUILT FOR SMARTER TRADING
                </span>
              </div>

              {/* Large, Bold Two-Line Headline (~44-48px on desktop, tight spacing) */}
              <h1 className="text-4xl sm:text-5xl lg:text-[50px] font-extrabold text-white tracking-tight leading-[1.12]">
                Trade the Markets.{' '}
                <span className="text-[#FF7900] block mt-1">
                  Master Your Strategy.
                </span>
              </h1>

              {/* Supporting Paragraph (~17-19px in muted gray #A4A7B0) */}
              <p className="text-base sm:text-[18px] text-[#A4A7B0] leading-relaxed max-w-[540px] font-normal">
                Explore the forex markets, analyze price action, track your performance, and build a more disciplined trading process — all in one powerful workspace.
              </p>

              {/* Call to Action Button Row (54px height, bold white text, hover lift) */}
              <div className="pt-3 flex flex-wrap items-center gap-4 sm:gap-6">
                <button
                  type="button"
                  onClick={onGetStarted}
                  className="h-[54px] px-8 rounded-xl bg-[#FF7900] hover:bg-[#FF8C1A] active:scale-[0.98] text-white font-extrabold text-base flex items-center gap-2.5 shadow-[0_8px_25px_rgba(255,121,0,0.38)] transition-all transform hover:-translate-y-0.5 cursor-pointer group"
                >
                  <span>Explore the Platform</span>
                  <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigateToSection('forex')}
                  className="text-sm sm:text-base font-bold text-[#F7F7F8] hover:text-[#FF7900] flex items-center gap-1.5 transition-colors cursor-pointer group py-2"
                >
                  <span>View Market Tools</span>
                  <span className="group-hover:translate-x-1 transition-transform text-[#FF7900]">→</span>
                </button>
              </div>

              {/* Micro Trust Metadata */}
              <div className="pt-2 flex items-center gap-6 text-xs text-[#A4A7B0] font-medium">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#24C78B] text-[16px]">check_circle</span>
                  Live TradingView Engine
                </span>
                <span className="text-[#303139]">·</span>
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#24C78B] text-[16px]">check_circle</span>
                  Real-time FX spreads
                </span>
                <span className="text-[#303139]">·</span>
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#24C78B] text-[16px]">check_circle</span>
                  Zero-fee analytics
                </span>
              </div>
            </div>

            {/* -------------------------------------------------------------
                RIGHT COLUMN (~46% width): 3D Financial Artwork & 3 Orange Cards
                ------------------------------------------------------------- */}
            <div className="lg:col-span-5 relative flex flex-col items-center">
              
              {/* 3D Fintech Sculpture Representation (Inspired by the '0 Fee' 3D artwork in the reference) */}
              <div 
                className="w-full relative min-h-[340px] sm:min-h-[380px] flex items-center justify-center transition-transform duration-300 ease-out"
                style={{
                  transform: `perspective(1000px) rotateY(${mousePos.x * 10}deg) rotateX(${-mousePos.y * 10}deg)`
                }}
              >
                {/* Background Stylized Glowing Chart Waves & Grid */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                  <svg viewBox="0 0 400 300" className="w-full h-full text-[#303139]">
                    <line x1="0" y1="75" x2="400" y2="75" stroke="currentColor" strokeDasharray="3 3" />
                    <line x1="0" y1="150" x2="400" y2="150" stroke="currentColor" strokeDasharray="3 3" />
                    <line x1="0" y1="225" x2="400" y2="225" stroke="currentColor" strokeDasharray="3 3" />
                    <path
                      d="M20 220 C 80 180, 140 240, 200 130 C 260 40, 320 160, 380 90"
                      fill="none"
                      stroke="#FF7900"
                      strokeWidth="3"
                      className="filter drop-shadow-[0_0_8px_rgba(255,121,0,0.8)]"
                    />
                  </svg>
                </div>

                {/* Central Metallic 3D Torus / Currency Ring Sculpture */}
                <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
                  
                  {/* Outer Glowing Orange Atmospheric Ring */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#FF7900]/40 via-transparent to-[#FF9B42]/50 blur-2xl animate-pulse" />

                  {/* 3D Giant Metallic Precision Torus */}
                  <div className="relative w-52 h-52 sm:w-60 sm:h-60 rounded-full border-[18px] border-[#2C2E38] shadow-[0_20px_50px_rgba(0,0,0,0.9),inset_0_4px_12px_rgba(255,255,255,0.25)] flex items-center justify-center bg-gradient-to-b from-[#1C1D23] to-[#111216] overflow-hidden">
                    
                    {/* Inner Glowing Core & Candle Bars */}
                    <div className="absolute inset-4 rounded-full border border-[#FF7900]/40 flex items-center justify-center bg-radial from-[#FF7900]/25 via-transparent to-transparent">
                      
                      {/* Animated Candlesticks inside the ring */}
                      <div className="flex items-center gap-3 opacity-90">
                        <div className="flex flex-col items-center">
                          <div className="w-0.5 h-3 bg-[#24C78B]" />
                          <div className="w-2.5 h-10 bg-[#24C78B] rounded-xs" />
                          <div className="w-0.5 h-4 bg-[#24C78B]" />
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="w-0.5 h-5 bg-[#FF4D5A]" />
                          <div className="w-2.5 h-8 bg-[#FF4D5A] rounded-xs" />
                          <div className="w-0.5 h-3 bg-[#FF4D5A]" />
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="w-0.5 h-6 bg-[#FF7900]" />
                          <div className="w-3.5 h-16 bg-[#FF7900] rounded-xs shadow-[0_0_15px_rgba(255,121,0,0.7)]" />
                          <div className="w-0.5 h-5 bg-[#FF7900]" />
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="w-0.5 h-3 bg-[#24C78B]" />
                          <div className="w-2.5 h-12 bg-[#24C78B] rounded-xs" />
                          <div className="w-0.5 h-4 bg-[#24C78B]" />
                        </div>
                      </div>
                    </div>

                    {/* Central 3D Pip Symbol */}
                    <div className="relative z-10 text-center">
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#FF9B42] block">
                        PIP SPREAD
                      </span>
                      <span className="text-3xl font-black text-white font-mono tracking-tight drop-shadow-md">
                        0.0
                      </span>
                      <span className="text-[9px] text-[#A4A7B0] font-semibold block uppercase">
                        ZERO MARKUP
                      </span>
                    </div>
                  </div>

                  {/* Floating Glassmorphism Currency Pair Badges (Matching floating coins in reference) */}
                  <div className="absolute -top-2 -left-4 px-3 py-1.5 rounded-xl bg-[#141519]/90 border border-[#303139] shadow-xl backdrop-blur-md flex items-center gap-2 animate-bounce duration-1000">
                    <span className="w-2 h-2 rounded-full bg-[#24C78B]" />
                    <span className="font-bold text-xs text-white">EUR/USD</span>
                    <span className="text-[11px] font-mono text-[#24C78B] font-bold">1.0864</span>
                  </div>

                  <div className="absolute top-4 -right-6 px-3 py-1.5 rounded-xl bg-[#141519]/90 border border-[#FF7900]/40 shadow-[0_0_15px_rgba(255,121,0,0.25)] backdrop-blur-md flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#FF7900]" />
                    <span className="font-bold text-xs text-white">GBP/USD</span>
                    <span className="text-[11px] font-mono text-[#FF9B42] font-bold">+0.18%</span>
                  </div>

                  <div className="absolute -bottom-3 right-6 px-3 py-1.5 rounded-xl bg-[#141519]/90 border border-[#303139] shadow-xl backdrop-blur-md flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#24C78B]" />
                    <span className="font-bold text-xs text-white">USD/JPY</span>
                    <span className="text-[11px] font-mono text-[#24C78B] font-bold">154.20</span>
                  </div>
                </div>
              </div>

              {/* =========================================================================
                  4. THREE COMPACT FEATURE HIGHLIGHTS (Directly matching the 3 orange promo
                     boxes under the 3D artwork in the reference screenshot)
                  ========================================================================= */}
              <div className="w-full mt-4 grid grid-cols-3 gap-2.5 sm:gap-3">
                
                {/* Feature 1: Market Analysis */}
                <div 
                  onClick={() => onNavigateToSection('forex')}
                  className="p-3 sm:p-3.5 rounded-xl bg-gradient-to-b from-[#251A10] to-[#1A1613] border border-[#FF7900]/40 hover:border-[#FF7900] transition-all cursor-pointer text-center group shadow-md"
                >
                  <div className="w-7 h-7 mx-auto rounded-lg bg-[#FF7900]/20 text-[#FF9B42] flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-[16px]">candlestick_chart</span>
                  </div>
                  <h4 className="text-[12px] sm:text-[13px] font-extrabold text-white tracking-tight uppercase leading-tight">
                    Market Analysis
                  </h4>
                  <p className="text-[10px] text-[#A4A7B0] font-medium mt-0.5 leading-snug">
                    Tools for price action.
                  </p>
                </div>

                {/* Feature 2: Trade Journal */}
                <div 
                  onClick={() => onNavigateToSection('trading-journal')}
                  className="p-3 sm:p-3.5 rounded-xl bg-gradient-to-b from-[#251A10] to-[#1A1613] border border-[#FF7900]/40 hover:border-[#FF7900] transition-all cursor-pointer text-center group shadow-md"
                >
                  <div className="w-7 h-7 mx-auto rounded-lg bg-[#FF7900]/20 text-[#FF9B42] flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-[16px]">menu_book</span>
                  </div>
                  <h4 className="text-[12px] sm:text-[13px] font-extrabold text-white tracking-tight uppercase leading-tight">
                    Trade Journal
                  </h4>
                  <p className="text-[10px] text-[#A4A7B0] font-medium mt-0.5 leading-snug">
                    Track your decisions.
                  </p>
                </div>

                {/* Feature 3: News & Events */}
                <div 
                  onClick={() => onNavigateToSection('impacted-news')}
                  className="p-3 sm:p-3.5 rounded-xl bg-gradient-to-b from-[#251A10] to-[#1A1613] border border-[#FF7900]/40 hover:border-[#FF7900] transition-all cursor-pointer text-center group shadow-md"
                >
                  <div className="w-7 h-7 mx-auto rounded-lg bg-[#FF7900]/20 text-[#FF9B42] flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                  </div>
                  <h4 className="text-[12px] sm:text-[13px] font-extrabold text-white tracking-tight uppercase leading-tight">
                    News &amp; Events
                  </h4>
                  <p className="text-[10px] text-[#A4A7B0] font-medium mt-0.5 leading-snug">
                    Monitor market catalysts.
                  </p>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          LIVE CURRENCY MARKETS STRIP & EXPLORER
          ========================================================================= */}
      <section className="py-12 bg-[#141519] border-b border-[#303139]">
        <div className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-[11px] text-[#FF7900] font-extrabold uppercase tracking-wider block mb-1">
                Forex Liquidity Hub
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Live Major &amp; Minor Currency Spreads
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigateToSection('forex')}
              className="text-xs font-bold text-[#FF7900] hover:text-[#FF9B42] flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>Launch Full Forex Terminal</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>

          {/* Cards Grid of Forex Pairs */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
            {forexPairs.slice(0, 5).map(pair => (
              <div
                key={pair.symbol}
                onClick={() => onNavigateToSection('forex')}
                className="p-4 rounded-xl bg-[#1C1D23] border border-[#303139] hover:border-[#FF7900]/60 transition-all cursor-pointer group hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-extrabold text-sm text-white group-hover:text-[#FF7900] transition-colors">
                    {pair.symbol}
                  </span>
                  <span className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded ${
                    pair.isPositive ? 'bg-[#24C78B]/15 text-[#24C78B]' : 'bg-[#FF4D5A]/15 text-[#FF4D5A]'
                  }`}>
                    {pair.change}
                  </span>
                </div>
                <div className="text-lg font-black text-white font-mono tracking-tight">
                  {pair.price}
                </div>
                <span className="text-[10px] text-[#A4A7B0] block mt-1">
                  {pair.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          PLATFORM ARCHITECTURE HIGHLIGHTS (TradingView, Risk Engine, Journal)
          ========================================================================= */}
      <section className="py-16 md:py-24 bg-[#17181D]">
        <div className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs text-[#FF7900] font-bold uppercase tracking-widest block mb-2">
              Professional Grade
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              An Integrated Workspace for Every Stage of Your Trade
            </h2>
            <p className="mt-3 text-sm text-[#A4A7B0] leading-relaxed">
              From pre-market technical scanning to execution discipline and post-trade performance review.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1 */}
            <div className="p-7 rounded-2xl bg-[#141519] border border-[#303139] hover:border-[#FF7900]/50 transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#FF7900]/15 border border-[#FF7900]/30 text-[#FF7900] flex items-center justify-center mb-5">
                <span className="material-symbols-outlined text-[24px]">candlestick_chart</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                1. Institutional TradingView Charts
              </h3>
              <p className="text-xs text-[#A4A7B0] leading-relaxed">
                Direct integration with 100+ native indicators, multi-timeframe candle grids (1x1, 2x1, 2x2), Fibonacci retracements, and clean dark UI with zero distracting ads.
              </p>
              <button
                type="button"
                onClick={() => onNavigateToSection('market-charts')}
                className="mt-4 text-xs font-bold text-[#FF7900] flex items-center gap-1 hover:underline cursor-pointer"
              >
                <span>Open TradingView Charts</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>

            {/* Card 2 */}
            <div className="p-7 rounded-2xl bg-[#141519] border border-[#303139] hover:border-[#FF7900]/50 transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#FF7900]/15 border border-[#FF7900]/30 text-[#FF7900] flex items-center justify-center mb-5">
                <span className="material-symbols-outlined text-[24px]">calculate</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                2. Position Sizing &amp; Risk Engine
              </h3>
              <p className="text-xs text-[#A4A7B0] leading-relaxed">
                Eliminate emotional guessing. Calculate exact lot sizing, pip risk in dollars, and predefined 1:2 and 1:3 profit target thresholds to guard against risk of ruin.
              </p>
              <button
                type="button"
                onClick={() => onNavigateToSection('risk-reward-calculator')}
                className="mt-4 text-xs font-bold text-[#FF7900] flex items-center gap-1 hover:underline cursor-pointer"
              >
                <span>Launch Calculator</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>

            {/* Card 3 */}
            <div className="p-7 rounded-2xl bg-[#141519] border border-[#303139] hover:border-[#FF7900]/50 transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#FF7900]/15 border border-[#FF7900]/30 text-[#FF7900] flex items-center justify-center mb-5">
                <span className="material-symbols-outlined text-[24px]">menu_book</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                3. Algorithmic Trade Journal
              </h3>
              <p className="text-xs text-[#A4A7B0] leading-relaxed">
                Track emotional states, rule adherence, and setup playbooks. Automatically generate your win rate, profit factor, and proprietary Edge Score (0–100).
              </p>
              <button
                type="button"
                onClick={() => onNavigateToSection('trading-journal')}
                className="mt-4 text-xs font-bold text-[#FF7900] flex items-center gap-1 hover:underline cursor-pointer"
              >
                <span>View Trade Journal</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          FINAL HIGH-IMPACT CONVERSION BANNER (Dark with Vibrant Orange CTA)
          ========================================================================= */}
      <section className="py-20 relative overflow-hidden bg-[#141519] border-t border-[#303139] text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#FF7900]/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-[800px] mx-auto px-4 relative z-10 space-y-5">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#FF7900] block">
            GET STARTED TODAY
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Ready to Master Your Forex Strategy?
          </h2>
          <p className="text-sm sm:text-base text-[#A4A7B0] max-w-xl mx-auto leading-relaxed">
            Join disciplined traders analyzing charts, managing risk, and executing setups with institutional clarity.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={onGetStarted}
              className="h-[52px] px-8 rounded-xl bg-[#FF7900] hover:bg-[#FF8C1A] text-white font-extrabold text-sm sm:text-base flex items-center gap-2 shadow-[0_8px_25px_rgba(255,121,0,0.4)] cursor-pointer transition-all transform hover:-translate-y-0.5"
            >
              <span>Explore the Platform</span>
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </button>

            {!user && (
              <button
                type="button"
                onClick={() => onNavigateToSection('register')}
                className="h-[52px] px-7 rounded-xl bg-[#1C1D23] border border-[#303139] hover:border-[#FF7900] text-white font-bold text-sm transition-all cursor-pointer"
              >
                Create Account
              </button>
            )}
          </div>
        </div>
      </section>

      {/* =========================================================================
          FOOTER (Matching PipPulse Dark Palette #141519, #303139)
          ========================================================================= */}
      <footer className="w-full bg-[#111216] border-t border-[#303139] py-10 px-4 sm:px-6 lg:px-8 text-xs text-[#A4A7B0]">
        <div className="max-w-[1180px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-[#FF7900] text-white flex items-center justify-center font-black text-xs">
              P
            </div>
            <span className="font-extrabold text-white text-sm">
              PipPulse <span className="text-[#FF7900]">Forex</span>
            </span>
            <span className="text-[#303139]">·</span>
            <span>Professional Currency Trading &amp; Analytics</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-5 font-semibold">
            <button onClick={() => onNavigateToSection('forex')} className="hover:text-white transition-colors cursor-pointer">
              Markets
            </button>
            <button onClick={() => onNavigateToSection('market-charts')} className="hover:text-white transition-colors cursor-pointer">
              TradingView Charts
            </button>
            <button onClick={() => onNavigateToSection('trading-journal')} className="hover:text-white transition-colors cursor-pointer">
              Trade Journal
            </button>
            <button onClick={() => onNavigateToSection('risk-reward-calculator')} className="hover:text-white transition-colors cursor-pointer">
              Risk Engine
            </button>
            <button onClick={() => onNavigateToSection('impacted-news')} className="hover:text-white transition-colors cursor-pointer">
              Economic Calendar
            </button>
            <button onClick={() => onNavigateToSection('login')} className="hover:text-[#FF7900] transition-colors cursor-pointer text-[#FF7900] font-bold">
              Log In
            </button>
          </div>
        </div>
      </footer>

      {/* =========================================================================
          KEYBOARD / INTERACTIVE SEARCH MODAL ('/' shortcut)
          ========================================================================= */}
      {searchModalOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-start justify-center pt-24 px-4 animate-in fade-in duration-150"
          onClick={() => setSearchModalOpen(false)}
        >
          <div 
            className="w-full max-w-lg bg-[#141519] border border-[#303139] rounded-2xl shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 border-b border-[#303139] flex items-center gap-3">
              <span className="material-symbols-outlined text-[#FF7900] text-[22px]">search</span>
              <input
                autoFocus
                type="text"
                placeholder="Search forex pairs, tools, strategies (e.g. EUR/USD, charts)..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-white placeholder-[#A4A7B0] outline-none text-sm font-medium"
              />
              <span className="text-[10px] text-[#A4A7B0] font-mono px-1.5 py-0.5 rounded border border-[#303139]">
                ESC
              </span>
            </div>

            <div className="p-2 max-h-72 overflow-y-auto">
              <span className="text-[10px] uppercase font-bold text-[#A4A7B0] px-3 py-1.5 block">
                Forex Currency Pairs
              </span>
              {filteredPairs.map(p => (
                <div
                  key={p.symbol}
                  onClick={() => {
                    onNavigateToSection('forex');
                    setSearchModalOpen(false);
                  }}
                  className="px-3 py-2.5 rounded-xl hover:bg-[#1C1D23] flex items-center justify-between cursor-pointer group transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-[#FF7900]" />
                    <div>
                      <span className="font-bold text-white text-xs group-hover:text-[#FF7900] transition-colors">
                        {p.symbol}
                      </span>
                      <span className="text-[10px] text-[#A4A7B0] block">
                        {p.name}
                      </span>
                    </div>
                  </div>
                  <div className="text-right font-mono text-xs">
                    <span className="text-white font-bold">{p.price}</span>
                    <span className={`block text-[10px] ${p.isPositive ? 'text-[#24C78B]' : 'text-[#FF4D5A]'}`}>
                      {p.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
