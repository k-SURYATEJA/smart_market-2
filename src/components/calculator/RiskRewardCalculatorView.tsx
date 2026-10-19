import React, { useState } from 'react';

interface RiskRewardCalculatorViewProps {
  onPlanTrade?: (symbol: string, qty: number, price: number) => void;
}

export const RiskRewardCalculatorView: React.FC<RiskRewardCalculatorViewProps> = () => {
  const [accountSize, setAccountSize] = useState(500000);
  const [riskPercent, setRiskPercent] = useState(1.5);
  const [tradeDirection, setTradeDirection] = useState<'LONG' | 'SHORT'>('LONG');
  const [entryPrice, setEntryPrice] = useState(2950);
  const [stopLossPrice, setStopLossPrice] = useState(2910);
  const [targetPrice, setTargetPrice] = useState(3060);

  // Calculations
  const riskAmount = (accountSize * riskPercent) / 100;
  const perShareRisk = Math.abs(entryPrice - stopLossPrice);
  const perShareReward = Math.abs(targetPrice - entryPrice);

  const positionSize = perShareRisk > 0 ? Math.floor(riskAmount / perShareRisk) : 0;
  const totalInvestment = positionSize * entryPrice;
  const potentialReward = positionSize * perShareReward;
  const rrRatio = perShareRisk > 0 ? (perShareReward / perShareRisk).toFixed(2) : '0';

  return (
    <div className="flex flex-col w-full gap-space-md">
      <div>
        <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">
          Institutional Risk-Reward &amp; Position Sizing Calculator
        </h2>
        <p className="font-body-sm text-body-sm text-outline mt-0.5">
          Calculate strict capital protection parameters, maximum tolerable drawdown, and position sizing.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md items-start">
        {/* Left Input Matrix (6 COLS) */}
        <div className="lg:col-span-6 flex flex-col bg-surface-container rounded-xl shadow-md border border-outline-variant/20 p-space-md gap-space-md">
          <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
            <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
              Trade Parameters
            </h3>
            <div className="flex items-center gap-1 bg-surface-container-lowest p-1 rounded border border-outline-variant/30">
              <button
                onClick={() => setTradeDirection('LONG')}
                className={`px-3 py-1 rounded font-mono-xs font-bold cursor-pointer ${
                  tradeDirection === 'LONG'
                    ? 'bg-secondary text-surface-container-lowest'
                    : 'text-outline hover:text-on-surface'
                }`}
                type="button"
              >
                LONG
              </button>
              <button
                onClick={() => setTradeDirection('SHORT')}
                className={`px-3 py-1 rounded font-mono-xs font-bold cursor-pointer ${
                  tradeDirection === 'SHORT'
                    ? 'bg-tertiary-container text-on-error'
                    : 'text-outline hover:text-on-surface'
                }`}
                type="button"
              >
                SHORT
              </button>
            </div>
          </div>

          <div className="space-y-3 font-mono-xs text-mono-xs">
            <div>
              <div className="flex justify-between text-outline mb-1">
                <span>Account Capital (₹)</span>
                <span className="text-on-surface font-bold">₹{accountSize.toLocaleString()}</span>
              </div>
              <input
                type="number"
                step="10000"
                value={accountSize}
                onChange={e => setAccountSize(Number(e.target.value))}
                className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded p-2 text-on-surface font-bold"
              />
            </div>

            <div>
              <div className="flex justify-between text-outline mb-1">
                <span>Risk per Trade (%)</span>
                <span className="text-secondary font-bold">{riskPercent}% (₹{riskAmount.toLocaleString()})</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="5.0"
                step="0.25"
                value={riskPercent}
                onChange={e => setRiskPercent(Number(e.target.value))}
                className="w-full accent-secondary cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-3 gap-space-sm pt-2">
              <div>
                <label className="text-outline uppercase block mb-1">Entry Price (₹)</label>
                <input
                  type="number"
                  step="0.5"
                  value={entryPrice}
                  onChange={e => setEntryPrice(Number(e.target.value))}
                  className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded p-2 text-on-surface font-bold"
                />
              </div>

              <div>
                <label className="text-tertiary uppercase block mb-1">Stop Loss (₹)</label>
                <input
                  type="number"
                  step="0.5"
                  value={stopLossPrice}
                  onChange={e => setStopLossPrice(Number(e.target.value))}
                  className="w-full bg-surface-container-lowest border border-tertiary-container/50 rounded p-2 text-tertiary font-bold"
                />
              </div>

              <div>
                <label className="text-secondary uppercase block mb-1">Target Price (₹)</label>
                <input
                  type="number"
                  step="0.5"
                  value={targetPrice}
                  onChange={e => setTargetPrice(Number(e.target.value))}
                  className="w-full bg-surface-container-lowest border border-secondary/50 rounded p-2 text-secondary font-bold"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Output & Visualization (6 COLS) */}
        <div className="lg:col-span-6 flex flex-col bg-surface-container rounded-xl shadow-md border border-outline-variant/20 p-space-md gap-space-md">
          <h3 className="font-headline-md text-headline-md font-bold text-on-surface pb-2 border-b border-outline-variant/20">
            Calculated Position &amp; Expectancy
          </h3>

          <div className="grid grid-cols-2 gap-space-sm font-mono-xs text-mono-xs">
            <div className="bg-surface-container-low p-space-sm rounded-lg border border-outline-variant/20">
              <span className="text-outline uppercase font-label-sm">Recommended Position</span>
              <div className="font-mono-xl text-mono-xl font-bold text-primary mt-1">
                {positionSize} Shares
              </div>
              <span className="text-outline text-[10px]">Capital: ₹{totalInvestment.toLocaleString()}</span>
            </div>

            <div className="bg-surface-container-low p-space-sm rounded-lg border border-outline-variant/20">
              <span className="text-outline uppercase font-label-sm">Risk : Reward Ratio</span>
              <div
                className={`font-mono-xl text-mono-xl font-bold mt-1 ${
                  Number(rrRatio) >= 2 ? 'text-secondary' : 'text-amber-400'
                }`}
              >
                1 : {rrRatio}
              </div>
              <span className="text-outline text-[10px]">
                {Number(rrRatio) >= 2 ? 'Optimal Institutional Setup' : 'Sub-optimal R:R'}
              </span>
            </div>

            <div className="bg-surface-container-low p-space-sm rounded-lg border border-outline-variant/20">
              <span className="text-outline uppercase font-label-sm">Max Loss (At Stop)</span>
              <div className="font-mono-lg text-mono-lg font-bold text-tertiary mt-1">
                -₹{riskAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </div>
              <span className="text-outline text-[10px]">₹{perShareRisk.toFixed(2)} / share</span>
            </div>

            <div className="bg-surface-container-low p-space-sm rounded-lg border border-outline-variant/20">
              <span className="text-outline uppercase font-label-sm">Max Profit (At Target)</span>
              <div className="font-mono-lg text-mono-lg font-bold text-secondary mt-1">
                +₹{potentialReward.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </div>
              <span className="text-outline text-[10px]">₹{perShareReward.toFixed(2)} / share</span>
            </div>
          </div>

          {/* Visual Risk vs Reward Bar */}
          <div className="bg-surface-container-lowest p-space-sm rounded-lg border border-outline-variant/30 flex flex-col gap-2">
            <span className="font-label-sm text-label-sm text-outline uppercase">Visual Risk vs Reward Profile</span>
            <div className="w-full h-4 rounded-full bg-surface-container-highest flex overflow-hidden">
              <div
                className="bg-tertiary-container h-full flex items-center justify-center font-mono-xs text-[10px] text-on-error font-bold"
                style={{ width: `${(1 / (1 + Number(rrRatio))) * 100}%` }}
              >
                Risk 1x
              </div>
              <div
                className="bg-secondary h-full flex items-center justify-center font-mono-xs text-[10px] text-surface-container-lowest font-bold"
                style={{ width: `${(Number(rrRatio) / (1 + Number(rrRatio))) * 100}%` }}
              >
                Reward {rrRatio}x
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
