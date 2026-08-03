import User from '../models/User.js';
import Trade from '../models/Trade.js';
import Transaction from '../models/Transaction.js';
import Setting from '../models/Setting.js';
import { placeMarketOrder, getPrice } from '../utils/binance.js';

export const executeTrade = async (signal) => {
  const settings = await Setting.find();
  const config = {};
  settings.forEach(s => config[s.key] = s.value);
  
  const users = await User.find({ autotrade: true, balance: { $gte: config.min_balance_usdt || 10 }, status: 'active' });
  if (users.length === 0) return;
  
  const price = await getPrice('BTC/USDT');
  
  if (signal === 'BUY') {
    // Open long position for all eligible users
    for (const user of users) {
      const amount = (user.balance * (config.risk_per_trade_percent / 100)) / price;
      if (amount < 0.00001) continue;
      
      const order = await placeMarketOrder('BTC/USDT', 'buy', amount);
      const trade = new Trade({
        userId: user._id,
        symbol: 'BTC/USDT',
        side: 'buy',
        entryPrice: price,
        volume: amount,
        status: 'open'
      });
      await trade.save();
    }
  }
  
  if (signal === 'SELL') {
    const openTrades = await Trade.find({ status: 'open' });
    for (const trade of openTrades) {
      const order = await placeMarketOrder('BTC/USDT', 'sell', trade.volume);
      const exitPrice = await getPrice('BTC/USDT');
      const pnl = (exitPrice - trade.entryPrice) * trade.volume;
      const pnlPercent = ((exitPrice - trade.entryPrice) / trade.entryPrice) * 100;
      
      trade.exitPrice = exitPrice;
      trade.pnl = pnl;
      trade.pnlPercent = pnlPercent;
      trade.status = 'closed';
      trade.closedAt = new Date();
      await trade.save();
      
      // Distribute profit/loss
      const user = await User.findById(trade.userId);
      if (pnl > 0) {
        const userShare = pnl * (1 - (config.platform_fee_percent / 100));
        const fee = pnl * (config.platform_fee_percent / 100);
        user.balance += userShare;
        await user.save();
        await Transaction.create({ userId: user._id, type: 'profit', amount: userShare, description: `Trade profit (fee: ${fee.toFixed(2)})` });
      } else {
        user.balance += pnl; // negative
        await user.save();
      }
    }
  }
};