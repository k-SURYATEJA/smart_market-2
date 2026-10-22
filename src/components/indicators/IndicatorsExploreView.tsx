import React, { useState, useMemo } from 'react';

export interface IndicatorItem {
  id: string;
  code: string;
  name: string;
  category: 'Momentum' | 'Trend Following' | 'Volatility' | 'Volume & Order Flow' | 'Price Action & Drawings';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  isIndianFavorite?: boolean;
  shortDesc: string;
  indianParams: string;
  tradingViewSearch: string;
  tradingViewCategory: string;
  overview: string;
  formula: string;
  calculationSteps: string[];
  bullishSignals: string[];
  bearishSignals: string[];
  indianMarketPlaybook: {
    recommendedTimeframes: string;
    bestInstrument: string;
    recommendedPairings: string;
    marketHoursTip: string;
  };
  pitfalls: string[];
  pineScriptSnippet: string;
  svgType: 'oscillator' | 'movingAverage' | 'bands' | 'stepLine' | 'volume' | 'trendline' | 'levels';
}

export const INDICATORS_DATA: IndicatorItem[] = [
  {
    id: 'rsi',
    code: 'RSI',
    name: 'Relative Strength Index',
    category: 'Momentum',
    difficulty: 'Beginner',
    isIndianFavorite: true,
    shortDesc: 'Measures momentum and speed of directional price movements on a 0-100 scale.',
    indianParams: 'Length: 14, Overbought: 70, Oversold: 30',
    tradingViewSearch: 'Relative Strength Index',
    tradingViewCategory: 'Momentum Oscillators',
    overview:
      'Developed by J. Welles Wilder Jr., the Relative Strength Index (RSI) is an essential momentum oscillator that evaluates whether an asset is overbought or oversold by comparing the magnitude of recent gains to recent losses over a specified period.',
    formula: 'RSI = 100 - [100 / (1 + RS)] where RS = Average Gain / Average Loss over N periods',
    calculationSteps: [
      'Calculate initial Average Gain and Average Loss over 14 periods.',
      'Smooth subsequent periods using Wilder\'s smoothing: Prior Avg Gain × 13 + Current Gain / 14.',
      'Divide Smoothed Avg Gain by Smoothed Avg Loss to get Relative Strength (RS).',
      'Normalize RS into a 0 to 100 bounded scale.'
    ],
    bullishSignals: [
      'RSI crosses above 30 from oversold territory (reversal buy trigger).',
      'Bullish Divergence: Stock price forms a Lower Low while RSI forms a Higher Low.',
      'Centerline Breakout: RSI crossing above 50 confirms emerging bullish trend.'
    ],
    bearishSignals: [
      'RSI crosses below 70 from overbought territory (exhaustion sell trigger).',
      'Bearish Divergence: Stock price forms a Higher High while RSI forms a Lower High.',
      'Centerline Breakdown: RSI dropping below 50 confirms bears in control.'
    ],
    indianMarketPlaybook: {
      recommendedTimeframes: '5-min / 15-min for Nifty & Bank Nifty Options; Daily for Swing Equity.',
      bestInstrument: 'Nifty 50, Bank Nifty, high-beta F&O stocks (Tata Motors, Reliance, SBIN).',
      recommendedPairings: 'Combine with 200 EMA trend filter and horizontal Support/Resistance.',
      marketHoursTip: 'In Indian markets, 60-40 bull market range rule often holds: RSI stays between 40-80 in bull rallies.'
    },
    pitfalls: [
      'In strong one-sided trending days on Nifty, RSI can remain above 70 or below 30 for hours.',
      'Do not short solely because RSI > 70 without price action confirmation.'
    ],
    pineScriptSnippet: 'ta.rsi(close, 14)',
    svgType: 'oscillator'
  },
  {
    id: 'ema',
    code: 'EMA',
    name: 'Exponential Moving Average',
    category: 'Trend Following',
    difficulty: 'Beginner',
    isIndianFavorite: true,
    shortDesc: 'Dynamic trend indicator weighting recent price action to reduce lagging.',
    indianParams: '9 EMA (Scalping), 21 EMA (Intraday), 50 & 200 EMA (Swing/Trend)',
    tradingViewSearch: 'Moving Average Exponential',
    tradingViewCategory: 'Trend Following',
    overview:
      'The Exponential Moving Average (EMA) applies a higher weighting factor to the most recent price data points compared to Simple Moving Averages. This makes it far more responsive to sudden price swings and trend changes on Indian intraday charts.',
    formula: 'EMA_t = [Close_t × (2 / (N + 1))] + [EMA_{t-1} × (1 - (2 / (N + 1)))]',
    calculationSteps: [
      'Determine the multiplier weighting factor: K = 2 / (N + 1). For 20 EMA, K = 2/21 = 0.0952.',
      'Multiply the latest closing price by K.',
      'Multiply previous period EMA by (1 - K).',
      'Sum both values together to produce the updated EMA value.'
    ],
    bullishSignals: [
      'Price closes and holds consistently above the rising 21 EMA.',
      'Bullish 9/21 EMA Cross: 9 EMA crosses above 21 EMA in trending market.',
      'Pullback Bounce: Price tests rising 20 EMA with bullish hammer or engulfing candle.'
    ],
    bearishSignals: [
      'Price breaks and closes below declining 21 EMA.',
      'Bearish 9/21 EMA Cross: 9 EMA crosses below 21 EMA signaling downward momentum.',
      'Death Cross: 50 EMA crosses below 200 EMA signaling macro trend decline.'
    ],
    indianMarketPlaybook: {
      recommendedTimeframes: '5-min & 15-min for Bank Nifty scalping; 1-Hour & Daily for positional trades.',
      bestInstrument: 'Index Options (Nifty 50, FinNifty, Bank Nifty) & Largecap Equities.',
      recommendedPairings: 'Pair 9/21 EMA with VWAP for morning breakout pullback entries.',
      marketHoursTip: 'Look for morning 09:20 - 10:30 IST EMA pullbacks; avoid low-volume 12:00 - 13:30 IST chop.'
    },
    pitfalls: [
      'Produces frequent false whipsaw crosses during rangebound or sideways sessions.',
      'Always check the slope of the EMA: a flat EMA means avoid trading crossovers.'
    ],
    pineScriptSnippet: 'ta.ema(close, 21)',
    svgType: 'movingAverage'
  },
  {
    id: 'sma',
    code: 'SMA',
    name: 'Simple Moving Average',
    category: 'Trend Following',
    difficulty: 'Beginner',
    isIndianFavorite: true,
    shortDesc: 'The arithmetic average of closing prices over a specified duration.',
    indianParams: '20 SMA (Bollinger Middle), 50 SMA (Intermediate), 200 SMA (Institutional)',
    tradingViewSearch: 'Moving Average Simple',
    tradingViewCategory: 'Trend Following',
    overview:
      'The Simple Moving Average (SMA) calculates the unweighted mean of the last N bars. In institutional Indian trading desks (DIIs/FIIs), the 200-day and 50-day SMAs serve as the undisputed benchmark dividing long-term bull markets from bear markets.',
    formula: 'SMA = (Close_1 + Close_2 + ... + Close_n) / n',
    calculationSteps: [
      'Add the closing prices for the past N periods.',
      'Divide the sum by N.',
      'As each new bar opens, drop the oldest price and add the newest price.'
    ],
    bullishSignals: [
      'Golden Cross: 50 SMA crosses above the 200 SMA on the Daily chart.',
      'Institutional Support: Major Nifty 50 stocks bouncing directly off the rising 200 SMA.',
      'Price trading comfortably above both 50 and 200 SMA with upward slope.'
    ],
    bearishSignals: [
      'Death Cross: 50 SMA crosses below the 200 SMA signaling structural weakness.',
      'Price fails to reclaim declining 200 SMA, turning it into heavy institutional resistance.'
    ],
    indianMarketPlaybook: {
      recommendedTimeframes: 'Daily & Weekly charts for Investment and Swing setups.',
      bestInstrument: 'Nifty 100, Nifty Midcap 150, Positional delivery stocks.',
      recommendedPairings: 'Combine 200 SMA with Delivery Volume and quarterly earnings breakout.',
      marketHoursTip: 'DIIs and mutual funds frequently accumulate Indian blue-chips near the 200 SMA.'
    },
    pitfalls: [
      'Due to equal weighting, SMAs react slower to sudden market events than EMAs.',
      'Not optimal for quick intraday scalping without shorter moving averages.'
    ],
    pineScriptSnippet: 'ta.sma(close, 200)',
    svgType: 'movingAverage'
  },
  {
    id: 'trendlines',
    code: 'TL',
    name: 'Trend Lines & Channels',
    category: 'Price Action & Drawings',
    difficulty: 'Intermediate',
    isIndianFavorite: true,
    shortDesc: 'Diagonal boundary lines connecting swing pivots to reveal dynamic support & resistance.',
    indianParams: 'At least 3 valid swing touches; Multi-timeframe confluence',
    tradingViewSearch: 'Trend Line / Parallel Channel (Drawing Tool)',
    tradingViewCategory: 'Price Action & Drawings',
    overview:
      'Trend lines are the cornerstone of classical technical analysis on TradingView. An ascending trend line connects consecutively higher swing lows, defining an upward demand zone. A descending trend line connects lower swing highs, mapping institutional overhead supply.',
    formula: 'Slope = (Price_2 - Price_1) / (Time_2 - Time_1); y = mx + c',
    calculationSteps: [
      'Identify two primary anchor swing points (swing lows for uptrend, swing highs for downtrend).',
      'Draw the connecting trajectory ray.',
      'Confirm validity with a 3rd touch test where price respects the slope.',
      'Monitor for parallel channel expansions and breakout volume spikes.'
    ],
    bullishSignals: [
      'Bullish Trendline Breakout: Price punches through descending resistance with 2x average volume.',
      'Breakout & Retest: Price breaks resistance, pulls back to touch old trend line as support, and resumes up.'
    ],
    bearishSignals: [
      'Ascending Support Breakdown: Price cracks below rising support line with closing candle confirmation.',
      'Trend Line Resistance Rejection: Sharp rejection wick formed at downward channel roof.'
    ],
    indianMarketPlaybook: {
      recommendedTimeframes: '15-min for intraday breakout setups; Daily for multimonth swing channels.',
      bestInstrument: 'Nifty 50, Bank Nifty, Breakout momentum stocks (TCS, Infosys, Reliance, Adani).',
      recommendedPairings: 'Pair with Volume Profile POC and RSI Divergence for high win-rate breakouts.',
      marketHoursTip: 'Breakouts occurring between 09:30-10:30 IST or 14:00-15:00 IST have highest follow-through.'
    },
    pitfalls: [
      'Drawing through candle wicks vs bodies inconsistently—maintain standard criteria across all charts.',
      'Avoid entering on the first tick of a breakout before candle closes to prevent fakeouts.'
    ],
    pineScriptSnippet: '// Hand-drawn or automated via line.new() with swing high/low detection',
    svgType: 'trendline'
  },
  {
    id: 'vwap',
    code: 'VWAP',
    name: 'Volume Weighted Average Price',
    category: 'Volume & Order Flow',
    difficulty: 'Intermediate',
    isIndianFavorite: true,
    shortDesc: 'The true institutional benchmark price weighted by volume executed throughout the session.',
    indianParams: 'Session Anchor: 09:15 IST, Standard Deviation Bands: 1σ, 2σ',
    tradingViewSearch: 'VWAP (Volume Weighted Average Price)',
    tradingViewCategory: 'Volume & Order Flow',
    overview:
      'VWAP is the single most critical intraday tool used by institutional algorithms, DIIs, FIIs, and professional prop desks in Indian markets. It resets every morning at 09:15 IST and provides the true volume-weighted fair value benchmark for the day.',
    formula: 'VWAP = Σ (Typical Price × Volume) / Σ Volume, where Typical Price = (High + Low + Close) / 3',
    calculationSteps: [
      'Calculate Typical Price for each intraday candle: (H + L + C) / 3.',
      'Multiply Typical Price by candle volume to get PV.',
      'Maintain running cumulative sum of PV and cumulative Volume from 09:15 IST.',
      'Divide Cumulative PV by Cumulative Volume to compute current VWAP.'
    ],
    bullishSignals: [
      'Price sustained above VWAP indicates buyers control institutional order flow.',
      'Morning VWAP Bounce: Price opens gap-up, dips to test VWAP, and buyers aggressively defend it.',
      'VWAP Cross: Price crossing from below to above VWAP with volume spike.'
    ],
    bearishSignals: [
      'Price rejected heavily when attempting to rally up to VWAP from below.',
      'Price holding below VWAP with lower standard deviation expansion (bearish trend day).'
    ],
    indianMarketPlaybook: {
      recommendedTimeframes: '3-min & 5-min charts strictly for intraday trading (resets daily).',
      bestInstrument: 'Nifty & Bank Nifty Index Futures/Options, Top 20 NSE F&O Liquid Equities.',
      recommendedPairings: 'Combine VWAP with 9/21 EMA. When Price > 21 EMA > VWAP, hold long calls.',
      marketHoursTip: 'Institutional VWAP execution orders are most active at market open (09:15-10:00) and closing (14:30-15:30).'
    },
    pitfalls: [
      'VWAP is strictly an intraday indicator; it loses relevance if not reset per session.',
      'Trading against VWAP (shorting above VWAP on a strong trend day) is dangerous for options buyers.'
    ],
    pineScriptSnippet: 'ta.vwap(hlc3)',
    svgType: 'volume'
  },
  {
    id: 'supertrend',
    code: 'ST',
    name: 'Supertrend',
    category: 'Trend Following',
    difficulty: 'Beginner',
    isIndianFavorite: true,
    shortDesc: 'Volatility-adjusted trailing stop and trend indicator based on Average True Range.',
    indianParams: 'Standard: ATR Period 10, Multiplier 3 (Scalp: 7, 2)',
    tradingViewSearch: 'Supertrend',
    tradingViewCategory: 'Trend Following',
    overview:
      'Developed by Olivier Seban, Supertrend is immensely popular among Indian retail and option traders. It plots a continuous trailing band above or below price based on market volatility (ATR), providing unambiguous green (buy) and red (sell) signals.',
    formula: 'Upper Band = (High + Low)/2 + (Multiplier × ATR); Lower Band = (High + Low)/2 - (Multiplier × ATR)',
    calculationSteps: [
      'Compute the Average True Range (ATR) over 10 periods.',
      'Calculate basic upper and lower bands around median price (H+L)/2.',
      'Ratchet the stop level in the direction of the trend (cannot move against the trader).',
      'When price crosses through the band, flip the indicator trend state and color.'
    ],
    bullishSignals: [
      'Supertrend flips from RED to GREEN, and price closes above the prior band.',
      'Price pulls back and bounces off the rising green Supertrend support line.'
    ],
    bearishSignals: [
      'Supertrend flips from GREEN to RED, with candle closing below lower band.',
      'Price tests descending red Supertrend line and gets rejected.'
    ],
    indianMarketPlaybook: {
      recommendedTimeframes: '5-min / 15-min for Intraday Index Options; Daily for Swing Equity.',
      bestInstrument: 'Bank Nifty & Nifty 50 weekly options, high beta momentum stocks.',
      recommendedPairings: 'Combine Supertrend with 200 EMA. Only take Green flips when price is above 200 EMA.',
      marketHoursTip: 'Avoid taking Supertrend flips during 11:30 - 13:00 IST lunch chop where whipsaws occur.'
    },
    pitfalls: [
      'Suffers severe drawdown and repeated whipsaws in sideways or low-volatility Indian market days.',
      'Needs a trend filter (like ADX > 25 or 200 EMA) to eliminate false signals.'
    ],
    pineScriptSnippet: '// Built-in TradingView indicator or [st, dir] = ta.supertrend(3, 10)',
    svgType: 'stepLine'
  },
  {
    id: 'macd',
    code: 'MACD',
    name: 'Moving Average Convergence Divergence',
    category: 'Momentum',
    difficulty: 'Intermediate',
    isIndianFavorite: false,
    shortDesc: 'Trend-following momentum indicator displaying relationship between two moving averages.',
    indianParams: 'Fast Length: 12, Slow Length: 26, Signal Smoothing: 9 (Source: Close)',
    tradingViewSearch: 'MACD (Moving Average Convergence Divergence)',
    tradingViewCategory: 'Momentum Oscillators',
    overview:
      'Created by Gerald Appel in the late 1970s, MACD tracks momentum changes by subtracting the 26-period EMA from the 12-period EMA. A 9-period EMA of the MACD line acts as the trigger signal line, while the histogram measures the delta between them.',
    formula: 'MACD Line = 12 EMA - 26 EMA; Signal Line = 9 EMA of MACD Line; Histogram = MACD Line - Signal Line',
    calculationSteps: [
      'Calculate the 12-period EMA and 26-period EMA of closing prices.',
      'Subtract 26 EMA from 12 EMA to derive the MACD Line.',
      'Calculate the 9-period EMA of the resulting MACD line to get the Signal Line.',
      'Subtract Signal Line from MACD Line to generate the Histogram bars.'
    ],
    bullishSignals: [
      'MACD Line crosses above Signal Line while below the zero line (early momentum turnaround).',
      'MACD Line crosses above Zero Line (confirms sustained bull trend).',
      'Bullish Divergence on MACD Histogram: Higher low on histogram with lower low in stock price.'
    ],
    bearishSignals: [
      'MACD Line crosses below Signal Line from high territory (momentum loss).',
      'MACD Line crosses below Zero Line into negative territory (bearish dominance).'
    ],
    indianMarketPlaybook: {
      recommendedTimeframes: '15-min and 1-Hour charts for positional swing trading in Indian stocks.',
      bestInstrument: 'Nifty Midcap 100, IT & Banking sector leaders (HDFC Bank, ICICI Bank, Infosys).',
      recommendedPairings: 'Combine MACD signal line crosses with Supertrend or Bollinger Bands.',
      marketHoursTip: 'On 5-min index charts, MACD zero-line rejections offer clean morning trend continuation.'
    },
    pitfalls: [
      'MACD is a lagging indicator; signals may arrive after substantial price movement has already occurred.',
      'Histogram color flips can be premature if price is stuck in tight consolidation.'
    ],
    pineScriptSnippet: '[macdLine, signalLine, histLine] = ta.macd(close, 12, 26, 9)',
    svgType: 'oscillator'
  },
  {
    id: 'bollinger_bands',
    code: 'BB',
    name: 'Bollinger Bands',
    category: 'Volatility',
    difficulty: 'Intermediate',
    isIndianFavorite: false,
    shortDesc: 'Volatility envelope placed two standard deviations above and below a 20-period moving average.',
    indianParams: 'Length: 20 SMA, Multiplier: 2.0 Standard Deviations',
    tradingViewSearch: 'Bollinger Bands',
    tradingViewCategory: 'Volatility',
    overview:
      'Devised by John Bollinger, Bollinger Bands dynamically adapt to market volatility. When markets are quiet, the bands contract (The Squeeze); when volatility surges, the bands expand. In Indian markets, 90% of price action is contained inside the bands.',
    formula: 'Middle = 20 SMA; Upper = Middle + (2 × StDev); Lower = Middle - (2 × StDev)',
    calculationSteps: [
      'Calculate the 20-period Simple Moving Average of close prices.',
      'Compute the standard deviation of close prices over the same 20 periods.',
      'Multiply standard deviation by 2 and add to 20 SMA for Upper Band.',
      'Subtract 2 standard deviations from 20 SMA for Lower Band.'
    ],
    bullishSignals: [
      'Bollinger Squeeze Breakout: Bands contract tightly, followed by a strong candle breaking above Upper Band.',
      'Walking the Bands: In strong uptrends, price consistently clings to and pushes the Upper Band.'
    ],
    bearishSignals: [
      'Bollinger Squeeze Breakdown: Candle closes decisively below contracted Lower Band.',
      'Upper Band Rejection: Long upper wick candle rejecting the upper band during sideways phase.'
    ],
    indianMarketPlaybook: {
      recommendedTimeframes: '15-min & Daily charts for volatility breakout screening.',
      bestInstrument: 'Earnings release stocks, high-beta Nifty Auto and Metal stocks (Tata Steel, Maruti).',
      recommendedPairings: 'Combine Bollinger Band Squeeze with Volume Profile and RSI for breakout confirmation.',
      marketHoursTip: 'A tight morning squeeze between 11:30 - 13:30 IST often resolves into a sharp afternoon breakout.'
    },
    pitfalls: [
      'Touching the upper band does not automatically mean a sell signal; in strong trends it keeps rising.',
      'Always look for bandwidth contraction before expecting an explosive move.'
    ],
    pineScriptSnippet: '[middle, upper, lower] = ta.bb(close, 20, 2)',
    svgType: 'bands'
  },
  {
    id: 'pivot_points',
    code: 'PP',
    name: 'Pivot Points (Standard & Camarilla)',
    category: 'Price Action & Drawings',
    difficulty: 'Intermediate',
    isIndianFavorite: true,
    shortDesc: 'Mathematical horizontal support and resistance levels derived from previous session price ranges.',
    indianParams: 'Type: Standard (P, R1-R3, S1-S3) / Camarilla (H3/H4, L3/L4), Daily Range',
    tradingViewSearch: 'Pivot Points Standard / Camarilla',
    tradingViewCategory: 'Support & Resistance',
    overview:
      'Pivot Points are calculated automatically from the previous day\'s High, Low, and Close. Unlike moving averages, pivots are predictive and static throughout the entire day, making them a staple for Indian option buyers and intraday floor traders.',
    formula: 'Central Pivot (P) = (High + Low + Close) / 3; R1 = 2P - Low; S1 = 2P - High; Camarilla H4 Breakout',
    calculationSteps: [
      'Extract previous trading day\'s official NSE High, Low, and Close.',
      'Calculate the Central Pivot (P).',
      'Compute Support (S1, S2, S3) and Resistance (R1, R2, R3) tiers.',
      'For Camarilla: compute H3/L3 mean reversion levels and H4/L4 breakout boundary lines.'
    ],
    bullishSignals: [
      'Opening above Central Pivot (P) indicates intraday bullish market sentiment.',
      'Camarilla H4 Breakout: Price crosses above H4 with strong 5-min candle, signaling open-sky rally.',
      'Support Bounce at S1 or S2 with bullish candlestick confirmation.'
    ],
    bearishSignals: [
      'Opening below Central Pivot (P) establishes intraday bearish bias.',
      'Camarilla L4 Breakdown: Price drops below L4 triggering high-momentum panic sell-off.'
    ],
    indianMarketPlaybook: {
      recommendedTimeframes: '5-min & 15-min charts strictly for intraday execution.',
      bestInstrument: 'Nifty 50, Bank Nifty, and heavyweights (HDFC Bank, Reliance, ICICI Bank).',
      recommendedPairings: 'Combine Camarilla H3/L3 with VWAP. Bounces off H3/L3 often align with VWAP touches.',
      marketHoursTip: 'When Nifty opens between H3 and L3, expect a range-bound day; trade reversals at boundaries.'
    },
    pitfalls: [
      'On gap-up or gap-down days exceeding R2/S2, standard pivots can be exceeded quickly.',
      'Always use prior day\'s regular session data (09:15-15:30 IST) for accurate computation.'
    ],
    pineScriptSnippet: '// Built-in Pivot Points Standard or Camarilla math based on request.security()',
    svgType: 'levels'
  },
  {
    id: 'stochastic',
    code: 'STOCH',
    name: 'Stochastic Oscillator',
    category: 'Momentum',
    difficulty: 'Intermediate',
    isIndianFavorite: false,
    shortDesc: 'Compares a specific closing price of a stock to its price range over a given period.',
    indianParams: '%K: 14, %D: 3, Smooth: 3, Overbought: 80, Oversold: 20',
    tradingViewSearch: 'Stochastic',
    tradingViewCategory: 'Momentum Oscillators',
    overview:
      'Developed by George Lane, the Stochastic Oscillator is based on the observation that during uptrends, prices tend to close near their high; during downtrends, prices close near their low. It excels at timing sniper entries in range-bound Indian market conditions.',
    formula: '%K = 100 × [(Close - Lowest Low_n) / (Highest High_n - Lowest Low_n)]; %D = 3-period SMA of %K',
    calculationSteps: [
      'Find the Highest High and Lowest Low over the last 14 periods.',
      'Calculate raw %K comparing current close relative to the 14-period range.',
      'Smooth %K with a 3-period moving average.',
      'Calculate %D as a 3-period simple moving average of smoothed %K.'
    ],
    bullishSignals: [
      '%K line crosses above %D line while both are below 20 (oversold buy signal).',
      'Bullish Divergence: Price makes lower low, but Stochastic %K forms higher low below 20.'
    ],
    bearishSignals: [
      '%K line crosses below %D line while both are above 80 (overbought sell signal).',
      'Bearish Divergence: Price makes higher high, but Stochastic %K registers lower high above 80.'
    ],
    indianMarketPlaybook: {
      recommendedTimeframes: '5-min & 15-min for range-bound index setups; Daily for swing reversals.',
      bestInstrument: 'Range-bound days on Nifty 50, defensive FMCG stocks (ITC, HUL).',
      recommendedPairings: 'Combine Stochastic with Horizontal Support/Resistance and Bollinger Bands.',
      marketHoursTip: 'Most reliable during Indian market mid-day sessions (11:30 - 13:30 IST) when market consolidates.'
    },
    pitfalls: [
      'In persistent directional trend days, Stochastic can become pinned above 80 or below 20 for hours.',
      'Never trade Stochastic crossovers against the dominant higher-timeframe trend.'
    ],
    pineScriptSnippet: '[k, d] = ta.stoch(close, high, low, 14, 3, 3)',
    svgType: 'oscillator'
  },
  {
    id: 'atr',
    code: 'ATR',
    name: 'Average True Range',
    category: 'Volatility',
    difficulty: 'Beginner',
    isIndianFavorite: false,
    shortDesc: 'Measures market volatility by evaluating the complete price range including gaps.',
    indianParams: 'Period: 14, Smoothing: RMA (Wilder)',
    tradingViewSearch: 'Average True Range',
    tradingViewCategory: 'Volatility',
    overview:
      'Introduced by J. Welles Wilder Jr., ATR measures market volatility rather than price direction. It accounts for overnight gap-ups and gap-downs common in Indian markets by evaluating True Range: the maximum distance between High, Low, and previous Close.',
    formula: 'TR = Max(High - Low, |High - Prior Close|, |Low - Prior Close|); ATR = 14-period smoothed TR',
    calculationSteps: [
      'Calculate True Range for current bar using the maximum of 3 distance measures.',
      'Smooth the True Range over 14 periods using Wilder\'s exponential smoothing method.',
      'Update dynamically bar-by-bar.'
    ],
    bullishSignals: [
      'ATR contraction to multi-week lows indicates impending volatility explosion / breakout setup.',
      'ATR expansion accompanying a breakout candle confirms genuine institutional participation.'
    ],
    bearishSignals: [
      'Unusually massive ATR spikes often signal panic selling climax and impending capitulation bounce.'
    ],
    indianMarketPlaybook: {
      recommendedTimeframes: 'Daily chart for Position Sizing; 5-min chart for Option Stop Loss placement.',
      bestInstrument: 'Used across all Indian F&O stocks to determine realistic stop losses and profit targets.',
      recommendedPairings: 'Multiply Daily ATR by 1.5 to set professional trailing stops on positional trades.',
      marketHoursTip: 'Compare morning 09:15-09:30 ATR to session average to anticipate day\'s volatility profile.'
    },
    pitfalls: [
      'ATR does not indicate whether to buy or sell—it strictly measures volatility velocity.',
      'Do not use fixed rupee stops across different stocks; always calibrate stop loss to stock\'s ATR.'
    ],
    pineScriptSnippet: 'ta.atr(14)',
    svgType: 'oscillator'
  },
  {
    id: 'volume_profile',
    code: 'VP',
    name: 'Volume Profile (FRVP / Session)',
    category: 'Volume & Order Flow',
    difficulty: 'Advanced',
    isIndianFavorite: true,
    shortDesc: 'Advanced study showing volume distribution traded at specific price levels over time.',
    indianParams: 'Value Area Volume: 70%, Session / Fixed Range calculation',
    tradingViewSearch: 'Volume Profile Fixed Range (FRVP) / Session Volume',
    tradingViewCategory: 'Volume & Order Flow',
    overview:
      'Volume Profile is a signature TradingView institutional study that plots volume horizontally across price levels rather than vertically by time. It highlights the Point of Control (POC)—the single price where the highest volume exchanged hands.',
    formula: 'Horizontal histogram of tick volume aggregated per price bucket; Value Area = 70% of total volume',
    calculationSteps: [
      'Divide the session or selected range into discrete price tick buckets.',
      'Accumulate volume executed at each specific price bucket.',
      'Identify Point of Control (POC): the price with the longest volume bar.',
      'Calculate Value Area High (VAH) and Value Area Low (VAL) covering 70% of total volume.'
    ],
    bullishSignals: [
      'Price breaks out above Value Area High (VAH) and retests it as strong support.',
      'Rejection at Value Area Low (VAL): Buyers defend the discount zone with strong volume tail.'
    ],
    bearishSignals: [
      'Price breaks down below Value Area Low (VAL), accelerating downward through Low Volume Nodes.',
      'Rejection at Point of Control (POC) or Value Area High during pullbacks.'
    ],
    indianMarketPlaybook: {
      recommendedTimeframes: '15-min and 30-min charts for Session Volume Profile; Daily for Fixed Range (FRVP).',
      bestInstrument: 'Nifty Futures, Bank Nifty Futures, Institutional heavyweights (Reliance, Infy).',
      recommendedPairings: 'Combine POC retests with VWAP and Camarilla Pivots for high win-rate entries.',
      marketHoursTip: 'Virgin POCs (prior day POCs never retested) act like magnetic price targets in Nifty 50.'
    },
    pitfalls: [
      'Trading inside the Value Area chop zone between VAL and VAH often leads to choppy stop-outs.',
      'Low Volume Nodes (LVN) cause rapid price slippage—never place stops directly inside an LVN.'
    ],
    pineScriptSnippet: '// TradingView built-in Volume Profile indicator suite',
    svgType: 'volume'
  },
  {
    id: 'fibonacci',
    code: 'FIB',
    name: 'Fibonacci Retracement & Extensions',
    category: 'Price Action & Drawings',
    difficulty: 'Intermediate',
    isIndianFavorite: false,
    shortDesc: 'Mathematical ratios derived from the Fibonacci sequence forecasting pullback depths and targets.',
    indianParams: 'Key Ratios: 38.2%, 50.0%, 61.8% (Golden Pocket), 78.6%, 161.8% Extension',
    tradingViewSearch: 'Fib Retracement (Alt + F)',
    tradingViewCategory: 'Price Action & Drawings',
    overview:
      'Based on the golden ratio (1.618 / 0.618), Fibonacci Retracement is one of the most widely used charting tools on TradingView. When a stock completes an impulse rally, traders anchor Fib levels from the swing low to the swing high to forecast where pullbacks will reverse.',
    formula: 'Retracement Levels = High - [(High - Low) × Ratio]; Extension = High + [(High - Low) × Ratio]',
    calculationSteps: [
      'Identify a distinct, clean impulse swing high and swing low.',
      'Anchor Fibonacci Retracement tool from start to finish of the move.',
      'Watch for price deceleration at the 50% and 61.8% Golden Pocket zone.',
      'Project upside breakout targets using the 1.618 and 2.618 Fibonacci extension ratios.'
    ],
    bullishSignals: [
      'Reversal confirmation candle (pin bar / engulfing) at the 50% - 61.8% Golden Pocket.',
      'Confluence: 61.8% Fibonacci level aligning exactly with a rising 50 EMA or horizontal breakout zone.'
    ],
    bearishSignals: [
      'In downtrends, bear flag rallies reject precisely at the 61.8% Fibonacci retracement level.',
      'Decisive candle close below the 78.6% level invalidates the original impulse setup.'
    ],
    indianMarketPlaybook: {
      recommendedTimeframes: '15-min for intraday index swing impulses; Daily & Weekly for multi-month trends.',
      bestInstrument: 'Nifty 50 impulse rallies, High momentum midcap stocks (Zomato, Trent, BEL).',
      recommendedPairings: 'Combine Golden Pocket (61.8%) with RSI Bullish Divergence for high-reward setups.',
      marketHoursTip: 'Morning opening gap-ups that retrace 50% of the morning rally by 10:15 IST often offer prime call entries.'
    },
    pitfalls: [
      'Drawing Fibonacci across minor noise swings rather than genuine structural swing pivots.',
      'Treating Fib levels as exact walls rather than dynamic zones of buyer/seller reaction.'
    ],
    pineScriptSnippet: '// TradingView Drawing Tool or custom Pine script ratio levels',
    svgType: 'levels'
  },
  {
    id: 'adx',
    code: 'ADX',
    name: 'Average Directional Index',
    category: 'Trend Following',
    difficulty: 'Intermediate',
    isIndianFavorite: false,
    shortDesc: 'Determines the strength of a price trend regardless of whether it is bullish or bearish.',
    indianParams: 'ADX Length: 14, DI Length: 14, Strong Trend Threshold: 25',
    tradingViewSearch: 'Directional Movement Index (DMI/ADX)',
    tradingViewCategory: 'Trend Strength',
    overview:
      'Developed by Welles Wilder, ADX quantifies trend strength on a 0-100 scale. It does not indicate direction by itself; rather, an ADX value above 25 signals a powerful trending market, while an ADX below 20 signals a dead, sideways, or choppy market.',
    formula: 'ADX = 14-period smoothed average of DX, where DX = 100 × |(+DI - -DI) / (+DI + -DI)|',
    calculationSteps: [
      'Calculate Directional Movement (+DM and -DM) from bar-to-bar highs and lows.',
      'Smooth +DM, -DM, and True Range over 14 periods to compute +DI and -DI.',
      'Compute Directional Index (DX) from the absolute difference between +DI and -DI.',
      'Smooth DX over 14 periods to calculate the final ADX curve.'
    ],
    bullishSignals: [
      'ADX crosses above 25 while +DI is above -DI (strong bullish expansion underway).',
      'Rising ADX indicates trend acceleration—favorable for buying trending breakouts.'
    ],
    bearishSignals: [
      'ADX crosses above 25 while -DI is above +DI (strong bearish dump underway).',
      'Declining ADX dropping below 20 warns of impending market chop and option decay.'
    ],
    indianMarketPlaybook: {
      recommendedTimeframes: '5-min / 15-min for Index Option Buyers; Daily for Momentum Equity.',
      bestInstrument: 'Nifty & Bank Nifty Options—critical for avoiding rapid theta decay.',
      recommendedPairings: 'Only buy naked options when ADX > 25. When ADX < 20, deploy non-directional option selling spreads.',
      marketHoursTip: 'Indian markets spend ~60% of time in low-ADX chop; filtering by ADX > 25 saves significant trading capital.'
    },
    pitfalls: [
      'Do not confuse a falling ADX with a falling price—a falling ADX simply means the current trend is weakening.',
      'Wait for +DI / -DI confirmation before committing directional capital.'
    ],
    pineScriptSnippet: '[diplus, diminus, adx] = ta.dmi(14, 14)',
    svgType: 'oscillator'
  },
  {
    id: 'ichimoku',
    code: 'ICH',
    name: 'Ichimoku Kinko Hyo (Cloud)',
    category: 'Trend Following',
    difficulty: 'Advanced',
    isIndianFavorite: false,
    shortDesc: 'Comprehensive Japanese charting system defining trend, momentum, and support/resistance zones.',
    indianParams: 'Tenkan-sen: 9, Kijun-sen: 26, Senkou Span B: 52, Displacement: 26',
    tradingViewSearch: 'Ichimoku Cloud',
    tradingViewCategory: 'Trend & Multi-Factor',
    overview:
      'Created by Japanese journalist Goichi Hosoda, Ichimoku translates to "one glance equilibrium chart". At a single glance, it reveals trend direction, dynamic support and resistance (the Kumo Cloud), momentum, and future projected sentiment displaced 26 periods ahead.',
    formula: 'Tenkan = (9H+9L)/2; Kijun = (26H+26L)/2; Span A = (Tenkan+Kijun)/2; Span B = (52H+52L)/2 shifted 26 bars',
    calculationSteps: [
      'Calculate Conversion Line (Tenkan-sen) as midpoint of 9-period high and low.',
      'Calculate Base Line (Kijun-sen) as midpoint of 26-period high and low.',
      'Compute Senkou Span A and Span B to generate the future Kumo Cloud boundary.',
      'Plot Chikou Span (lagging line) displaced 26 periods backwards.'
    ],
    bullishSignals: [
      'Price breaks decisively above the Kumo Cloud with green cloud ahead.',
      'TK Bullish Cross: Tenkan-sen crosses above Kijun-sen while above the cloud.',
      'Chikou Span (Lagging Line) free of price obstacles 26 periods ago.'
    ],
    bearishSignals: [
      'Price falls decisively below the Kumo Cloud with red cloud ahead.',
      'TK Bearish Cross: Tenkan-sen crosses below Kijun-sen while below the cloud.'
    ],
    indianMarketPlaybook: {
      recommendedTimeframes: '1-Hour, Daily, and Weekly charts for positional trend-following in Indian markets.',
      bestInstrument: 'Nifty 50, Largecap bluechips (L&T, State Bank of India, Sun Pharma).',
      recommendedPairings: 'Combine Kumo Cloud breakouts with Volume surges for major multi-week swing moves.',
      marketHoursTip: 'When price is inside the cloud on Daily charts, Nifty is in equilibrium; avoid heavy directional bets.'
    },
    pitfalls: [
      'Can look cluttered on lower timeframes (1m/3m); best kept on 15m or higher.',
      'Avoid entering when price is far extended away from Kijun-sen (Base line)—reversion to mean is likely.'
    ],
    pineScriptSnippet: '// TradingView built-in Ichimoku Cloud study',
    svgType: 'bands'
  },
  {
    id: 'moving_averages_ribbon',
    code: 'MAR',
    name: 'Moving Average Ribbon (Multi-MA)',
    category: 'Trend Following',
    difficulty: 'Intermediate',
    isIndianFavorite: true,
    shortDesc: 'A series of cascading moving averages (9, 21, 50, 100, 200) illustrating trend alignment & strength.',
    indianParams: 'Fast: 9, 21 EMA | Medium: 50 EMA | Slow: 100, 200 SMA',
    tradingViewSearch: 'Moving Average Ribbon',
    tradingViewCategory: 'Trend Following',
    overview:
      'The Moving Average Ribbon combines short-term, intermediate, and long-term moving averages on a single chart. When all averages expand in parallel order, it indicates a powerful, low-risk trend. When averages compress tightly, it signals an imminent volatility explosion.',
    formula: 'Array of EMAs and SMAs plotted simultaneously: EMA(9), EMA(21), EMA(50), SMA(100), SMA(200)',
    calculationSteps: [
      'Calculate fast exponential moving averages (9, 21).',
      'Calculate intermediate trend filters (50 EMA).',
      'Calculate institutional macro benchmarks (100 SMA, 200 SMA).',
      'Color ribbon zones based on alignment: Bullish when 9 > 21 > 50 > 100 > 200.'
    ],
    bullishSignals: [
      'Full Bullish Alignment: All ribbons fan out smoothly in ascending order with price surfing above.',
      'Ribbon Bounce: Pullbacks into the 21-50 EMA ribbon pocket get absorbed by strong institutional buying.'
    ],
    bearishSignals: [
      'Full Bearish Alignment: Ribbons fan out downwards in descending order with price held below.',
      'Ribbon Inversion: Fast EMAs collapsing below 200 SMA signaling structural regime shift.'
    ],
    indianMarketPlaybook: {
      recommendedTimeframes: '15-min for intraday trend days; Daily for multi-month sector rotational trends.',
      bestInstrument: 'NSE Sectoral Indices (Nifty Auto, Nifty Realty, Nifty Metal, Nifty Pharma).',
      recommendedPairings: 'Combine ribbon squeeze with Supertrend for explosive trend-following breakouts.',
      marketHoursTip: 'When ribbons twist and intertwine horizontally, step aside; wait for clear expansion.'
    },
    pitfalls: [
      'Lagging in choppy sideways markets where ribbons twist frequently.',
      'Do not chase price when it is overly detached far above the entire ribbon.'
    ],
    pineScriptSnippet: '// Multi-MA overlay script using ta.ema() and ta.sma()',
    svgType: 'movingAverage'
  }
];

