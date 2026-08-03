import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaWallet, FaHistory, FaUser, FaSignOutAlt } from 'react-icons/fa';

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav className="bg-card border-b border-gray-800 p-3 flex items-center justify-between">
      <Link to="/" className="text-2xl font-bold text-primary">VenuxGuru</Link>
      <div className="flex items-center gap-4 text-gray-400">
        <Link to="/" className="hover:text-white"><FaHome /></Link>
        <Link to="/deposit" className="hover:text-white"><FaWallet /></Link>
        <Link to="/history" className="hover:text-white"><FaHistory /></Link>
        <span className="text-sm text-white hidden md:inline">{user.username}</span>
        <button onClick={logout} className="hover:text-red-400"><FaSignOutAlt /></button>
      </div>
    </nav>
  );
}