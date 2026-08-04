import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Navbar from '../components/Navbar';

export default function AdminNotifications() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ userId: '', title: '', message: '' });
  const [sent, setSent] = useState([]);
  const basic = btoa('admin:VenuxAdmin2026!');

  useEffect(() => {
    api.get('/admin/users', { headers: { Authorization: `Basic ${basic}` } }).then(res => setUsers(res.data));
    api.get('/admin/notifications', { headers: { Authorization: `Basic ${basic}` } }).then(res => setSent(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post('/admin/notifications', form, { headers: { Authorization: `Basic ${basic}` } });
    alert('Notification sent');
    setForm({ userId: '', title: '', message: '' });
  };

  return (
    <>
      <Navbar />
      <div className="p-4 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-primary mb-4">Send Notification</h2>
        <form onSubmit={handleSubmit} className="bg-card p-4 rounded-xl border border-gray-800 space-y-3">
          <select value={form.userId} onChange={e => setForm({...form, userId: e.target.value})} className="w-full p-3 rounded-lg bg-dark border border-gray-700 text-white">
            <option value="">All Users (Global)</option>
            {users.map(u => <option key={u._id} value={u._id}>{u.username}</option>)}
          </select>
          <input type="text" placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full p-3 rounded-lg bg-dark border border-gray-700 text-white" required />
          <textarea placeholder="Message" value={form.message} onChange={e => setForm({...form, message: e.target.value})} className="w-full p-3 rounded-lg bg-dark border border-gray-700 text-white h-24" required />
          <button type="submit" className="w-full py-3 rounded-lg bg-primary text-white font-semibold">Send</button>
        </form>

        <h3 className="text-gray-400 text-sm mt-4 mb-2">Sent Notifications</h3>
        {sent.map(n => (
          <div key={n._id} className="bg-card p-3 rounded-xl border border-gray-800 mb-2">
            <div className="font-semibold text-white">{n.title}</div>
            <div className="text-sm text-gray-400">{n.message}</div>
            <div className="text-xs text-gray-500 mt-1">{n.userId ? 'User' : 'Global'} • {new Date(n.createdAt).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </>
  );
}