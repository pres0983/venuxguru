import React, { useState, useEffect, useRef } from 'react';
import api from '../utils/api';
import { FaWallet, FaPlus, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function Home() {
  const [user, setUser] = useState(null);
  const [price, setPrice] = useState('0.00');
  const [priceChange, setPriceChange] = useState('0.00');
  const [trades, setTrades] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const wsRef = useRef(null);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(u);

    // Fetch data
    api.get('/user/me').then(res => setUser(res.data));
    api.get('/user/trades').then(res => setTrades(res.data.slice(0, 10)));
    api.get('/notifications').then(res => setNotifications(res.data.filter(n => !n.read)));

    // WebSocket for real-time price
    wsRef.current = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@ticker');
    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setPrice(parseFloat(data.c).toFixed(2));
      setPriceChange(parseFloat(data.P).toFixed(2));
    };

    return () => wsRef.current?.close();
  }, []);

  const totalPnl = trades.reduce((sum, t) => sum + (t.pnl || 0), 0);
  const chartData = trades.map(t => ({
    name: new Date(t.openedAt).toLocaleTimeString(),
    value: t.pnl || 0
  }));

  return (
    <div>
      {/* Balance Card */}
      <div className="bg-gradient-to-br from-primary/20 to-card p-5 rounded-2xl border border-primary/30 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-sm">Est. Total Value (USD)</span>
          <button className="bg-primary/20 text-primary text-xs px-3 py-1 rounded-full flex items-center gap-1">
            <FaPlus size={10} /> Add Funds
          </button>
        </div>
        <div className="text-3xl font-bold text-white mt-1">
          ${user?.balance?.toFixed(2) || '0.00'}
        </div>
        <div className="flex justify-between mt-3 text-sm">
          <span className="text-gray-400">Today's PNL</span>
          <span className={totalPnl >= 0 ? 'text-green-400' : 'text-red-400'}>
            ${totalPnl.toFixed(2)} ({totalPnl >= 0 ? '+' : ''}{((totalPnl / (user?.balance || 1)) * 100).toFixed(2)}%)
          </span>
        </div>
      </div>

      {/* Real-time Price */}
      <div className="bg-card p-4 rounded-xl border border-gray-800 mb-4 flex justify-between items-center">
        <div>
          <span className="text-gray-400 text-xs">BTC/USDT</span>
          <div className="text-xl font-bold text-white">${price}</div>
        </div>
        <div className={`text-lg font-semibold ${parseFloat(priceChange) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {priceChange}%
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <button className="bg-card p-4 rounded-xl border border-gray-800 text-center hover:border-primary">
          <div className="text-primary text-2xl">📈</div>
          <div className="text-xs text-gray-400 mt-1">Trade</div>
        </button>
        <button className="bg-card p-4 rounded-xl border border-gray-800 text-center hover:border-primary">
          <div className="text-accent text-2xl">💰</div>
          <div className="text-xs text-gray-400 mt-1">Deposit</div>
        </button>
        <button className="bg-card p-4 rounded-xl border border-gray-800 text-center hover:border-primary">
          <div className="text-yellow-400 text-2xl">🏦</div>
          <div className="text-xs text-gray-400 mt-1">Withdraw</div>
        </button>
      </div>

      {/* PNL Chart */}
      <div className="bg-card p-4 rounded-xl border border-gray-800 mb-4">
        <h3 className="text-gray-400 text-sm mb-2">Profit/Loss History</h3>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={120}>
            <LineChart data={chartData}>
              <XAxis dataKey="name" stroke="#444" fontSize={8} tick={false} />
              <YAxis stroke="#444" fontSize={8} hide />
              <Tooltip contentStyle={{ background: '#1A1730', border: 'none' }} />
              <Line type="monotone" dataKey="value" stroke="#6C3CE1" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 text-sm">No trades yet</p>
        )}
      </div>

      {/* Recent Trades */}
      <div className="bg-card p-4 rounded-xl border border-gray-800">
        <h3 className="text-gray-400 text-sm mb-2">Recent Trades</h3>
        {trades.length === 0 ? (
          <p className="text-gray-500 text-sm">No trades yet</p>
        ) : (
          trades.map((t, i) => (
            <div key={i} className="flex justify-between py-2 border-b border-gray-800 text-sm">
              <span className={t.side === 'buy' ? 'text-green-400' : 'text-red-400'}>
                {t.side.toUpperCase()}
              </span>
              <span className="text-gray-400">${t.entryPrice?.toFixed(2)}</span>
              <span className={t.pnl >= 0 ? 'text-green-400' : 'text-red-400'}>
                ${t.pnl?.toFixed(2) || '0.00'}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}