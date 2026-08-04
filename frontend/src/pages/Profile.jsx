import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { FaUser, FaWallet, FaHistory, FaSignOutAlt } from 'react-icons/fa';

export default function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/user/me').then(res => setUser(res.data));
  }, []);

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const menuItems = [
    { icon: FaWallet, label: 'Balance', value: `$${user?.balance?.toFixed(2) || '0.00'}` },
    { icon: FaHistory, label: 'Total Deposits', value: `$${user?.totalDeposits?.toFixed(2) || '0.00'}` },
    { icon: FaHistory, label: 'Total Withdrawals', value: `$${user?.totalWithdrawals?.toFixed(2) || '0.00'}` },
    { icon: FaUser, label: 'Username', value: user?.username },
    { icon: FaUser, label: 'Email', value: user?.email },
  ];

  return (
    <div>
      <div className="bg-card p-5 rounded-xl border border-gray-800 text-center mb-4">
        <div className="w-20 h-20 bg-primary/20 rounded-full mx-auto flex items-center justify-center text-3xl text-primary">
          {user?.fullname?.charAt(0) || 'U'}
        </div>
        <div className="text-xl font-bold text-white mt-2">{user?.fullname}</div>
        <div className="text-sm text-gray-400">@{user?.username}</div>
      </div>

      <div className="space-y-2">
        {menuItems.map((item, i) => (
          <div key={i} className="bg-card p-4 rounded-xl border border-gray-800 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <item.icon className="text-gray-400" />
              <span className="text-gray-300">{item.label}</span>
            </div>
            <span className="text-white font-semibold">{item.value}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 space-y-2">
        <button onClick={() => navigate('/support')} className="w-full bg-card p-4 rounded-xl border border-gray-800 text-left text-gray-300 hover:border-primary">💬 Support</button>
        <button onClick={() => navigate('/education')} className="w-full bg-card p-4 rounded-xl border border-gray-800 text-left text-gray-300 hover:border-primary">📚 Education</button>
        <button onClick={logout} className="w-full bg-red-500/10 p-4 rounded-xl border border-red-500/30 text-left text-red-400 hover:bg-red-500/20">
          <FaSignOutAlt className="inline mr-2" /> Logout
        </button>
      </div>
    </div>
  );
}