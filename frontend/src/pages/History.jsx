import React, { useState, useEffect } from 'react';
import api from '../utils/api';

export default function History() {
  const [transactions, setTransactions] = useState([]);
  const [trades, setTrades] = useState([]);

  useEffect(() => {
    api.get('/user/transactions').then(res => setTransactions(res.data));
    api.get('/user/trades').then(res => setTrades(res.data));
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold text-primary mb-4">History</h2>

      <h3 className="text-gray-400 text-sm mb-2">Transactions</h3>
      <div className="bg-card rounded-xl border border-gray-800 p-2 mb-4 max-h-60 overflow-y-auto">
        {transactions.length === 0 ? <p className="text-gray-500 text-sm p-2">No transactions</p> : (
          transactions.map((tx, i) => (
            <div key={i} className="flex justify-between py-2 px-2 border-b border-gray-800 text-sm">
              <span className={`text-xs px-2 py-0.5 rounded-full ${tx.type === 'deposit' ? 'bg-green-900/50 text-green-400' : tx.type === 'profit' ? 'bg-blue-900/50 text-blue-400' : tx.type === 'fee' ? 'bg-yellow-900/50 text-yellow-400' : 'bg-red-900/50 text-red-400'}`}>
                {tx.type}
              </span>
              <span className="text-white">${tx.amount?.toFixed(2)}</span>
              <span className="text-gray-500 text-xs">{new Date(tx.createdAt).toLocaleDateString()}</span>
            </div>
          ))
        )}
      </div>

      <h3 className="text-gray-400 text-sm mb-2">Trades</h3>
      <div className="bg-card rounded-xl border border-gray-800 p-2 max-h-60 overflow-y-auto">
        {trades.length === 0 ? <p className="text-gray-500 text-sm p-2">No trades</p> : (
          trades.map((t, i) => (
            <div key={i} className="flex justify-between py-2 px-2 border-b border-gray-800 text-sm">
              <span className={t.side === 'buy' ? 'text-green-400' : 'text-red-400'}>{t.side.toUpperCase()}</span>
              <span className="text-gray-400">${t.entryPrice?.toFixed(2)}</span>
              <span className={t.pnl >= 0 ? 'text-green-400' : 'text-red-400'}>${t.pnl?.toFixed(2) || '0.00'}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}