import express from 'express';
import auth from '../middleware/auth.js';
import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
import { withdraw } from '../utils/binance.js';

const router = express.Router();

router.post('/request', auth, async (req, res) => {
  try {
    const { address, amount, network } = req.body;
    const user = await User.findById(req.userId);
    
    if (user.balance < amount) return res.status(400).json({ error: 'Insufficient balance' });
    if (amount < 10) return res.status(400).json({ error: 'Minimum withdrawal is 10 USDT' });
    
    user.balance -= amount;
    user.totalWithdrawals += amount;
    await user.save();
    
    const tx = await Transaction.create({
      userId: user._id,
      type: 'withdraw',
      amount,
      status: 'pending',
      description: `Withdrawal to ${address}`
    });
    
    // Optionally auto-process (comment out for manual approval)
    // await withdraw('USDT', amount, address, network || 'BEP20');
    
    res.json({ success: true, pending: true, txId: tx._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/pending', auth, async (req, res) => {
  const txs = await Transaction.find({ userId: req.userId, type: 'withdraw', status: 'pending' });
  res.json(txs);
});

export default router;