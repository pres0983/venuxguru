import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Navbar from '../components/Navbar';

export default function BotSettings() {
  const [settings, setSettings] = useState({});
  const basic = btoa('admin:VenuxAdmin2026!');

  useEffect(() => {
    api.get('/admin/settings', { headers: { Authorization: `Basic ${basic}` } }).then(res => setSettings(res.data));
  }, []);

  const handleChange = (key, value) => setSettings({ ...settings, [key]: parseFloat(value) || value });

  const save = async () => {
    await api.put('/admin/settings', settings, { headers: { Authorization: `Basic ${basic}` } });
    alert('Settings saved');
  };

  const fields = [
    ['rsi_oversold', 'RSI Oversold'],
    ['rsi_overbought', 'RSI Overbought'],
    ['ema_fast', 'Fast EMA'],
    ['ema_slow', 'Slow EMA'],
    ['take_profit_percent', 'Take Profit %'],
    ['stop_loss_percent', 'Stop Loss %'],
    ['risk_per_trade_percent', 'Risk Per Trade %'],
    ['max_trades_per_day', 'Max Trades/Day'],
    ['timeframe_minutes', 'Timeframe (min)'],
    ['min_balance_usdt', 'Min Balance (USDT)'],
    ['platform_fee_percent', 'Platform Fee %'],
    ['daily_profit_target_percent', 'Daily Target %']
  ];

  return (
    <>
      <Navbar />
      <div className="p-4 max-w-2xl mx-auto">
        <div className="bg-card p-6 rounded-xl border border-gray-800">
          <h2 className="text-2xl font-bold text-primary mb-4">Bot Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {fields.map(([key, label]) => (
              <div key={key}><label className="text-gray-400 text-sm">{label}</label><input type="number" step="0.1" value={settings[key] || 0} onChange={e => handleChange(key, e.target.value)} className="w-full p-2 rounded-lg bg-dark border border-gray-700 text-white focus:border-primary outline-none" /></div>
            ))}
          </div>
          <button onClick={save} className="mt-4 w-full py-3 rounded-lg bg-primary hover:bg-primary/80 text-white font-semibold transition">Save Settings</button>
        </div>
      </div>
    </>
  );
}