export const IndicatorsExploreView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeIndicator, setActiveIndicator] = useState<IndicatorItem | null>(null);
  const [modalTab, setModalTab] = useState<'overview' | 'signals' | 'indianMarket' | 'simulator'>('overview');
  
  // Simulator State inside modal
  const [simParam, setSimParam] = useState<number>(14);

  const categories = [
    'All',
    'Indian Market Favorites',
    'Trend Following',
    'Momentum',
    'Volume & Order Flow',
    'Volatility',
    'Price Action & Drawings'
  ];

  // Filtered indicators list
  const filteredIndicators = useMemo(() => {
    return INDICATORS_DATA.filter(item => {
      // Category match
      let matchesCat = true;
      if (selectedCategory === 'Indian Market Favorites') {
        matchesCat = !!item.isIndianFavorite;
      } else if (selectedCategory !== 'All') {
        matchesCat = item.category === selectedCategory;
      }

      // Search match
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.code.toLowerCase().includes(q) ||
        item.shortDesc.toLowerCase().includes(q) ||
        item.tradingViewSearch.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);

      return matchesCat && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Mini Visual SVG representation based on indicator type
  const renderMiniChart = (type: IndicatorItem['svgType'], code: string) => {
    switch (type) {
      case 'oscillator':
        return (
          <svg viewBox="0 0 120 40" className="w-full h-10 overflow-visible">
            <line x1="0" y1="10" x2="120" y2="10" stroke="#FF7900" strokeDasharray="2 2" strokeOpacity="0.4" />
            <line x1="0" y1="30" x2="120" y2="30" stroke="#FF7900" strokeDasharray="2 2" strokeOpacity="0.4" />
            <path
              d="M0 25 Q 20 5, 40 22 T 80 12 T 120 28"
              fill="none"
              stroke="#FF7900"
              strokeWidth="2"
              className="drop-shadow-[0_0_4px_rgba(255,121,0,0.6)]"
            />
          </svg>
        );
      case 'movingAverage':
        return (
          <svg viewBox="0 0 120 40" className="w-full h-10 overflow-visible">
            {/* Candle wicks */}
            <line x1="20" y1="30" x2="20" y2="15" stroke="#475569" strokeWidth="1" />
            <rect x="17" y="20" width="6" height="8" fill="#24C78B" />
            <line x1="50" y1="28" x2="50" y2="10" stroke="#475569" strokeWidth="1" />
            <rect x="47" y="14" width="6" height="10" fill="#24C78B" />
            <line x1="80" y1="22" x2="80" y2="6" stroke="#475569" strokeWidth="1" />
            <rect x="77" y="10" width="6" height="8" fill="#24C78B" />
            {/* Smooth Fast EMA */}
            <path d="M0 34 Q 40 24, 70 16 T 120 8" fill="none" stroke="#FF7900" strokeWidth="2" />
            {/* Slower EMA */}
            <path d="M0 36 Q 50 30, 80 22 T 120 16" fill="none" stroke="#FF9B42" strokeDasharray="3 2" strokeWidth="1.5" />
          </svg>
        );
      case 'stepLine':
        return (
          <svg viewBox="0 0 120 40" className="w-full h-10 overflow-visible">
            <path d="M0 32 L 35 32 L 35 24 L 70 24 L 70 14 L 120 14" fill="none" stroke="#24C78B" strokeWidth="2.5" />
            <circle cx="70" cy="14" r="3" fill="#24C78B" />
            <path d="M10 26 L 30 18 L 50 20 L 70 10 L 95 8 L 120 4" fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.7" />
          </svg>
        );
      case 'bands':
        return (
          <svg viewBox="0 0 120 40" className="w-full h-10 overflow-visible">
            {/* Upper band */}
            <path d="M0 8 Q 60 2, 120 10" fill="none" stroke="#FF7900" strokeWidth="1.5" strokeOpacity="0.8" />
            {/* Middle SMA */}
            <path d="M0 20 Q 60 18, 120 22" fill="none" stroke="#A4A7B0" strokeDasharray="2 2" strokeWidth="1" />
            {/* Lower band */}
            <path d="M0 32 Q 60 34, 120 34" fill="none" stroke="#FF7900" strokeWidth="1.5" strokeOpacity="0.8" />
            {/* Oscillating price */}
            <path d="M0 24 Q 30 10, 60 22 T 100 12 T 120 20" fill="none" stroke="#FFFFFF" strokeWidth="1.5" />
          </svg>
        );
      case 'volume':
        return (
          <svg viewBox="0 0 120 40" className="w-full h-10 overflow-visible">
            {/* Volume Profile horizontal bars */}
            <rect x="0" y="5" width="45" height="4" fill="#FF7900" fillOpacity="0.5" />
            <rect x="0" y="12" width="95" height="4" fill="#FF7900" /> {/* POC */}
            <rect x="0" y="19" width="60" height="4" fill="#FF7900" fillOpacity="0.5" />
            <rect x="0" y="26" width="30" height="4" fill="#FF7900" fillOpacity="0.3" />
            <rect x="0" y="33" width="15" height="4" fill="#FF7900" fillOpacity="0.2" />
            {/* VWAP line */}
            <path d="M20 35 Q 60 20, 110 12" fill="none" stroke="#24C78B" strokeWidth="2" />
          </svg>
        );
      case 'trendline':
        return (
          <svg viewBox="0 0 120 40" className="w-full h-10 overflow-visible">
            {/* Ascending support trendline */}
            <line x1="5" y1="38" x2="115" y2="6" stroke="#FF7900" strokeWidth="2" strokeDasharray="4 2" />
            {/* Higher low candles */}
            <circle cx="20" cy="33" r="3" fill="#24C78B" />
            <circle cx="60" cy="20" r="3" fill="#24C78B" />
            <circle cx="100" cy="9" r="3" fill="#24C78B" />
            <path d="M5 28 L 20 33 L 40 16 L 60 20 L 80 8 L 100 9 L 115 2" fill="none" stroke="#FFFFFF" strokeWidth="1.5" />
          </svg>
        );
      case 'levels':
      default:
        return (
          <svg viewBox="0 0 120 40" className="w-full h-10 overflow-visible">
            <line x1="0" y1="8" x2="120" y2="8" stroke="#FF4D5A" strokeWidth="1.5" strokeOpacity="0.7" />
            <line x1="0" y1="20" x2="120" y2="20" stroke="#FF7900" strokeWidth="1.5" />
            <line x1="0" y1="32" x2="120" y2="32" stroke="#24C78B" strokeWidth="1.5" strokeOpacity="0.7" />
            <path d="M10 30 Q 30 18, 50 20 T 90 10 T 110 9" fill="none" stroke="#FFFFFF" strokeWidth="1.5" />
          </svg>
        );
    }
  };

  return (
    <div className="flex w-full flex-col gap-6 max-w-7xl mx-auto pb-14 animate-in fade-in duration-200">
      
      {/* 1. Header Banner & Context */}
      <div className="bg-[#131b2e] border border-white/15 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF9B42] to-[#FF7900] flex items-center justify-center text-black font-black shadow-[0_0_18px_rgba(255,121,0,0.4)] shrink-0">
            <span className="material-symbols-outlined text-[28px]">query_stats</span>
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Indicators to Explore
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[#FF7900]/15 text-[#FF7900] border border-[#FF7900]/30 text-[10px] font-bold uppercase tracking-wider font-mono">
                TradingView Standards
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider font-mono">
                Indian Markets (NSE/BSE)
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Explore essential technical indicators required to analyze and trade Indian equities, Nifty 50, Bank Nifty, and index options. Click any box to study exact mathematical formulas, signal interpretation, and high-probability setups from <a href="https://in.tradingview.com/" target="_blank" rel="noopener noreferrer" className="text-[#FF7900] underline font-semibold hover:text-[#FF9B42]">TradingView India</a>.
            </p>
          </div>
        </div>

        {/* Quick External TradingView Button */}
        <a
          href="https://in.tradingview.com/markets/stocks-india/"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-[#FF7900]/10 border border-white/15 hover:border-[#FF7900]/40 text-slate-200 hover:text-white text-xs font-bold transition-all flex items-center gap-2 shrink-0 shadow-sm cursor-pointer"
        >
          <span className="material-symbols-outlined text-[#FF7900] text-[18px]">open_in_new</span>
          <span>Open TradingView India</span>
        </a>
      </div>

      {/* 2. Search & Category Filters Bar */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search indicators (e.g. RSI, EMA, VWAP, Supertrend, Moving Averages)..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#0b1020] border border-white/15 rounded-xl text-xs sm:text-sm text-white placeholder:text-slate-400 focus:outline-none focus:border-[#FF7900] transition-colors shadow-inner"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Result Counter */}
          <div className="text-xs font-mono text-slate-400 self-center">
            Showing <strong className="text-white">{filteredIndicators.length}</strong> of {INDICATORS_DATA.length} Indicators
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#FF7900] text-black shadow-[0_0_12px_rgba(255,121,0,0.35)]'
                  : 'bg-[#131b2e] text-slate-300 hover:text-white border border-white/10 hover:border-white/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Grid of Indicator Boxes */}
      {filteredIndicators.length === 0 ? (
        <div className="bg-[#131b2e] border border-white/15 rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-3">
          <span className="material-symbols-outlined text-4xl text-slate-500">search_off</span>
          <h3 className="text-base font-bold text-white">No indicators match your filter</h3>
          <p className="text-xs text-slate-400">Try clearing your search term or selecting "All" categories.</p>
          <button
            type="button"
            onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
            className="mt-2 px-4 py-2 rounded-xl bg-[#FF7900] text-black font-bold text-xs cursor-pointer shadow-md"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredIndicators.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                setActiveIndicator(item);
                setModalTab('overview');
                setSimParam(item.id === 'rsi' ? 14 : item.id === 'ema' ? 21 : 20);
              }}
              className="group bg-[#131b2e] hover:bg-[#18233c] border border-white/15 hover:border-[#FF7900] rounded-2xl p-5 shadow-lg hover:shadow-[0_0_20px_rgba(255,121,0,0.22)] transition-all cursor-pointer flex flex-col justify-between gap-4 transform hover:-translate-y-1"
            >
              {/* Top Meta row */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-[#FF7900]/15 text-[#FF7900] border border-[#FF7900]/30 font-mono font-black text-xs">
                      {item.code}
                    </span>
                    {item.isIndianFavorite && (
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-mono text-[9px] font-bold">
                        ★ NSE Hit
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                    {item.category}
                  </span>
                </div>

                {/* Indicator Name */}
                <h3 className="text-base font-bold text-white group-hover:text-[#FF7900] transition-colors tracking-tight">
                  {item.name}
                </h3>

                {/* Short Description */}
                <p className="text-xs text-slate-300 line-clamp-2 mt-1 leading-relaxed">
                  {item.shortDesc}
                </p>
              </div>

              {/* Center Mini SVG Graphic */}
              <div className="p-3 bg-[#0b1020] rounded-xl border border-white/10 group-hover:border-[#FF7900]/30 transition-colors">
                <div className="text-[10px] font-mono text-slate-400 mb-1 flex items-center justify-between">
                  <span>Visual Curve</span>
                  <span className="text-[#FF7900] font-semibold">{item.code}</span>
                </div>
                {renderMiniChart(item.svgType, item.code)}
              </div>

              {/* Bottom Parameters & Action Trigger */}
              <div className="pt-2 border-t border-white/10 flex flex-col gap-2.5">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Indian Standard:</span>
                  <span className="text-slate-200 font-mono font-semibold truncate max-w-[150px]" title={item.indianParams}>
                    {item.indianParams}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs font-bold text-[#FF7900] group-hover:text-white transition-colors">
                  <span>Explore Indicator Details</span>
                  <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. Detailed TradingView Indicator Modal */}
      {activeIndicator && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-[#111726] border border-[#FF7900]/40 rounded-2xl max-w-4xl w-full shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 my-auto">
            
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-[#131b2e] border-b border-white/15 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF9B42] to-[#FF7900] flex items-center justify-center text-black font-black shadow-[0_0_15px_rgba(255,121,0,0.35)] shrink-0">
                  <span className="font-mono text-base font-extrabold">{activeIndicator.code}</span>
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-black text-white">
                      {activeIndicator.name}
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#FF7900]/15 text-[#FF7900] border border-[#FF7900]/30 text-[10px] font-bold font-mono">
                      {activeIndicator.category}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-white/10 text-slate-300 text-[10px] font-semibold">
                      {activeIndicator.difficulty}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    TradingView Official Study: <strong className="text-white">{activeIndicator.tradingViewSearch}</strong>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveIndicator(null)}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-white/10"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex items-center gap-1 px-5 pt-3 border-b border-white/10 bg-[#0e1422] overflow-x-auto text-xs font-bold scrollbar-none">
              <button
                type="button"
                onClick={() => setModalTab('overview')}
                className={`px-4 py-2.5 border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  modalTab === 'overview'
                    ? 'border-[#FF7900] text-[#FF7900]'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">menu_book</span>
                <span>Overview &amp; Formula</span>
              </button>

              <button
                type="button"
                onClick={() => setModalTab('signals')}
                className={`px-4 py-2.5 border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  modalTab === 'signals'
                    ? 'border-[#FF7900] text-[#FF7900]'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">show_chart</span>
                <span>Trading Signals &amp; Setups</span>
              </button>

              <button
                type="button"
                onClick={() => setModalTab('indianMarket')}
                className={`px-4 py-2.5 border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  modalTab === 'indianMarket'
                    ? 'border-[#FF7900] text-[#FF7900]'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">currency_rupee</span>
                <span>Indian Market Playbook (NSE/BSE)</span>
              </button>

              <button
                type="button"
                onClick={() => setModalTab('simulator')}
                className={`px-4 py-2.5 border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  modalTab === 'simulator'
                    ? 'border-[#FF7900] text-[#FF7900]'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">tune</span>
                <span>Interactive Chart Sandbox</span>
              </button>
            </div>

            {/* Modal Scrollable Content Body */}
            <div className="p-5 sm:p-6 overflow-y-auto max-h-[calc(92vh-180px)] space-y-6 text-slate-200 text-xs sm:text-sm leading-relaxed">
              
              {/* TAB 1: OVERVIEW & FORMULA */}
              {modalTab === 'overview' && (
                <div className="space-y-6 animate-in fade-in">
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#FF7900] text-[18px]">info</span>
                      <span>TradingView Core Definition</span>
                    </h4>
                    <p className="text-slate-300 leading-relaxed bg-[#0b1020] p-4 rounded-xl border border-white/10">
                      {activeIndicator.overview}
                    </p>
                  </div>

                  {/* Mathematical Formula Box */}
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#FF7900] text-[18px]">functions</span>
                      <span>Mathematical Formula</span>
                    </h4>
                    <div className="bg-[#0b1020] p-4 rounded-xl border border-[#FF7900]/30 font-mono text-sm text-[#FF9B42] font-bold overflow-x-auto">
                      <code>{activeIndicator.formula}</code>
                    </div>
                  </div>

                  {/* Step-by-Step Calculation */}
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#FF7900] text-[18px]">format_list_numbered</span>
                      <span>Calculation Steps in TradingView Engine</span>
                    </h4>
                    <div className="space-y-2">
                      {activeIndicator.calculationSteps.map((step, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 p-3 rounded-lg bg-white/5 border border-white/5">
                          <span className="w-5 h-5 rounded-full bg-[#FF7900]/20 text-[#FF7900] font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="text-slate-300">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pine Script Quick Reference */}
                  <div className="p-4 rounded-xl bg-gradient-to-r from-[#FF7900]/10 to-transparent border border-[#FF7900]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-[#FF7900] font-bold block">
                        TradingView Pine Script Function
                      </span>
                      <code className="text-xs font-mono font-bold text-white mt-0.5 block">
                        {activeIndicator.pineScriptSnippet}
                      </code>
                    </div>
                    <a
                      href="https://in.tradingview.com/pine-script-docs/en/v5/index.html"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-[#FF7900] text-black font-bold text-xs flex items-center gap-1.5 shrink-0"
                    >
                      <span>Pine Script Docs</span>
                      <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                    </a>
                  </div>
                </div>
              )}

              {/* TAB 2: SIGNALS & INTERPRETATION */}
              {modalTab === 'signals' && (
                <div className="space-y-6 animate-in fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Bullish Signals */}
                    <div className="bg-[#0b1020] border border-emerald-500/30 rounded-xl p-4.5 flex flex-col gap-3">
                      <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                        <span className="material-symbols-outlined text-[20px]">trending_up</span>
                        <h4>Bullish Trading Triggers</h4>
                      </div>
                      <div className="space-y-2.5">
                        {activeIndicator.bullishSignals.map((sig, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-slate-200">
                            <span className="material-symbols-outlined text-emerald-400 text-[18px] shrink-0 mt-0.5">
                              check_circle
                            </span>
                            <span className="text-xs leading-relaxed">{sig}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bearish Signals */}
                    <div className="bg-[#0b1020] border border-rose-500/30 rounded-xl p-4.5 flex flex-col gap-3">
                      <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                        <span className="material-symbols-outlined text-[20px]">trending_down</span>
                        <h4>Bearish Trading Triggers</h4>
                      </div>
                      <div className="space-y-2.5">
                        {activeIndicator.bearishSignals.map((sig, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-slate-200">
                            <span className="material-symbols-outlined text-rose-400 text-[18px] shrink-0 mt-0.5">
                              cancel
                            </span>
                            <span className="text-xs leading-relaxed">{sig}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Common Pitfalls to Avoid */}
                  <div className="bg-[#131b2e] border border-white/10 rounded-xl p-4.5">
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                      <span className="material-symbols-outlined text-amber-400 text-[18px]">warning</span>
                      <span>Common Pitfalls &amp; False Signals</span>
                    </h4>
                    <ul className="space-y-2 mt-2">
                      {activeIndicator.pitfalls.map((pit, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                          <span className="text-amber-400 font-bold">•</span>
                          <span>{pit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* TAB 3: INDIAN MARKET PLAYBOOK */}
              {modalTab === 'indianMarket' && (
                <div className="space-y-5 animate-in fade-in">
                  <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-transparent border border-emerald-500/30 flex items-start gap-3">
                    <span className="material-symbols-outlined text-emerald-400 text-[24px] shrink-0">verified</span>
                    <div>
                      <h4 className="font-bold text-white text-sm">
                        Tailored for NSE / BSE Equities &amp; F&amp;O Derivatives
                      </h4>
                      <p className="text-xs text-slate-300 mt-0.5">
                        Historical parameters tested across Nifty 50, Bank Nifty weekly option contracts, and largecap Indian equities.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-[#0b1020] border border-white/10">
                      <span className="text-[10px] font-mono uppercase text-[#FF7900] font-bold block mb-1">
                        Optimal Timeframes
                      </span>
                      <p className="text-xs text-white font-semibold">
                        {activeIndicator.indianMarketPlaybook.recommendedTimeframes}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-[#0b1020] border border-white/10">
                      <span className="text-[10px] font-mono uppercase text-[#FF7900] font-bold block mb-1">
                        Best Traded Instruments
                      </span>
                      <p className="text-xs text-white font-semibold">
                        {activeIndicator.indianMarketPlaybook.bestInstrument}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-[#0b1020] border border-white/10 sm:col-span-2">
                      <span className="text-[10px] font-mono uppercase text-[#FF7900] font-bold block mb-1">
                        High-Probability Indicator Confluence
                      </span>
                      <p className="text-xs text-slate-200">
                        {activeIndicator.indianMarketPlaybook.recommendedPairings}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-[#0b1020] border border-[#FF7900]/30 sm:col-span-2">
                      <span className="text-[10px] font-mono uppercase text-[#FF7900] font-bold block mb-1">
                        Indian Market Hours Strategy (09:15 - 15:30 IST)
                      </span>
                      <p className="text-xs text-slate-200">
                        {activeIndicator.indianMarketPlaybook.marketHoursTip}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: INTERACTIVE PARAMETER SANDBOX */}
              {modalTab === 'simulator' && (
                <div className="space-y-5 animate-in fade-in">
                  <div className="p-4 rounded-xl bg-[#0b1020] border border-white/15 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-white text-sm">Indicator Parameter Tuning Sandbox</h4>
                        <p className="text-xs text-slate-400">
                          Toggle between default and custom Indian market settings to visualize impact on curve responsiveness.
                        </p>
                      </div>
                      <span className="font-mono font-bold text-xs px-3 py-1 rounded bg-[#FF7900]/20 text-[#FF7900] border border-[#FF7900]/40">
                        Period: {simParam}
                      </span>
                    </div>

                    {/* Presets */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs text-slate-400 font-semibold mr-1">Presets:</span>
                      {[
                        { label: 'Fast / Scalp', val: activeIndicator.id === 'rsi' ? 9 : activeIndicator.id === 'ema' ? 9 : 10 },
                        { label: 'Indian Standard', val: activeIndicator.id === 'rsi' ? 14 : activeIndicator.id === 'ema' ? 21 : 20 },
                        { label: 'Intermediate', val: activeIndicator.id === 'rsi' ? 21 : activeIndicator.id === 'ema' ? 50 : 50 },
                        { label: 'Long-term / Trend', val: activeIndicator.id === 'rsi' ? 28 : activeIndicator.id === 'ema' ? 200 : 200 },
                      ].map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => setSimParam(preset.val)}
                          className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                            simParam === preset.val
                              ? 'bg-[#FF7900] text-black shadow-md'
                              : 'bg-white/5 text-slate-300 hover:text-white border border-white/10'
                          }`}
                        >
                          {preset.label} ({preset.val})
                        </button>
                      ))}
                    </div>

                    {/* Interactive SVG Sandbox Chart */}
                    <div className="h-44 w-full bg-[#070b14] rounded-xl border border-white/10 p-4 flex flex-col justify-between relative overflow-hidden">
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 z-10">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#24C78B]"></span>
                          <span>NIFTY 50 (Simulated 5m Intraday)</span>
                        </span>
                        <span className="text-[#FF7900] font-bold">
                          {activeIndicator.code} ({simParam}) Overlay
                        </span>
                      </div>

                      {/* Dynamic SVG Simulated Chart */}
                      <svg viewBox="0 0 600 120" className="w-full h-28 overflow-visible">
                        {/* Candlesticks */}
                        <g opacity="0.6">
                          <rect x="30" y="70" width="8" height="20" fill="#24C78B" />
                          <line x1="34" y1="65" x2="34" y2="95" stroke="#24C78B" />
                          <rect x="70" y="60" width="8" height="25" fill="#24C78B" />
                          <line x1="74" y1="55" x2="74" y2="90" stroke="#24C78B" />
                          <rect x="110" y="50" width="8" height="15" fill="#FF4D5A" />
                          <line x1="114" y1="45" x2="114" y2="70" stroke="#FF4D5A" />
                          <rect x="150" y="55" width="8" height="22" fill="#24C78B" />
                          <line x1="154" y1="50" x2="154" y2="80" stroke="#24C78B" />
                          <rect x="190" y="40" width="8" height="25" fill="#24C78B" />
                          <line x1="194" y1="35" x2="194" y2="70" stroke="#24C78B" />
                          <rect x="230" y="35" width="8" height="30" fill="#24C78B" />
                          <line x1="234" y1="28" x2="234" y2="72" stroke="#24C78B" />
                          <rect x="270" y="45" width="8" height="18" fill="#FF4D5A" />
                          <line x1="274" y1="40" x2="274" y2="68" stroke="#FF4D5A" />
                          <rect x="310" y="30" width="8" height="25" fill="#24C78B" />
                          <line x1="314" y1="25" x2="314" y2="60" stroke="#24C78B" />
                          <rect x="350" y="25" width="8" height="20" fill="#24C78B" />
                          <line x1="354" y1="20" x2="354" y2="50" stroke="#24C78B" />
                          <rect x="390" y="20" width="8" height="24" fill="#24C78B" />
                          <line x1="394" y1="15" x2="394" y2="48" stroke="#24C78B" />
                          <rect x="430" y="32" width="8" height="16" fill="#FF4D5A" />
                          <line x1="434" y1="28" x2="434" y2="52" stroke="#FF4D5A" />
                          <rect x="470" y="18" width="8" height="22" fill="#24C78B" />
                          <line x1="474" y1="12" x2="474" y2="44" stroke="#24C78B" />
                          <rect x="510" y="15" width="8" height="25" fill="#24C78B" />
                          <line x1="514" y1="10" x2="514" y2="42" stroke="#24C78B" />
                        </g>

                        {/* Parameter Adjusted Curve */}
                        {simParam <= 14 ? (
                          // Fast responsive curve
                          <path
                            d="M 10 90 Q 70 75, 130 65 T 220 40 T 320 30 T 420 28 T 530 18"
                            fill="none"
                            stroke="#FF7900"
                            strokeWidth="2.5"
                            className="drop-shadow-[0_0_8px_rgba(255,121,0,0.8)]"
                          />
                        ) : simParam <= 50 ? (
                          // Medium smooth curve
                          <path
                            d="M 10 95 Q 100 85, 200 60 T 380 40 T 530 26"
                            fill="none"
                            stroke="#FF9B42"
                            strokeWidth="2.5"
                            className="drop-shadow-[0_0_8px_rgba(255,155,66,0.8)]"
                          />
                        ) : (
                          // Slow institutional benchmark curve
                          <path
                            d="M 10 105 Q 150 95, 300 75 T 530 50"
                            fill="none"
                            stroke="#24C78B"
                            strokeWidth="2.5"
                            className="drop-shadow-[0_0_8px_rgba(36,199,139,0.8)]"
                          />
                        )}
                      </svg>

                      <div className="flex items-center justify-between text-[10px] text-slate-400 z-10 pt-1 border-t border-white/5">
                        <span>09:15 Market Open</span>
                        <span>11:30 Midday</span>
                        <span>14:00 Closing Wave</span>
                        <span>15:30 Market Close</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#131b2e] border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="material-symbols-outlined text-[#FF7900] text-[18px]">lightbulb</span>
                <span>Pro Tip: Press <kbd className="px-1.5 py-0.5 bg-black/40 rounded border border-white/20 text-white font-mono text-[10px]">fx</kbd> or <kbd className="px-1.5 py-0.5 bg-black/40 rounded border border-white/20 text-white font-mono text-[10px]">Shift + /</kbd> on TradingView charts to apply.</span>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`https://in.tradingview.com/ideas/${activeIndicator.id}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>TradingView Ideas</span>
                  <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                </a>

                <button
                  type="button"
                  onClick={() => setActiveIndicator(null)}
                  className="px-5 py-2 rounded-xl bg-[#FF7900] text-black font-extrabold text-xs hover:bg-[#FF9B42] transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
