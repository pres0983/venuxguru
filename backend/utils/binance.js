import ccxt from 'ccxt';
import dotenv from 'dotenv';
dotenv.config();

const binance = new ccxt.binance({
  apiKey: process.env.BINANCE_API_KEY,
  secret: process.env.BINANCE_SECRET_KEY,
  enableRateLimit: true,
});

// Fetch klines
export const getKlines = async (symbol = 'BTC/USDT', timeframe = '1h', limit = 200) => {
  return await binance.fetchOHLCV(symbol, timeframe, undefined, limit);
};

// Get current price
export const getPrice = async (symbol = 'BTC/USDT') => {
  const ticker = await binance.fetchTicker(symbol);
  return ticker.last;
};

// Place market order
export const placeMarketOrder = async (symbol, side, amount) => {
  return await binance.createMarketOrder(symbol, side, amount);
};

// Get balance
export const getBalance = async () => {
  return await binance.fetchBalance();
};

// Get deposit history
export const getDepositHistory = async (coin = 'USDT') => {
  return await binance.fetchDeposits(coin);
};

// Withdraw
export const withdraw = async (coin, amount, address, network = 'BEP20') => {
  return await binance.withdraw(coin, amount, address, { network });
};

export default binance;