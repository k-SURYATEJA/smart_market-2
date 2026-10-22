import React, { useEffect, useRef } from 'react';

interface TradingViewSymbolInfoProps {
  symbol?: string;
}

export const TradingViewSymbolInfo: React.FC<TradingViewSymbolInfoProps> = ({
  symbol = 'BSE:RELIANCE',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.innerHTML = '';

    const widgetWrapper = document.createElement('div');
    widgetWrapper.className = 'tradingview-widget-container';
    widgetWrapper.style.width = '100%';

    const widgetInner = document.createElement('div');
    widgetInner.className = 'tradingview-widget-container__widget';
    widgetWrapper.appendChild(widgetInner);

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-symbol-info.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbol: symbol,
      width: '100%',
      locale: 'in',
      colorTheme: 'dark',
      isTransparent: false,
    });

    widgetWrapper.appendChild(script);
    containerRef.current.appendChild(widgetWrapper);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [symbol]);

  return (
    <div
      ref={containerRef}
      className="rounded-xl overflow-hidden border border-outline-variant/30 bg-[#0c101a] w-full"
    />
  );
};
