import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['deposit', 'withdraw', 'profit', 'fee'], required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'USDT' },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'completed' },
  txid: { type: String },
  description: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Transaction', TransactionSchema);