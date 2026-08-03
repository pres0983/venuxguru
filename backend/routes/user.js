import express from 'express';
import auth from '../middleware/auth.js';
import User from '../models/User.js';
import Trade from '../models/Trade.js';
import Transaction from '../models/Transaction.js';

const router = express.Router();

router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.userId).select('-password');
  res.json(user);
});

router.post('/toggle-autotrade', auth, async (req, res) => {
  const user = await User.findById(req.userId);
  user.autotrade = !user.autotrade;
  await user.save();
  res.json({ autotrade: user.autotrade });
});

router.get('/trades', auth, async (req, res) => {
  const trades = await Trade.find({ userId: req.userId }).sort({ openedAt: -1 }).limit(50);
  res.json(trades);
});

router.get('/transactions', auth, async (req, res) => {
  const txs = await Transaction.find({ userId: req.userId }).sort({ createdAt: -1 }).limit(50);
  res.json(txs);
});

export default router;