import express from 'express';
import auth from '../middleware/auth.js';
import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
import { getDepositHistory } from '../utils/binance.js';

const router = express.Router();

// Manual deposit credit (admin only via webhook or admin panel)
router.post('/webhook', async (req, res) => {
  try {
    const { username, amount, txid } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    user.balance += Number(amount);
    user.invested += Number(amount);
    user.totalDeposits += Number(amount);
    await user.save();
    
    await Transaction.create({
      userId: user._id,
      type: 'deposit',
      amount: Number(amount),
      txid,
      status: 'completed',
      description: 'Deposit credited'
    });
    
    res.json({ success: true, newBalance: user.balance });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get deposit address (master wallet)
router.get('/address', auth, (req, res) => {
  // Replace with your actual Binance deposit address
  res.json({ address: '0xYourMasterWalletAddressHere' });
});

export default router;