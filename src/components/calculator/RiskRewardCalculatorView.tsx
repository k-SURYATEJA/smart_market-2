import React, { useMemo, useState } from 'react';

interface RiskRewardCalculatorViewProps {
  onPlanTrade?: (symbol: string, qty: number, price: number) => void;
}

const currencies = ['USD', 'EUR', 'GBP', 'INR', 'AUD', 'CAD', 'JPY'];

export const RiskRewardCalculatorView: React.FC<RiskRewardCalculatorViewProps> = () => {
  const [currency, setCurrency] = useState('USD');
  const [accountBalance, setAccountBalance] = useState(10000);
  const [riskPercent, setRiskPercent] = useState(1);
  const [stopLossPips, setStopLossPips] = useState(50);
  const [pipValue, setPipValue] = useState(10);
  const [direction, setDirection] = useState<'LONG' | 'SHORT'>('LONG');

  const results = useMemo(() => {
    const riskAmount = Math.max(0, accountBalance * (riskPercent / 100));
    const positionUnits = pipValue > 0 && stopLossPips > 0
      ? Math.floor(riskAmount / (stopLossPips * pipValue) * 100) / 100
      : 0;
    const standardLots = positionUnits;
    const miniLots = standardLots * 10;
    const microLots = standardLots * 100;

    return { riskAmount, standardLots, miniLots, microLots };
  }, [accountBalance, pipValue, riskPercent, stopLossPips]);

  const money = (value: number) => `${currency} ${value.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;

  return (
    <div className="flex w-full flex-col gap-space-md">
      <div>
        <p className="font-mono-xs font-bold uppercase tracking-[0.18em] text-primary">Risk &amp; target tools</p>
        <h2 className="mt-1 font-headline-lg text-headline-lg font-bold text-on-surface">Position Size Calculator</h2>
        <p className="mt-1 max-w-2xl font-body-sm text-body-sm text-outline">
          Set your risk first, then let the calculator determine a position size that protects your account.
        </p>
      </div>

      <div className="grid grid-cols-1 items-start gap-space-md xl:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)]">
        <section className="flex flex-col gap-space-md rounded-xl border border-outline-variant/25 bg-surface-container p-space-md shadow-md">
          <div className="flex flex-col gap-3 border-b border-outline-variant/20 pb-space-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-headline-md text-headline-md font-bold text-on-surface">Trade setup</h3>
              <p className="mt-0.5 font-body-sm text-outline">Enter the values from your trading plan.</p>
            </div>
            <div className="flex shrink-0 items-center gap-1 rounded-lg border border-outline-variant/30 bg-surface-container-lowest p-1">
              {(['LONG', 'SHORT'] as const).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setDirection(item)}
                  className={`rounded px-3 py-1.5 font-mono-xs font-bold transition-colors ${direction === item ? 'bg-primary text-on-primary' : 'text-outline hover:text-on-surface'}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-space-sm sm:grid-cols-[1fr_1.5fr]">
            <label className="flex flex-col gap-1.5 font-mono-xs font-bold uppercase tracking-wide text-outline">
              Account currency
              <select value={currency} onChange={(event) => setCurrency(event.target.value)} className="rounded-lg border border-outline-variant/40 bg-surface-container-lowest px-3 py-2.5 font-body-sm font-normal normal-case tracking-normal text-on-surface outline-none focus:border-primary">
                {currencies.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <label className="flex flex-col gap-1.5 font-mono-xs font-bold uppercase tracking-wide text-outline">
              Account balance
              <input aria-label="Account balance" type="number" min="0" step="100" value={accountBalance} onChange={(event) => setAccountBalance(Number(event.target.value))} className="rounded-lg border border-outline-variant/40 bg-surface-container-lowest px-3 py-2.5 font-body-sm font-normal tracking-normal text-on-surface outline-none focus:border-primary" />
            </label>
          </div>

          <div className="rounded-lg border border-primary/20 bg-primary/5 p-space-sm">
            <div className="mb-2 flex items-center justify-between font-mono-xs font-bold uppercase tracking-wide text-outline">
              <span>Risk per trade</span>
              <span className="text-primary">{riskPercent}% · {money(results.riskAmount)}</span>
            </div>
            <input aria-label="Risk per trade" type="range" min="0.25" max="5" step="0.25" value={riskPercent} onChange={(event) => setRiskPercent(Number(event.target.value))} className="w-full accent-primary" />
            <div className="mt-1 flex justify-between font-mono-xs text-outline"><span>0.25%</span><span>5%</span></div>
          </div>

          <div className="grid grid-cols-1 gap-space-sm sm:grid-cols-2">
            <label className="flex flex-col gap-1.5 font-mono-xs font-bold uppercase tracking-wide text-outline">
              Stop loss distance (pips)
              <input aria-label="Stop loss distance in pips" type="number" min="0" step="1" value={stopLossPips} onChange={(event) => setStopLossPips(Number(event.target.value))} className="rounded-lg border border-outline-variant/40 bg-surface-container-lowest px-3 py-2.5 font-body-sm font-normal tracking-normal text-on-surface outline-none focus:border-primary" />
            </label>
            <label className="flex flex-col gap-1.5 font-mono-xs font-bold uppercase tracking-wide text-outline">
              Pip value per standard lot
              <input aria-label="Pip value per standard lot" type="number" min="0" step="0.1" value={pipValue} onChange={(event) => setPipValue(Number(event.target.value))} className="rounded-lg border border-outline-variant/40 bg-surface-container-lowest px-3 py-2.5 font-body-sm font-normal tracking-normal text-on-surface outline-none focus:border-primary" />
            </label>
          </div>

          <div className="flex items-start gap-2 rounded-lg border border-outline-variant/20 bg-surface-container-lowest p-space-sm text-outline">
            <span className="material-symbols-outlined text-[18px] text-primary">info</span>
            <p className="font-body-sm">Position size is calculated from your account balance, risk percentage, stop loss, and pip value.</p>
          </div>
        </section>

        <section className="flex flex-col gap-space-md rounded-xl border border-primary/30 bg-surface-container p-space-md shadow-md">
          <div className="flex items-start justify-between border-b border-outline-variant/20 pb-space-sm">
            <div>
              <p className="font-mono-xs font-bold uppercase tracking-[0.16em] text-primary">Recommended size</p>
              <h3 className="mt-1 font-headline-md text-headline-md font-bold text-on-surface">Your position</h3>
            </div>
            <span className="rounded-full bg-primary/10 px-2.5 py-1 font-mono-xs font-bold text-primary">{direction}</span>
          </div>

          <div className="rounded-xl border border-primary/25 bg-surface-container-lowest p-space-md text-center">
            <p className="font-mono-xs font-bold uppercase tracking-[0.16em] text-outline">Standard lots</p>
            <p className="mt-2 font-mono-xl text-mono-xl font-bold text-primary">{results.standardLots.toFixed(2)}</p>
            <p className="mt-1 font-body-sm text-outline">Maximum risk: <span className="font-bold text-on-surface">{money(results.riskAmount)}</span></p>
          </div>

          <div className="grid grid-cols-2 gap-space-sm">
            <div className="rounded-lg border border-outline-variant/20 bg-surface-container-low p-space-sm"><p className="font-mono-xs uppercase text-outline">Mini lots</p><p className="mt-1 font-mono-lg font-bold text-on-surface">{results.miniLots.toFixed(2)}</p></div>
            <div className="rounded-lg border border-outline-variant/20 bg-surface-container-low p-space-sm"><p className="font-mono-xs uppercase text-outline">Micro lots</p><p className="mt-1 font-mono-lg font-bold text-on-surface">{results.microLots.toFixed(2)}</p></div>
          </div>

          <div className="flex flex-col gap-2 rounded-lg bg-surface-container-low p-space-sm font-mono-xs text-outline">
            <div className="flex items-center justify-between"><span>Account balance</span><strong className="text-on-surface">{money(accountBalance)}</strong></div>
            <div className="flex items-center justify-between"><span>Risk per trade</span><strong className="text-primary">{riskPercent}%</strong></div>
            <div className="flex items-center justify-between"><span>Stop loss</span><strong className="text-on-surface">{stopLossPips} pips</strong></div>
          </div>

          <p className="font-body-sm leading-relaxed text-outline">This is an educational estimate. Confirm contract specifications and pip value with your broker before placing a trade.</p>
        </section>
      </div>
    </div>
  );
};
