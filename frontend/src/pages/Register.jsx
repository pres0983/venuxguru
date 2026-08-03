import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';

export default function Register() {
  const [form, setForm] = useState({ fullname: '', username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/register', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark px-4">
      <div className="bg-card p-8 rounded-2xl w-full max-w-md border border-primary/20 shadow-xl">
        <h1 className="text-3xl font-bold text-center text-primary">VenuxGuru</h1>
        <p className="text-center text-gray-400 mt-1">Create your account</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-3">
          <input type="text" placeholder="Full Name" value={form.fullname} onChange={e => setForm({...form, fullname: e.target.value})} className="w-full p-3 rounded-lg bg-dark border border-gray-700 text-white focus:border-primary outline-none" required />
          <input type="text" placeholder="Username" value={form.username} onChange={e => setForm({...form, username: e.target.value})} className="w-full p-3 rounded-lg bg-dark border border-gray-700 text-white focus:border-primary outline-none" required />
          <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full p-3 rounded-lg bg-dark border border-gray-700 text-white focus:border-primary outline-none" required />
          <input type="password" placeholder="Password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="w-full p-3 rounded-lg bg-dark border border-gray-700 text-white focus:border-primary outline-none" required />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" className="w-full py-3 rounded-lg bg-primary hover:bg-primary/80 text-white font-semibold transition">Register</button>
        </form>
        <p className="text-center text-gray-400 mt-4 text-sm">Already have an account? <Link to="/login" className="text-primary">Login</Link></p>
      </div>
    </div>
  );
}