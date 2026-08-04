import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaChartLine, FaExchangeAlt, FaHistory, FaUser, FaBell, FaHeadset } from 'react-icons/fa';

export default function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const navItems = [
    { path: '/', icon: FaHome, label: 'Home' },
    { path: '/markets', icon: FaChartLine, label: 'Markets' },
    { path: '/trade', icon: FaExchangeAlt, label: 'Trade' },
    { path: '/history', icon: FaHistory, label: 'History' },
    { path: '/profile', icon: FaUser, label: 'Profile' },
  ];

  return (
    <div className="min-h-screen bg-dark flex flex-col">
      {/* Top Bar */}
      <div className="bg-card px-4 py-3 flex justify-between items-center border-b border-gray-800">
        <h1 className="text-xl font-bold text-primary">VenuxGuru</h1>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/support')} className="text-gray-400 hover:text-white">
            <FaHeadset size={18} />
          </button>
          <button onClick={() => navigate('/profile')} className="text-gray-400 hover:text-white relative">
            <FaBell size={18} />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-[8px] text-white flex items-center justify-center">3</span>
          </button>
          <span className="text-white text-sm font-medium">{user.username || 'Guest'}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 pb-24 overflow-y-auto">
        {children}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-gray-800 flex justify-around py-2 z-50">
        {navItems.map(({ path, icon: Icon, label }) => (
          <Link
            key={path}
            to={path}
            className={`flex flex-col items-center text-xs ${location.pathname === path ? 'text-primary' : 'text-gray-500'}`}
          >
            <Icon size={22} />
            <span className="mt-1">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}