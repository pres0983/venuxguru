import express from 'express';
import User from '../models/User.js';
import Trade from '../models/Trade.js';
import Transaction from '../models/Transaction.js';
import Setting from '../models/Setting.js';
import { getBalance } from '../utils/binance.js';

const router = express.Router();

// Simple admin auth (basic auth header)
const adminAuth = (req, res, next) => {
  const auth = req.headers.authorization || '';
  const [type, token] = auth.split(' ');
  if (type !== 'Basic' || token !== Buffer.from(`${process.env.ADMIN_USERNAME}:${process.env.ADMIN_PASSWORD}`).toString('base64')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

router.use(adminAuth);

// Dashboard stats
router.get('/dashboard', async (req, res) => {
  const totalUsers = await User.countDocuments();
  const activeUsers = await User.countDocuments({ status: 'active' });
  const totalBalance = (await User.aggregate([{ $group: { _id: null, total: { $sum: '$balance' } } }]))[0]?.total || 0;
  const totalDeposits = (await User.aggregate([{ $group: { _id: null, total: { $sum: '$totalDeposits' } } }]))[0]?.total || 0;
  const totalWithdrawals = (await User.aggregate([{ $group: { _id: null, total: { $sum: '$totalWithdrawals' } } }]))[0]?.total || 0;
  const openTrades = await Trade.countDocuments({ status: 'open' });
  const binanceBalance = await getBalance();
  
  res.json({
    totalUsers,
    activeUsers,
    totalBalance,
    totalDeposits,
    totalWithdrawals,
    openTrades,
    binanceBalance: binanceBalance.total?.USDT || 0
  });
});

router.get('/users', async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.json(users);
});

router.put('/users/:id/suspend', async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  user.status = user.status === 'active' ? 'suspended' : 'active';
  await user.save();
  res.json({ status: user.status });
});

router.put('/users/:id/balance', async (req, res) => {
  const { amount } = req.body;
  const user = await User.findById(req.params.id);
  user.balance += Number(amount);
  await user.save();
  res.json({ newBalance: user.balance });
});

// Bot settings
router.get('/settings', async (req, res) => {
  const settings = await Setting.find();
  const obj = {};
  settings.forEach(s => obj[s.key] = s.value);
  res.json(obj);
});

router.put('/settings', async (req, res) => {
  for (const [key, value] of Object.entries(req.body)) {
    await Setting.findOneAndUpdate({ key }, { value, updatedAt: new Date() }, { upsert: true });
  }
  res.json({ success: true });
});

// Withdrawals management
router.get('/withdrawals', async (req, res) => {
  const txs = await Transaction.find({ type: 'withdraw', status: 'pending' }).populate('userId', 'username email');
  res.json(txs);
});

router.put('/withdrawals/:id/approve', async (req, res) => {
  const tx = await Transaction.findById(req.params.id);
  if (!tx) return res.status(404).json({ error: 'Not found' });
  tx.status = 'completed';
  await tx.save();
  res.json({ success: true });
});

router.put('/withdrawals/:id/reject', async (req, res) => {
  const tx = await Transaction.findById(req.params.id);
  if (!tx) return res.status(404).json({ error: 'Not found' });
  tx.status = 'failed';
  await tx.save();
  // Refund user
  await User.findByIdAndUpdate(tx.userId, { $inc: { balance: tx.amount } });
  res.json({ success: true });
});

export default router;