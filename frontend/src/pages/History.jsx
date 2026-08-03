import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Navbar from '../components/Navbar';

export default function History() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    api.get('/user/transactions').then(res => setTransactions(res.data));
  }, []);

  return (
    <>
      <Navbar />
      <div className="p-4 md:p-6 max-w-4xl mx-auto">
        <div className="bg-card p-6 rounded-xl border border-gray-800">
          <h2 className="text-2xl font-bold text-primary mb-4">Transaction History</h2>
          {transactions.length === 0 ? <p className="text-gray-500">No transactions</p> : (
            <div className="space-y-2">
              {transactions.map((tx, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-gray-800 text-sm">
                  <div>
                    <span className={`px-2 py-1 rounded-full text-xs ${tx.type === 'deposit' ? 'bg-green-900/50 text-green-400' : tx.type === 'profit' ? 'bg-blue-900/50 text-blue-400' : 'bg-red-900/50 text-red-400'}`}>{tx.type}</span>
                    <span className="text-gray-400 ml-2">{tx.description || ''}</span>
                  </div>
                  <span className={`font-semibold ${tx.type === 'withdraw' ? 'text-red-400' : 'text-accent'}`}>${tx.amount?.toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}