import React, { useState, useEffect } from 'react';
import api from '../utils/api';

export default function Trade() {
  const [user, setUser] = useState(null);
  const [position, setPosition] = useState(null);
  const [trades, setTrades] = useState([]);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(u);
    api.get('/user/me').then(res => setUser(res.data));
    api.get('/user/trades').then(res => {
      const open = res.data.find(t => t.status === 'open');
      setPosition(open || null);
      setTrades(res.data);
    });
  }, []);

  const toggleAutoTrade = async () => {
    await api.post('/user/toggle-autotrade');
    const res = await api.get('/user/me');
    setUser(res.data);
  };

  const totalPnl = trades.reduce((sum, t) => sum + (t.pnl || 0), 0);

  return (
    <div>
      <div className="bg-card p-5 rounded-xl border border-gray-800 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-sm">Auto-Trade</span>
          <button
            onClick={toggleAutoTrade}
            className={`px-6 py-2 rounded-full text-sm font-semibold ${user?.autotrade ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-300'}`}
          >
            {user?.autotrade ? 'ON' : 'OFF'}
          </button>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
          <div className="bg-dark p-3 rounded-lg">
            <span className="text-gray-400">Balance</span>
            <div className="text-white font-semibold">${user?.balance?.toFixed(2) || '0.00'}</div>
          </div>
          <div className="bg-dark p-3 rounded-lg">
            <span className="text-gray-400">Total PnL</span>
            <div className={`font-semibold ${totalPnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              ${totalPnl.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {position ? (
        <div className="bg-card p-4 rounded-xl border border-yellow-500/30 mb-4">
          <div className="flex justify-between">
            <span className="text-yellow-400 text-sm">Open Position</span>
            <span className="text-sm text-gray-400">{position.side.toUpperCase()} @ ${position.entryPrice?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-gray-400">Volume</span>
            <span className="text-white">{position.volume?.toFixed(4)} BTC</span>
          </div>
        </div>
      ) : (
        <div className="bg-card p-4 rounded-xl border border-gray-800 text-center text-gray-400 text-sm mb-4">
          No open position
        </div>
      )}

      <div className="bg-card p-4 rounded-xl border border-gray-800">
        <h3 className="text-gray-400 text-sm mb-2">Quick Stats</h3>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-dark p-2 rounded-lg">
            <div className="text-xs text-gray-500">Win Rate</div>
            <div className="text-white font-semibold">68%</div>
          </div>
          <div className="bg-dark p-2 rounded-lg">
            <div className="text-xs text-gray-500">Today's Trades</div>
            <div className="text-white font-semibold">3</div>
          </div>
          <div className="bg-dark p-2 rounded-lg">
            <div className="text-xs text-gray-500">Daily Target</div>
            <div className="text-white font-semibold">5%</div>
          </div>
        </div>
      </div>
    </div>
  );
}