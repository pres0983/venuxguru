export const calculateRSI = (prices, period = 14) => {
  if (prices.length < period + 1) return null;
  let gains = 0, losses = 0;
  for (let i = 1; i <= period; i++) {
    const diff = prices[i] - prices[i - 1];
    if (diff >= 0) gains += diff;
    else losses -= diff;
  }
  let avgGain = gains / period;
  let avgLoss = losses / period;
  const rsiValues = [];
  for (let i = period + 1; i < prices.length; i++) {
    const diff = prices[i] - prices[i - 1];
    if (diff >= 0) {
      avgGain = ((avgGain * (period - 1)) + diff) / period;
      avgLoss = ((avgLoss * (period - 1)) + 0) / period;
    } else {
      avgGain = ((avgGain * (period - 1)) + 0) / period;
      avgLoss = ((avgLoss * (period - 1)) - diff) / period;
    }
    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    const rsi = 100 - (100 / (1 + rs));
    rsiValues.push(rsi);
  }
  return rsiValues;
};

export const calculateEMA = (prices, period) => {
  const multiplier = 2 / (period + 1);
  const ema = [prices[0]];
  for (let i = 1; i < prices.length; i++) {
    ema.push((prices[i] - ema[i - 1]) * multiplier + ema[i - 1]);
  }
  return ema;
};

export const generateSignal = (klines, settings) => {
  const closes = klines.map(k => k[4]); // Close prices
  const rsi = calculateRSI(closes, 14);
  const ema9 = calculateEMA(closes, settings.ema_fast || 9);
  const ema50 = calculateEMA(closes, settings.ema_slow || 50);
  
  const lastIdx = closes.length - 1;
  const price = closes[lastIdx];
  const lastRsi = rsi[rsi.length - 1];
  const lastEma9 = ema9[lastIdx];
  const lastEma50 = ema50[lastIdx];
  
  if (lastRsi < settings.rsi_oversold && price > lastEma50) {
    return 'BUY';
  }
  if (lastRsi > settings.rsi_overbought || price < lastEma9) {
    return 'SELL';
  }
  return 'HOLD';
};