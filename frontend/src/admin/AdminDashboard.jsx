import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import { FaUsers, FaWallet, FaChartLine, FaCog } from 'react-icons/fa';

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const token = localStorage.getItem('token');

  useEffect(() => {
    const basic = btoa('admin:VenuxAdmin2026!');
    api.get('/admin/dashboard', { headers: { Authorization: `Basic ${basic}` } }).then(res => setStats(res.data));
  }, []);

  return (
    <>
      <Navbar />
      <div className="p-4 md:p-6 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-primary mb-4">Admin Dashboard</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-card p-4 rounded-xl border border-gray-800"><FaUsers className="text-blue-400 text-xl" /><div className="text-2xl font-bold">{stats.totalUsers || 0}</div><div className="text-gray-400 text-sm">Users</div></div>
          <div className="bg-card p-4 rounded-xl border border-gray-800"><FaWallet className="text-accent text-xl" /><div className="text-2xl font-bold">${stats.totalBalance?.toFixed(2) || '0'}</div><div className="text-gray-400 text-sm">Total Balance</div></div>
          <div className="bg-card p-4 rounded-xl border border-gray-800"><FaChartLine className="text-green-400 text-xl" /><div className="text-2xl font-bold">${stats.totalDeposits?.toFixed(2) || '0'}</div><div className="text-gray-400 text-sm">Deposits</div></div>
          <div className="bg-card p-4 rounded-xl border border-gray-800"><FaCog className="text-purple-400 text-xl" /><div className="text-2xl font-bold">{stats.openTrades || 0}</div><div className="text-gray-400 text-sm">Open Trades</div></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <Link to="/admin/users" className="bg-card p-4 rounded-xl border border-gray-800 text-center hover:border-primary">👥 Users</Link>
          <Link to="/admin/withdrawals" className="bg-card p-4 rounded-xl border border-gray-800 text-center hover:border-primary">💸 Withdrawals</Link>
          <Link to="/admin/settings" className="bg-card p-4 rounded-xl border border-gray-800 text-center hover:border-primary">⚙️ Bot Settings</Link>
        </div>
      </div>
    </>
  );
}