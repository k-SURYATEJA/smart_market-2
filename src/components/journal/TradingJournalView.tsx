import React, { useState, useEffect } from 'react';
import { getActiveSession } from '../../services/authService';
import { fetchNotes, saveNote, deleteNote, ResearchNote } from '../../services/journalService';

export const TradingJournalView: React.FC = () => {
  const [notes, setNotes] = useState<ResearchNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [symbol, setSymbol] = useState('RELIANCE');
  const [category, setCategory] = useState<ResearchNote['category']>('Technical Pattern');
  const [setupType, setSetupType] = useState('Bullish Breakout');
  const [keyLevel, setKeyLevel] = useState('₹2,950');
  const [targetOutlook, setTargetOutlook] = useState('₹3,200');
  const [timeframe, setTimeframe] = useState<ResearchNote['timeframe']>('Swing');
  const [thesis, setThesis] = useState('');

  // ── Load notes from Oracle backend on mount ──────────────────────
  useEffect(() => {
    const user = getActiveSession();
    if (!user) { setLoading(false); return; }

    fetchNotes(user.id)
      .then(data => setNotes(data))
      .catch(err => console.error('Failed to load notes:', err))
      .finally(() => setLoading(false));
  }, []);

  // ── Save new note to Oracle ───────────────────────────────────────
  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = getActiveSession();
    if (!user) return;

    setSaving(true);
    const saved = await saveNote(user.id, {
      symbol: symbol.toUpperCase(),
      category,
      setupType,
      keyLevel,
      targetOutlook,
      timeframe,
      thesis: thesis.trim() || 'Technical thesis note logged.',
    });
    setSaving(false);

    if (saved) {
      setNotes(prev => [saved, ...prev]);
      setShowAddForm(false);
      setThesis('');
    }
  };

  // ── Delete note from Oracle ───────────────────────────────────────
  const handleDelete = async (id: string) => {
    const user = getActiveSession();
    if (!user) return;

    // Optimistic UI update first
    setNotes(prev => prev.filter(n => n.id !== id));
    await deleteNote(id, user.id);
  };

  return (
    <div className="flex flex-col w-full gap-space-md">
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
        <div>
          <h2 className="font-headline-lg font-bold text-on-surface">
            Technical &amp; Fundamental Research Journal
          </h2>
          <p className="font-body-sm text-outline mt-0.5">
            Document chart patterns, support/resistance zones, financial catalysts, and analyst theses.
            {' '}<span className="text-primary font-semibold">Saved to Oracle DB.</span>
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-primary text-black rounded-lg font-label-md font-bold flex items-center gap-1.5 hover:bg-primary-fixed transition-colors cursor-pointer shrink-0 shadow-[0_0_8px_rgba(0,208,108,0.3)]"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">
            {showAddForm ? 'close' : 'add'}
          </span>
          <span>{showAddForm ? 'Cancel Thesis' : 'Log Analysis Thesis'}</span>
        </button>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex items-center gap-2 text-outline font-mono-xs py-4">
          <span className="material-symbols-outlined text-[18px] animate-spin">sync</span>
          Loading your research notes from Oracle…
        </div>
      )}

      {/* Research Categories Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-space-md">
        <div className="bg-surface-container rounded-xl p-space-md border border-outline-variant/30">
          <span className="font-label-sm text-outline uppercase">Active Research Notes</span>
          <div className="font-mono-xl font-bold text-primary mt-1">{notes.length}</div>
          <span className="font-mono-xs text-outline">Logged Theses</span>
        </div>

        <div className="bg-surface-container rounded-xl p-space-md border border-outline-variant/30">
          <span className="font-label-sm text-outline uppercase">Technical Patterns</span>
          <div className="font-mono-xl font-bold text-secondary mt-1">
            {notes.filter(n => n.category === 'Technical Pattern').length}
          </div>
          <span className="font-mono-xs text-secondary font-medium">Chart Setups</span>
        </div>

        <div className="bg-surface-container rounded-xl p-space-md border border-outline-variant/30">
          <span className="font-label-sm text-outline uppercase">Fundamental Catalysts</span>
          <div className="font-mono-xl font-bold text-on-surface mt-1">
            {notes.filter(n => n.category === 'Fundamental Catalyst').length}
          </div>
          <span className="font-mono-xs text-outline">Earnings &amp; Macro</span>
        </div>

        <div className="bg-surface-container rounded-xl p-space-md border border-outline-variant/30">
          <span className="font-label-sm text-outline uppercase">Swing &amp; Multi-Month</span>
          <div className="font-mono-xl font-bold text-primary mt-1">
            {notes.filter(n => n.timeframe !== 'Intraday').length}
          </div>
          <span className="font-mono-xs text-outline">Medium-term Horizions</span>
        </div>
      </div>

      {/* Add Thesis Form */}
      {showAddForm && (
        <form
          onSubmit={handleAddNote}
          className="bg-surface-container rounded-xl p-space-md border border-primary/40 shadow-lg flex flex-col gap-space-md"
        >
          <h3 className="font-headline-md font-bold text-on-surface">
            Record New Technical or Fundamental Thesis
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm font-mono-xs text-mono-xs">
            <div>
              <label className="text-outline uppercase block mb-1">Ticker Symbol</label>
              <input
                type="text"
                value={symbol}
                onChange={e => setSymbol(e.target.value.toUpperCase())}
                className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded p-2 text-on-surface uppercase font-bold"
                required
              />
            </div>

            <div>
              <label className="text-outline uppercase block mb-1">Analysis Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as typeof category)}
                className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded p-2 text-on-surface"
              >
                <option value="Technical Pattern">Technical Pattern</option>
                <option value="Fundamental Catalyst">Fundamental Catalyst</option>
                <option value="Macro Policy">Macro Policy</option>
                <option value="Earnings Breakdown">Earnings Breakdown</option>
              </select>
            </div>

            <div>
              <label className="text-outline uppercase block mb-1">Timeframe Horizon</label>
              <select
                value={timeframe}
                onChange={e => setTimeframe(e.target.value as typeof timeframe)}
                className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded p-2 text-on-surface"
              >
                <option value="Intraday">Intraday</option>
                <option value="Swing">Swing (1-4 Weeks)</option>
                <option value="Multi-Month">Multi-Month (Quarterly)</option>
              </select>
            </div>

            <div>
              <label className="text-outline uppercase block mb-1">Setup / Pattern Name</label>
              <input
                type="text"
                value={setupType}
                onChange={e => setSetupType(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded p-2 text-on-surface font-bold"
                required
              />
            </div>

            <div>
              <label className="text-outline uppercase block mb-1">Key Level / Support</label>
              <input
                type="text"
                value={keyLevel}
                onChange={e => setKeyLevel(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded p-2 text-on-surface font-bold"
                required
              />
            </div>

            <div>
              <label className="text-outline uppercase block mb-1">Target / Resistance</label>
              <input
                type="text"
                value={targetOutlook}
                onChange={e => setTargetOutlook(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded p-2 text-on-surface font-bold"
                required
              />
            </div>
          </div>

          <div className="font-mono-xs text-mono-xs">
            <label className="text-outline uppercase block mb-1">Analytic Thesis &amp; Rationale</label>
            <textarea
              rows={3}
              value={thesis}
              onChange={e => setThesis(e.target.value)}
              placeholder="Describe candlestick triggers, indicator divergences, volume confirmation, or earnings driver..."
              className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded p-2 text-on-surface resize-none"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 bg-surface-container-highest text-outline rounded-lg font-label-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-primary text-black rounded-lg font-label-md font-bold hover:bg-primary-fixed transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving…' : 'Save Analysis Thesis'}
            </button>
          </div>
        </form>
      )}

      {/* Research Journal Cards Feed */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
        {notes.map(note => (
          <div
            key={note.id}
            className="bg-surface-container rounded-xl p-space-md border border-outline-variant/30 flex flex-col justify-between gap-space-sm"
          >
            <div>
              <div className="flex items-center justify-between font-mono-xs text-mono-xs mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-on-surface text-base">{note.symbol}</span>
                  <span className="px-2 py-0.5 rounded bg-primary/15 text-primary font-bold text-[10px]">
                    {note.category}
                  </span>
                </div>
                <span className="text-outline">{note.date}</span>
              </div>

              <h4 className="font-headline-md font-bold text-on-surface">{note.setupType}</h4>
              <p className="font-body-sm text-on-surface-variant mt-2 leading-relaxed">
                {note.thesis}
              </p>
            </div>

            <div className="pt-3 border-t border-outline-variant/20 flex items-center justify-between font-mono-xs text-mono-xs">
              <div className="flex items-center gap-3">
                <span className="text-outline">
                  Level: <strong className="text-secondary">{note.keyLevel}</strong>
                </span>
                <span className="text-outline">
                  Target: <strong className="text-primary">{note.targetOutlook}</strong>
                </span>
                <span className="text-outline">Horizon: {note.timeframe}</span>
              </div>
              <button
                onClick={() => handleDelete(note.id)}
                className="text-outline hover:text-tertiary cursor-pointer"
                title="Delete note"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
