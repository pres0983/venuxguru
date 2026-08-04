import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import { FaUsers, FaWallet, FaChartLine, FaCog, FaBell, FaHeadset } from 'react-icons/fa';

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const basic = btoa('admin:VenuxAdmin2026!');

  useEffect(() => {
    api.get('/admin/dashboard', { headers: { Authorization: `Basic ${basic}` } }).then(res => setStats(res.data));
  }, []);

  const cards = [
    { icon: FaUsers, label: 'Users', value: stats.totalUsers || 0, color: 'text-blue-400' },
    { icon: FaWallet, label: 'Total Balance', value: `$${stats.totalBalance?.toFixed(2) || '0'}`, color: 'text-accent' },
    { icon: FaChartLine, label: 'Deposits', value: `$${stats.totalDeposits?.toFixed(2) || '0'}`, color: 'text-green-400' },
    { icon: FaCog, label: 'Open Trades', value: stats.openTrades || 0, color: 'text-purple-400' },
  ];

  const links = [
    { to: '/admin/users', label: '👥 Users' },
    { to: '/admin/withdrawals', label: '💸 Withdrawals' },
    { to: '/admin/settings', label: '⚙️ Bot Settings' },
    { to: '/admin/notifications', label: '🔔 Notifications' },
    { to: '/admin/support', label: '💬 Support' },
  ];

  return (
    <>
      <Navbar />
      <div className="p-4 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-primary mb-4">Admin Dashboard</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {cards.map((c, i) => (
            <div key={i} className="bg-card p-4 rounded-xl border border-gray-800">
              <c.icon className={`${c.color} text-xl`} />
              <div className="text-2xl font-bold text-white">{c.value}</div>
              <div className="text-gray-400 text-sm">{c.label}</div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {links.map((l, i) => (
            <Link key={i} to={l.to} className="bg-card p-4 rounded-xl border border-gray-800 text-center hover:border-primary text-gray-300">
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}