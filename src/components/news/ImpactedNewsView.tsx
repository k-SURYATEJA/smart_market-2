import React, { useState } from 'react';
import { INITIAL_NEWS } from '../../data/mockData';
import { NewsItem } from '../../types/market';

interface ImpactedNewsViewProps {
  onSelectStock: (symbol: string) => void;
}

export const ImpactedNewsView: React.FC<ImpactedNewsViewProps> = ({ onSelectStock }) => {
  const [filterSentiment, setFilterSentiment] = useState<'All' | 'Bullish' | 'Bearish' | 'Neutral'>('All');
  const [filterImpact, setFilterImpact] = useState<'All' | 'High' | 'Medium'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNews = INITIAL_NEWS.filter(n => {
    const matchesSentiment = filterSentiment === 'All' || n.sentiment === filterSentiment;
    const matchesImpact = filterImpact === 'All' || n.impact === filterImpact;
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.relatedTickers.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSentiment && matchesImpact && matchesSearch;
  });

  return (
    <div className="flex flex-col w-full gap-space-md">
      {/* Header & Filter Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-sm bg-surface-container rounded-xl p-space-md border border-outline-variant/30">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[24px]">newspaper</span>
            <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">
              Fundamental News &amp; Macro Intelligence
            </h2>
            <span className="px-2 py-0.5 rounded bg-primary text-black font-mono-xs font-bold text-[10px] tracking-wider uppercase">
              Event Catalysts
            </span>
          </div>
          <p className="font-body-sm text-body-sm text-outline mt-0.5">
            Quarterly earnings disclosures, monetary policy releases, dividend declarations, and corporate actions.
          </p>
        </div>

        {/* Search & Filter Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Search bar */}
          <div className="relative min-w-[200px]">
            <span className="material-symbols-outlined absolute left-2.5 top-2 text-outline text-[16px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search news or ticker..."
              className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-lg pl-8 pr-3 py-1.5 font-mono-xs text-mono-xs text-on-surface placeholder:text-outline focus:border-primary focus:outline-none"
            />
          </div>

          {/* Sentiment Filter */}
          <div className="flex items-center gap-1 bg-surface-container-lowest p-1 rounded-lg border border-outline-variant/30">
            {(['All', 'Bullish', 'Neutral'] as const).map(s => (
              <button
                key={s}
                onClick={() => setFilterSentiment(s)}
                className={`px-2.5 py-1 rounded font-mono-xs text-mono-xs cursor-pointer transition-colors ${
                  filterSentiment === s
                    ? 'bg-primary text-black font-bold'
                    : 'text-outline hover:text-on-surface'
                }`}
                type="button"
              >
                {s}
              </button>
            ))}
          </div>

          {/* Impact Filter */}
          <div className="flex items-center gap-1 bg-surface-container-lowest p-1 rounded-lg border border-outline-variant/30">
            {(['All', 'High', 'Medium'] as const).map(imp => (
              <button
                key={imp}
                onClick={() => setFilterImpact(imp)}
                className={`px-2.5 py-1 rounded font-mono-xs text-mono-xs cursor-pointer transition-colors ${
                  filterImpact === imp
                    ? 'bg-primary text-black font-bold'
                    : 'text-outline hover:text-on-surface'
                }`}
                type="button"
              >
                {imp} Impact
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* News Feed Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
        {filteredNews.map((item: NewsItem) => (
          <div
            key={item.id}
            className="bg-surface-container rounded-xl p-space-md border border-outline-variant/20 hover:border-primary/50 transition-all flex flex-col justify-between gap-space-sm"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2 font-mono-xs text-mono-xs">
                <span className="text-outline flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">schedule</span>
                  {item.source} · {item.timeAgo}
                </span>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`px-2 py-0.5 rounded font-bold ${
                      item.impact === 'High'
                        ? 'bg-amber-400/20 text-amber-400 border border-amber-400/30'
                        : 'bg-primary/20 text-primary border border-primary/30'
                    }`}
                  >
                    {item.impact} Impact
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded font-bold ${
                      item.sentiment === 'Bullish'
                        ? 'bg-secondary-container/20 text-secondary'
                        : item.sentiment === 'Bearish'
                        ? 'bg-tertiary-container/20 text-tertiary'
                        : 'bg-surface-container-highest text-outline'
                    }`}
                  >
                    {item.sentiment}
                  </span>
                </div>
              </div>

              <h3 className="font-headline-md text-headline-md font-bold text-on-surface leading-snug">
                {item.title}
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 leading-relaxed">
                {item.summary}
              </p>
            </div>

            {/* Impacted Ticker Tags */}
            <div className="pt-3 border-t border-outline-variant/20 flex items-center justify-between">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-mono-xs text-[10px] text-outline uppercase font-semibold">Analyzed Assets:</span>
                {item.relatedTickers.map(ticker => (
                  <button
                    key={ticker}
                    onClick={() => onSelectStock(ticker)}
                    className="px-2.5 py-1 rounded bg-surface-container-highest text-primary font-mono-xs text-mono-xs font-bold hover:bg-primary hover:text-black transition-colors cursor-pointer border border-primary/30 flex items-center gap-1"
                    type="button"
                    title={`Open Technical & Fundamental Deep Dive for ${ticker}`}
                  >
                    <span>{ticker}</span>
                    <span className="material-symbols-outlined text-[12px]">trending_up</span>
                  </button>
                ))}
              </div>
              <span className="material-symbols-outlined text-outline text-[18px]">verified</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
