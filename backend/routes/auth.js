import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Setting from '../models/Setting.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { fullname, username, email, password } = req.body;
    
    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) return res.status(400).json({ error: 'Email or username already exists' });
    
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ fullname, username, email, password: hashed });
    await user.save();

    // Create default settings if not exist
    const defaults = [
      { key: 'rsi_oversold', value: 25 },
      { key: 'rsi_overbought', value: 75 },
      { key: 'ema_fast', value: 9 },
      { key: 'ema_slow', value: 50 },
      { key: 'take_profit_percent', value: 1.8 },
      { key: 'stop_loss_percent', value: 1.2 },
      { key: 'risk_per_trade_percent', value: 2.0 },
      { key: 'max_trades_per_day', value: 5 },
      { key: 'timeframe_minutes', value: 60 },
      { key: 'min_balance_usdt', value: 10 },
      { key: 'platform_fee_percent', value: 30 },
      { key: 'daily_profit_target_percent', value: 5 }
    ];
    for (const def of defaults) {
      await Setting.findOneAndUpdate({ key: def.key }, { value: def.value }, { upsert: true });
    }
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user._id, fullname, username, email, balance: 0 } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: 'Invalid credentials' });
    
    if (user.status === 'suspended') return res.status(403).json({ error: 'Account suspended' });
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, fullname: user.fullname, username, email: user.email, balance: user.balance, invested: user.invested, profit: user.profit, autotrade: user.autotrade } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;