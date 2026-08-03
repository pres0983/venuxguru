import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { FaWallet, FaChartLine, FaRobot, FaDollarSign } from 'react-icons/fa';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ balance: 0, invested: 0, profit: 0, autotrade: true });
  const [trades, setTrades] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const u = JSON.parse(localStorage.getItem('user') || '{}');
      setUser(u);
      const res = await api.get('/user/me');
      setStats(res.data);
      const tradesRes = await api.get('/user/trades');
      setTrades(tradesRes.data.slice(0, 10));
    };
    fetchData();
  }, []);

  const toggleAuto = async () => {
    await api.post('/user/toggle-autotrade');
    setStats({ ...stats, autotrade: !stats.autotrade });
  };

  const chartData = trades.map(t => ({ name: new Date(t.openedAt).toLocaleTimeString(), value: t.pnl || 0 }));

  return (
    <>
      <Navbar />
      <div className="p-4 md:p-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-card p-4 rounded-xl border border-gray-800">
            <div className="flex items-center gap-2 text-gray-400"><FaWallet /> Balance</div>
            <div className="text-2xl font-bold text-accent">${stats.balance?.toFixed(2) || '0.00'}</div>
          </div>
          <div className="bg-card p-4 rounded-xl border border-gray-800">
            <div className="flex items-center gap-2 text-gray-400"><FaDollarSign /> Invested</div>
            <div className="text-2xl font-bold text-white">${stats.invested?.toFixed(2) || '0.00'}</div>
          </div>
          <div className="bg-card p-4 rounded-xl border border-gray-800">
            <div className="flex items-center gap-2 text-gray-400"><FaChartLine /> Profit</div>
            <div className={`text-2xl font-bold ${stats.profit >= 0 ? 'text-accent' : 'text-red-400'}`}>${stats.profit?.toFixed(2) || '0.00'}</div>
          </div>
          <div className="bg-card p-4 rounded-xl border border-gray-800">
            <div className="flex items-center gap-2 text-gray-400"><FaRobot /> Auto-Trade</div>
            <button onClick={toggleAuto} className={`px-4 py-1 rounded-full text-sm font-semibold ${stats.autotrade ? 'bg-accent text-dark' : 'bg-gray-700 text-gray-300'}`}>
              {stats.autotrade ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

        <div className="bg-card p-4 rounded-xl border border-gray-800 mb-6">
          <h3 className="text-gray-400 mb-2">Recent PnL</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <XAxis dataKey="name" stroke="#444" fontSize={10} />
              <YAxis stroke="#444" fontSize={10} />
              <Tooltip contentStyle={{ background: '#1A1730', border: 'none' }} />
              <Line type="monotone" dataKey="value" stroke="#6C3CE1" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card p-4 rounded-xl border border-gray-800">
          <h3 className="text-gray-400 mb-2">Recent Trades</h3>
          {trades.length === 0 ? <p className="text-gray-500 text-sm">No trades yet</p> : (
            trades.map((t, i) => (
              <div key={i} className="flex justify-between py-2 border-b border-gray-800 text-sm">
                <span className={t.side === 'buy' ? 'text-accent' : 'text-red-400'}>{t.side.toUpperCase()}</span>
                <span>${t.entryPrice?.toFixed(2)}</span>
                <span className={t.pnl >= 0 ? 'text-accent' : 'text-red-400'}>{t.pnl?.toFixed(2) || '0.00'}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}