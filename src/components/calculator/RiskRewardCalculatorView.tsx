import React, { useMemo, useState } from 'react';

export function formatINR(val: number): string {
  if (isNaN(val) || !isFinite(val)) return '0';
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(Math.round(val));
}

export function formatCompactINR(val: number): string {
  if (isNaN(val) || !isFinite(val)) return '₹0';
  if (val >= 10000000) {
    return `₹${(val / 10000000).toFixed(2)} Cr`;
  }
  if (val >= 100000) {
    return `₹${(val / 100000).toFixed(2)} Lakh`;
  }
  if (val >= 1000) {
    return `₹${(val / 1000).toFixed(1)}k`;
  }
  return `₹${Math.round(val)}`;
}

export const RiskRewardCalculatorView: React.FC = () => {
  const [mode, setMode] = useState<'sip' | 'lumpsum'>('sip');

  // SIP inputs
  const [monthlyInvestment, setMonthlyInvestment] = useState<number>(25000);

  // Lumpsum inputs
  const [totalInvestment, setTotalInvestment] = useState<number>(100000);

  // Common inputs
  const [expectedReturnRate, setExpectedReturnRate] = useState<number>(12);
  const [timePeriod, setTimePeriod] = useState<number>(10);

  // UI state
  const [showSchedule, setShowSchedule] = useState<boolean>(false);

  // Calculations
  const results = useMemo(() => {
    const rate = Math.max(0.1, expectedReturnRate);
    const years = Math.max(1, timePeriod);

    if (mode === 'sip') {
      const p = Math.max(100, monthlyInvestment);
      const i = rate / 12 / 100;
      const n = years * 12;
      const investedAmount = p * n;
      // Universal Indian mutual fund SIP formula: M = P * [((1 + i)^n - 1) / i] * (1 + i)
      const totalValue = p * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
      const estReturns = Math.max(0, totalValue - investedAmount);

      return {
        investedAmount,
        estReturns,
        totalValue,
        multiplier: (totalValue / investedAmount).toFixed(1),
        investedPct: Math.round((investedAmount / totalValue) * 100),
        returnsPct: Math.round((estReturns / totalValue) * 100),
      };
    } else {
      // Lumpsum: A = P * (1 + r/100)^t
      const p = Math.max(500, totalInvestment);
      const investedAmount = p;
      const totalValue = p * Math.pow(1 + rate / 100, years);
      const estReturns = Math.max(0, totalValue - investedAmount);

      return {
        investedAmount,
        estReturns,
        totalValue,
        multiplier: (totalValue / investedAmount).toFixed(1),
        investedPct: Math.round((investedAmount / totalValue) * 100),
        returnsPct: Math.round((estReturns / totalValue) * 100),
      };
    }
  }, [mode, monthlyInvestment, totalInvestment, expectedReturnRate, timePeriod]);

  // Year-by-year compounding schedule
  const yearlySchedule = useMemo(() => {
    const rows = [];
    const rate = Math.max(0.1, expectedReturnRate);
    const i = rate / 12 / 100;

    for (let yr = 1; yr <= timePeriod; yr++) {
      if (mode === 'sip') {
        const n = yr * 12;
        const invested = monthlyInvestment * n;
        const total = monthlyInvestment * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
        const returns = Math.max(0, total - invested);
        rows.push({
          year: yr,
          invested,
          returns,
          total,
          multiple: (total / invested).toFixed(2),
        });
      } else {
        const invested = totalInvestment;
        const total = totalInvestment * Math.pow(1 + rate / 100, yr);
        const returns = Math.max(0, total - invested);
        rows.push({
          year: yr,
          invested,
          returns,
          total,
          multiple: (total / invested).toFixed(2),
        });
      }
    }
    return rows;
  }, [mode, monthlyInvestment, totalInvestment, expectedReturnRate, timePeriod]);

  // Donut SVG circumference calculation
  const radius = 75;
  const circumference = 2 * Math.PI * radius;
  const investedDash = (results.investedPct / 100) * circumference;
  const returnsDash = circumference - investedDash;

  return (
    <div className="flex w-full flex-col gap-6 max-w-6xl mx-auto pb-12">
      {/* Top Banner & Mode Toggle */}
      <div className="bg-[#131b2e] border border-white/15 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF7900] to-[#FF9B42] flex items-center justify-center text-black font-black shadow-[0_0_15px_rgba(255,121,0,0.35)]">
              <span className="material-symbols-outlined text-[24px]">calculate</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  SIP Calculator
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-[#FF7900]/15 text-[#FF7900] border border-[#FF7900]/30 text-[10px] font-bold uppercase tracking-wider font-mono">
                  Groww Standard
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                Calculate your estimated wealth and returns through Systematic Investment Plan (SIP) or Lumpsum compounding.
              </p>
            </div>
          </div>
        </div>

        {/* SIP vs Lumpsum Mode Switcher (Groww Style) */}
        <div className="flex items-center bg-[#0b1020] border border-white/15 rounded-xl p-1.5 self-start md:self-auto shrink-0 shadow-inner">
          <button
            type="button"
            onClick={() => setMode('sip')}
            className={`px-6 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              mode === 'sip'
                ? 'bg-[#FF7900] text-black shadow-[0_0_12px_rgba(255,121,0,0.4)]'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            SIP
          </button>
          <button
            type="button"
            onClick={() => setMode('lumpsum')}
            className={`px-6 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              mode === 'lumpsum'
                ? 'bg-[#FF7900] text-black shadow-[0_0_12px_rgba(255,121,0,0.4)]'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Lumpsum
          </button>
        </div>
      </div>

      {/* Main Calculator Grid: Inputs on Left, Visuals & Results on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Sliders & Numeric Inputs (7 cols) */}
        <div className="lg:col-span-7 bg-[#131b2e] border border-white/15 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col gap-6">
          
          {/* Input 1: Monthly Investment (SIP) or Total Investment (Lumpsum) */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs sm:text-sm font-semibold text-slate-300">
                {mode === 'sip' ? 'Monthly investment' : 'Total investment'}
              </label>
              <div className="flex items-center bg-[#0b1020] border border-white/20 rounded-xl px-3 py-1.5 text-white font-mono font-bold text-base focus-within:border-[#FF7900] transition-colors shadow-inner">
                <span className="text-[#FF7900] mr-1 text-sm font-sans font-bold">₹</span>
                <input
                  type="number"
                  min={mode === 'sip' ? 500 : 1000}
                  max={mode === 'sip' ? 1000000 : 10000000}
                  step={mode === 'sip' ? 500 : 5000}
                  value={mode === 'sip' ? monthlyInvestment : totalInvestment}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (mode === 'sip') setMonthlyInvestment(val);
                    else setTotalInvestment(val);
                  }}
                  className="bg-transparent text-white font-mono font-bold text-base outline-none w-28 text-right"
                />
              </div>
            </div>

            {/* Slider */}
            <input
              type="range"
              min={mode === 'sip' ? 500 : 1000}
              max={mode === 'sip' ? 200000 : 5000000}
              step={mode === 'sip' ? 500 : 5000}
              value={mode === 'sip' ? monthlyInvestment : totalInvestment}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (mode === 'sip') setMonthlyInvestment(val);
                else setTotalInvestment(val);
              }}
              className="w-full h-2 bg-white/15 rounded-lg appearance-none cursor-pointer accent-[#FF7900]"
            />

            {/* Preset quick buttons */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {mode === 'sip' ? (
                <>
                  {[5000, 10000, 25000, 50000, 100000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setMonthlyInvestment(amt)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                        monthlyInvestment === amt
                          ? 'bg-[#FF7900]/20 text-[#FF7900] border border-[#FF7900]/40'
                          : 'bg-[#0b1020] text-slate-300 hover:text-white border border-white/10'
                      }`}
                    >
                      ₹{formatINR(amt)}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setMonthlyInvestment((prev) => prev + 5000)}
                    className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-white/10 hover:bg-white/20 text-slate-200 cursor-pointer"
                  >
                    +₹5,000
                  </button>
                </>
              ) : (
                <>
                  {[25000, 50000, 100000, 500000, 1000000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setTotalInvestment(amt)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                        totalInvestment === amt
                          ? 'bg-[#FF7900]/20 text-[#FF7900] border border-[#FF7900]/40'
                          : 'bg-[#0b1020] text-slate-300 hover:text-white border border-white/10'
                      }`}
                    >
                      ₹{formatINR(amt)}
                    </button>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* Input 2: Expected return rate (p.a) */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs sm:text-sm font-semibold text-slate-300 block">
                  Expected return rate (p.a)
                </label>
                <span className="text-[11px] text-slate-400">Historical equity returns: ~12-15%</span>
              </div>
              <div className="flex items-center bg-[#0b1020] border border-white/20 rounded-xl px-3 py-1.5 text-white font-mono font-bold text-base focus-within:border-[#FF7900] transition-colors shadow-inner">
                <input
                  type="number"
                  min={1}
                  max={30}
                  step={0.5}
                  value={expectedReturnRate}
                  onChange={(e) => setExpectedReturnRate(Number(e.target.value))}
                  className="bg-transparent text-white font-mono font-bold text-base outline-none w-16 text-right"
                />
                <span className="text-[#FF7900] ml-1 text-sm font-sans font-bold">%</span>
              </div>
            </div>

            {/* Slider */}
            <input
              type="range"
              min={1}
              max={30}
              step={0.5}
              value={expectedReturnRate}
              onChange={(e) => setExpectedReturnRate(Number(e.target.value))}
              className="w-full h-2 bg-white/15 rounded-lg appearance-none cursor-pointer accent-[#FF7900]"
            />

            {/* Return Benchmark Presets */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {[
                { label: '8% (Debt/FD)', rate: 8 },
                { label: '12% (Nifty 50)', rate: 12 },
                { label: '15% (Flexi Cap)', rate: 15 },
                { label: '18% (Mid/Small Cap)', rate: 18 },
              ].map((bench) => (
                <button
                  key={bench.rate}
                  type="button"
                  onClick={() => setExpectedReturnRate(bench.rate)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    expectedReturnRate === bench.rate
                      ? 'bg-[#FF7900]/20 text-[#FF7900] border border-[#FF7900]/40 font-bold'
                      : 'bg-[#0b1020] text-slate-300 hover:text-white border border-white/10'
                  }`}
                >
                  {bench.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input 3: Time period */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs sm:text-sm font-semibold text-slate-300 block">
                  Time period
                </label>
                <span className="text-[11px] text-slate-400">Longer tenure unlocks exponential compounding</span>
              </div>
              <div className="flex items-center bg-[#0b1020] border border-white/20 rounded-xl px-3 py-1.5 text-white font-mono font-bold text-base focus-within:border-[#FF7900] transition-colors shadow-inner">
                <input
                  type="number"
                  min={1}
                  max={40}
                  step={1}
                  value={timePeriod}
                  onChange={(e) => setTimePeriod(Number(e.target.value))}
                  className="bg-transparent text-white font-mono font-bold text-base outline-none w-14 text-right"
                />
                <span className="text-[#FF7900] ml-1 text-sm font-sans font-bold">Yr</span>
              </div>
            </div>

            {/* Slider */}
            <input
              type="range"
              min={1}
              max={40}
              step={1}
              value={timePeriod}
              onChange={(e) => setTimePeriod(Number(e.target.value))}
              className="w-full h-2 bg-white/15 rounded-lg appearance-none cursor-pointer accent-[#FF7900]"
            />

            {/* Tenure presets */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {[3, 5, 10, 15, 20, 25, 30].map((yr) => (
                <button
                  key={yr}
                  type="button"
                  onClick={() => setTimePeriod(yr)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    timePeriod === yr
                      ? 'bg-[#FF7900]/20 text-[#FF7900] border border-[#FF7900]/40'
                      : 'bg-[#0b1020] text-slate-300 hover:text-white border border-white/10'
                  }`}
                >
                  {yr}Y
                </button>
              ))}
            </div>
          </div>

          {/* Quick Insights Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-[#FF7900]/10 via-[#FF7900]/5 to-transparent border border-[#FF7900]/30 flex items-start gap-3 mt-1">
            <span className="material-symbols-outlined text-[#FF7900] text-[22px] mt-0.5 shrink-0">insights</span>
            <div className="text-xs text-slate-200 leading-relaxed">
              <strong className="text-white block font-bold mb-0.5">
                Compounding Multiplier: {results.multiplier}x Initial Principal
              </strong>
              In {timePeriod} years, your estimated wealth gains exceed your invested amount by{' '}
              <span className="text-[#FF7900] font-bold">
                {results.returnsPct >= 50 ? `${results.returnsPct}% returns share` : `₹${formatINR(results.estReturns)}`}
              </span>
              .
            </div>
          </div>
        </div>

        {/* Right Column: Groww Summary Card & Donut Chart (5 cols) */}
        <div className="lg:col-span-5 bg-[#131b2e] border border-white/15 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col justify-between gap-6">
          
          {/* Top Donut Visualization & Legends */}
          <div className="flex flex-col items-center">
            {/* Chart Legends */}
            <div className="flex items-center justify-between w-full pb-3 border-b border-white/10 text-xs font-semibold">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#475569] inline-block shadow-sm" />
                <span className="text-slate-300">Invested amount ({results.investedPct}%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#FF7900] inline-block shadow-sm" />
                <span className="text-[#FF7900] font-bold">Est. returns ({results.returnsPct}%)</span>
              </div>
            </div>

            {/* SVG Donut Chart with animated center */}
            <div className="relative my-4 flex items-center justify-center">
              <svg width="200" height="200" viewBox="0 0 200 200" className="transform -rotate-90">
                {/* Background Track */}
                <circle
                  cx="100"
                  cy="100"
                  r={radius}
                  stroke="#1e293b"
                  strokeWidth="24"
                  fill="transparent"
                />
                {/* Invested Slice */}
                <circle
                  cx="100"
                  cy="100"
                  r={radius}
                  stroke="#475569"
                  strokeWidth="24"
                  fill="transparent"
                  strokeDasharray={`${investedDash} ${circumference}`}
                  strokeDashoffset="0"
                />
                {/* Estimated Returns Slice */}
                <circle
                  cx="100"
                  cy="100"
                  r={radius}
                  stroke="#FF7900"
                  strokeWidth="24"
                  fill="transparent"
                  strokeDasharray={`${returnsDash} ${circumference}`}
                  strokeDashoffset={-investedDash}
                />
              </svg>

              {/* Center Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Total Corpus
                </span>
                <span className="text-lg font-black text-white font-mono mt-0.5">
                  {formatCompactINR(results.totalValue)}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FF7900]/15 text-[#FF7900] mt-1">
                  {results.multiplier}x Wealth
                </span>
              </div>
            </div>
          </div>

          {/* Value Output Metrics */}
          <div className="bg-[#0b1020] border border-white/10 rounded-xl p-4 flex flex-col gap-3 font-mono">
            <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs">
              <span className="text-slate-400 font-sans">Invested amount</span>
              <span className="text-white font-bold text-sm">₹{formatINR(results.investedAmount)}</span>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs">
              <span className="text-slate-400 font-sans">Est. returns</span>
              <span className="text-[#FF7900] font-bold text-sm">+₹{formatINR(results.estReturns)}</span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-slate-300 font-sans font-bold text-sm">Total value</span>
              <span className="text-xl sm:text-2xl font-black text-white">₹{formatINR(results.totalValue)}</span>
            </div>
          </div>

          {/* Action CTA & Schedule Toggle */}
          <div className="flex flex-col gap-2.5">

            <button
              type="button"
              onClick={() => setShowSchedule(!showSchedule)}
              className="w-full py-3 px-4 rounded-xl bg-white/5 hover:bg-[#FF7900]/10 hover:border-[#FF7900]/30 text-slate-200 hover:text-white text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer border border-white/10 shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px]">calendar_month</span>
              <span>{showSchedule ? 'Hide Compounding Schedule' : 'View Year-by-Year Schedule'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Year-by-Year Compounding Schedule Breakdown (Expandable) */}
      {showSchedule && (
        <div className="bg-[#131b2e] border border-white/15 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/15">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-[#FF7900] text-[20px]">table_chart</span>
                <span>Yearly Compounding Breakdown Schedule</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Progressive accumulation schedule at {expectedReturnRate}% annualized return.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-[#FF7900] bg-[#FF7900]/10 px-3 py-1 rounded-lg border border-[#FF7900]/30">
              {timePeriod} Years Tenure
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-white/15 text-slate-300 font-bold uppercase text-[11px] pb-2">
                  <th className="py-2.5 px-3">End of Year</th>
                  <th className="py-2.5 px-3 text-right">Invested Principal</th>
                  <th className="py-2.5 px-3 text-right">Wealth Gain (Est Returns)</th>
                  <th className="py-2.5 px-3 text-right">Total Portfolio Value</th>
                  <th className="py-2.5 px-3 text-center">Multiplier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {yearlySchedule.map((row) => (
                  <tr key={row.year} className="hover:bg-white/5 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-white font-sans">
                      Year {row.year} ({new Date().getFullYear() + row.year})
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-300">₹{formatINR(row.invested)}</td>
                    <td className="py-2.5 px-3 text-right text-[#FF7900] font-semibold">+₹{formatINR(row.returns)}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-white">₹{formatINR(row.total)}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-slate-200">
                        {row.multiple}x
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Groww Educational Guide & FAQs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-[#131b2e] border border-white/15 rounded-2xl p-5 shadow-xl flex flex-col gap-2">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <span className="material-symbols-outlined text-[#FF7900] text-[20px]">help_center</span>
            <h4>What is a SIP?</h4>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed mt-1">
            A Systematic Investment Plan (SIP) allows you to invest a fixed sum at regular intervals (monthly/quarterly) in equity or debt mutual funds without needing to time the market.
          </p>
        </div>

        <div className="bg-[#131b2e] border border-white/15 rounded-2xl p-5 shadow-xl flex flex-col gap-2">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <span className="material-symbols-outlined text-[#FF7900] text-[20px]">functions</span>
            <h4>Mathematical Formula</h4>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-mono mt-1">
            M = P × [((1 + i)^n - 1) / i] × (1 + i)
          </p>
          <span className="text-[11px] text-slate-400">
            Where <strong>i</strong> = periodic monthly interest rate, <strong>n</strong> = total monthly installments.
          </span>
        </div>

        <div className="bg-[#131b2e] border border-white/15 rounded-2xl p-5 shadow-xl flex flex-col gap-2">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <span className="material-symbols-outlined text-[#FF7900] text-[20px]">currency_rupee</span>
            <h4>Rupee Cost Averaging</h4>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed mt-1">
            During market dips, your fixed installment buys more mutual fund units; during bull rallies, your portfolio value accelerates, automatically smoothing volatility.
          </p>
        </div>
      </div>

      {/* Success / Confirmation Modal */}
    </div>
  );
};
