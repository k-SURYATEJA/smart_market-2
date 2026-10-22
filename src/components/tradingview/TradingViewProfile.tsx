import React, { useEffect, useRef } from 'react';

interface TradingViewProfileProps {
  symbol?: string;
  height?: string | number;
}

export const TradingViewProfile: React.FC<TradingViewProfileProps> = ({
  symbol = 'BSE:RELIANCE',
  height = 450,
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
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-symbol-profile.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      width: '100%',
      height: '100%',
      colorTheme: 'dark',
      isTransparent: false,
      symbol: symbol,
      locale: 'in',
    });

    widgetWrapper.appendChild(script);
    containerRef.current.appendChild(widgetWrapper);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [symbol, height]);

  return (
    <div
      ref={containerRef}
      style={{ minHeight: typeof height === 'number' ? `${height}px` : height, width: '100%' }}
      className="rounded-xl overflow-hidden border border-outline-variant/30 bg-[#0c101a] w-full"
    />
  );
};
