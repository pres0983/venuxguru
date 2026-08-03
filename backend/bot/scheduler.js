import cron from 'node-cron';
import { getKlines } from '../utils/binance.js';
import { generateSignal } from './strategy.js';
import { executeTrade } from './executor.js';
import Setting from '../models/Setting.js';

let dailyTradeCount = 0;
let lastResetDate = new Date().toDateString();

export const startScheduler = () => {
  // Run every hour
  cron.schedule('0 * * * *', async () => {
    console.log('Bot cycle started');
    
    // Reset daily counter
    const today = new Date().toDateString();
    if (today !== lastResetDate) {
      dailyTradeCount = 0;
      lastResetDate = today;
    }
    
    const settings = await Setting.find();
    const config = {};
    settings.forEach(s => config[s.key] = s.value);
    
    if (dailyTradeCount >= (config.max_trades_per_day || 5)) {
      console.log('Max daily trades reached');
      return;
    }
    
    try {
      const klines = await getKlines('BTC/USDT', `${config.timeframe_minutes || 60}m`, 200);
      const signal = generateSignal(klines, config);
      
      if (signal !== 'HOLD') {
        await executeTrade(signal);
        dailyTradeCount++;
        console.log(`Trade executed: ${signal}`);
      } else {
        console.log('No signal');
      }
    } catch (err) {
      console.error('Bot error:', err.message);
    }
  });
  
  console.log('Bot scheduler started');
};