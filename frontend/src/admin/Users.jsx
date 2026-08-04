import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Navbar from '../components/Navbar';

export default function Users() {
  const [users, setUsers] = useState([]);
  const basic = btoa('admin:VenuxAdmin2026!');

  useEffect(() => {
    api.get('/admin/users', { headers: { Authorization: `Basic ${basic}` } }).then(res => setUsers(res.data));
  }, []);

  const toggleSuspend = async (id) => {
    await api.put(`/admin/users/${id}/suspend`, {}, { headers: { Authorization: `Basic ${basic}` } });
    setUsers(users.map(u => u._id === id ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } : u));
  };

  return (
    <>
      <Navbar />
      <div className="p-4 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-primary mb-4">Users</h2>
        <div className="bg-card rounded-xl border border-gray-800 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-dark"><tr><th className="p-3 text-left">User</th><th className="p-3 text-left">Balance</th><th className="p-3 text-left">Status</th><th className="p-3 text-left">Action</th></tr></thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id} className="border-t border-gray-800"><td className="p-3">{u.username}</td><td className="p-3">${u.balance?.toFixed(2)}</td><td className="p-3"><span className={`px-2 py-1 rounded-full text-xs ${u.status === 'active' ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`}>{u.status}</span></td><td className="p-3"><button onClick={() => toggleSuspend(u._id)} className="text-xs px-3 py-1 rounded bg-gray-700 hover:bg-gray-600">{u.status === 'active' ? 'Suspend' : 'Activate'}</button></td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}