import mongoose from 'mongoose';

const TradeSchema = new mongoose.Schema({
  symbol: { type: String, default: 'BTC/USDT' },
  side: { type: String, enum: ['buy', 'sell'], required: true },
  entryPrice: { type: Number, required: true },
  exitPrice: { type: Number },
  volume: { type: Number, required: true },
  pnl: { type: Number, default: 0 },
  pnlPercent: { type: Number, default: 0 },
  status: { type: String, enum: ['open', 'closed'], default: 'open' },
  openedAt: { type: Date, default: Date.now },
  closedAt: { type: Date }
});

export default mongoose.model('Trade', TradeSchema);