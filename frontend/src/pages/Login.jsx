import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { username, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark px-4">
      <div className="bg-card p-8 rounded-2xl w-full max-w-md border border-primary/20 shadow-xl">
        <h1 className="text-3xl font-bold text-center text-primary">VenuxGuru</h1>
        <p className="text-center text-gray-400 mt-1">Sign in to your account</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} className="w-full p-3 rounded-lg bg-dark border border-gray-700 text-white focus:border-primary outline-none" required />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-3 rounded-lg bg-dark border border-gray-700 text-white focus:border-primary outline-none" required />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" className="w-full py-3 rounded-lg bg-primary hover:bg-primary/80 text-white font-semibold transition">Login</button>
        </form>
        <p className="text-center text-gray-400 mt-4 text-sm">No account? <Link to="/register" className="text-primary">Register</Link></p>
      </div>
    </div>
  );
}