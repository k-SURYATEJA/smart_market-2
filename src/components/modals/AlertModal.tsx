import React, { useState } from 'react';
import { StockData, PriceAlert } from '../../types/market';

interface AlertModalProps {
  stock: StockData;
  isOpen: boolean;
  onClose: () => void;
  onSetAlert: (alert: PriceAlert) => void;
}

export const AlertModal: React.FC<AlertModalProps> = ({
  stock,
  isOpen,
  onClose,
  onSetAlert,
}) => {
  const [targetPrice, setTargetPrice] = useState(stock.price * 1.02);
  const [condition, setCondition] = useState<'ABOVE' | 'BELOW'>('ABOVE');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSetAlert({
      id: `alt-${Date.now()}`,
      symbol: stock.symbol,
      targetPrice,
      condition,
      createdAt: new Date().toLocaleTimeString(),
      triggered: false,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="w-full max-w-sm bg-surface-container rounded-xl border border-outline-variant/40 shadow-2xl overflow-hidden">
        <div className="p-space-md border-b border-outline-variant/30 flex items-center justify-between bg-surface-container-low">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">
              notifications_active
            </span>
            <span className="font-headline-md font-bold text-on-surface">
              Set Price Alert ({stock.symbol})
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-outline hover:text-on-surface cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-space-md flex flex-col gap-space-md font-mono-xs text-mono-xs">
          <div>
            <span className="text-outline">Current Market Price:</span>
            <div className="font-mono-lg font-bold text-on-surface mt-0.5">
              ₹{stock.price.toFixed(2)}
            </div>
          </div>

          <div>
            <label className="text-outline uppercase block mb-1">Trigger Condition</label>
            <div className="grid grid-cols-2 gap-1 bg-surface-container-lowest p-1 rounded border border-outline-variant/30">
              <button
                type="button"
                onClick={() => setCondition('ABOVE')}
                className={`py-1.5 rounded cursor-pointer ${
                  condition === 'ABOVE' ? 'bg-primary text-on-primary-fixed font-bold' : 'text-outline'
                }`}
              >
                Crosses Above (≥)
              </button>
              <button
                type="button"
                onClick={() => setCondition('BELOW')}
                className={`py-1.5 rounded cursor-pointer ${
                  condition === 'BELOW' ? 'bg-primary text-on-primary-fixed font-bold' : 'text-outline'
                }`}
              >
                Crosses Below (≤)
              </button>
            </div>
          </div>

          <div>
            <label className="text-outline uppercase block mb-1">Target Price (₹)</label>
            <input
              type="number"
              step="0.5"
              value={targetPrice}
              onChange={e => setTargetPrice(Number(e.target.value))}
              className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded p-2 text-on-surface font-bold text-base"
              required
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 bg-surface-container-highest text-outline rounded-lg font-label-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 bg-secondary text-surface-container-lowest rounded-lg font-label-md font-bold hover:bg-secondary-fixed transition-colors cursor-pointer"
            >
              Arm Alert
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
