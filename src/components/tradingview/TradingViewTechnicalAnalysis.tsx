import React, { useEffect, useRef } from 'react';

interface TradingViewTechnicalAnalysisProps {
  symbol?: string;
  height?: string | number;
  interval?: '1m' | '5m' | '15m' | '30m' | '1h' | '2h' | '4h' | '1D' | '1W' | '1M';
}

export const TradingViewTechnicalAnalysis: React.FC<TradingViewTechnicalAnalysisProps> = ({
  symbol = 'BSE:RELIANCE',
  height = 420,
  interval = '1D',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.innerHTML = '';

    const widgetWrapper = document.createElement('div');
    widgetWrapper.className = 'tradingview-widget-container';
    widgetWrapper.style.width = '100%';
    widgetWrapper.style.height = typeof height === 'number' ? `${height}px` : height;

    const widgetInner = document.createElement('div');
    widgetInner.className = 'tradingview-widget-container__widget';
    widgetInner.style.width = '100%';
    widgetInner.style.height = '100%';
    widgetWrapper.appendChild(widgetInner);

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      interval: interval,
      width: '100%',
      isTransparent: false,
      height: '100%',
      symbol: symbol,
      showIntervalTabs: true,
      displayMode: 'single',
      locale: 'in',
      colorTheme: 'dark',
    });

    widgetWrapper.appendChild(script);
    containerRef.current.appendChild(widgetWrapper);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [symbol, interval, height]);

  return (
    <div
      ref={containerRef}
      style={{ minHeight: typeof height === 'number' ? `${height}px` : height, width: '100%' }}
      className="rounded-xl overflow-hidden border border-outline-variant/30 bg-[#0c101a] w-full"
    />
  );
};
