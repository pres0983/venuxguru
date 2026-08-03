import React, { useState } from 'react';
import api from '../utils/api';
import Navbar from '../components/Navbar';

export default function Withdraw() {
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/withdrawal/request', { address, amount: Number(amount) });
      setMsg('Withdrawal request submitted. Pending approval.');
      setAddress('');
      setAmount('');
    } catch (err) {
      setMsg(err.response?.data?.error || 'Error');
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-4 md:p-6 max-w-2xl mx-auto">
        <div className="bg-card p-6 rounded-xl border border-gray-800">
          <h2 className="text-2xl font-bold text-primary mb-2">Withdraw</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" placeholder="Wallet Address" value={address} onChange={e => setAddress(e.target.value)} className="w-full p-3 rounded-lg bg-dark border border-gray-700 text-white focus:border-primary outline-none" required />
            <input type="number" placeholder="Amount (USDT)" value={amount} onChange={e => setAmount(e.target.value)} className="w-full p-3 rounded-lg bg-dark border border-gray-700 text-white focus:border-primary outline-none" min="10" required />
            <button type="submit" className="w-full py-3 rounded-lg bg-primary hover:bg-primary/80 text-white font-semibold transition">Request Withdrawal</button>
          </form>
          {msg && <p className="mt-3 text-sm text-accent">{msg}</p>}
          <p className="text-gray-500 text-xs mt-2">Min withdrawal: 10 USDT. Manual approval may take 24-48 hours.</p>
        </div>
      </div>
    </>
  );
}