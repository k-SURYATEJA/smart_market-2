import React, { useEffect, useRef } from 'react';

interface TradingViewChartProps {
  symbol?: string;
  interval?: string;
  height?: string | number;
  autosize?: boolean;
  hideSideToolbar?: boolean;
  containerId?: string;
}

export const TradingViewChart: React.FC<TradingViewChartProps> = ({
  symbol = 'BSE:RELIANCE',
  interval = 'D',
  height = '580px',
  autosize = true,
  hideSideToolbar = false,
  containerId,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const uniqueId = useRef(containerId || `tv-chart-${Math.random().toString(36).substring(2, 9)}`);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous widget
    containerRef.current.innerHTML = '';

    const widgetWrapper = document.createElement('div');
    widgetWrapper.className = 'tradingview-widget-container';
    widgetWrapper.style.height = '100%';
    widgetWrapper.style.width = '100%';

    const widgetInner = document.createElement('div');
    widgetInner.id = uniqueId.current;
    widgetInner.className = 'tradingview-widget-container__widget';
    widgetInner.style.height = '100%';
    widgetInner.style.width = '100%';
    widgetWrapper.appendChild(widgetInner);

    // Script injection
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: autosize,
      symbol: symbol,
      interval: interval,
      timezone: 'Asia/Kolkata',
      theme: 'dark',
      style: '1',
      locale: 'en',
      enable_publishing: false,
      allow_symbol_change: true,
      calendar: false,
      support_host: 'https://www.tradingview.com',
      backgroundColor: 'rgba(0, 0, 0, 1)',
      gridColor: 'rgba(250, 204, 21, 0.06)',
      hide_side_toolbar: hideSideToolbar,
      hide_top_toolbar: false,
      hide_legend: false,
      save_image: true,
      studies: [
        'STD;SMA',
        'STD;RSI',
      ],
      toolbar_bg: '#000000',
    });

    widgetWrapper.appendChild(script);
    containerRef.current.appendChild(widgetWrapper);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [symbol, interval, autosize, hideSideToolbar]);

  return (
    <div
      ref={containerRef}
      style={{ height: height, width: '100%' }}
      className="bg-black relative rounded-lg overflow-hidden border border-outline-variant/30 w-full"
    />
  );
};
