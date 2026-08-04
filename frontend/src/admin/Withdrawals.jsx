import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Navbar from '../components/Navbar';

export default function Withdrawals() {
  const [list, setList] = useState([]);
  const basic = btoa('admin:VenuxAdmin2026!');

  const fetchData = () => {
    api.get('/admin/withdrawals', { headers: { Authorization: `Basic ${basic}` } }).then(res => setList(res.data));
  };

  useEffect(fetchData, []);

  const approve = async (id) => {
    await api.put(`/admin/withdrawals/${id}/approve`, {}, { headers: { Authorization: `Basic ${basic}` } });
    fetchData();
  };

  const reject = async (id) => {
    await api.put(`/admin/withdrawals/${id}/reject`, {}, { headers: { Authorization: `Basic ${basic}` } });
    fetchData();
  };

  return (
    <>
      <Navbar />
      <div className="p-4 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-primary mb-4">Pending Withdrawals</h2>
        {list.length === 0 ? <p className="text-gray-500">No pending requests</p> : (
          list.map(w => (
            <div key={w._id} className="bg-card p-4 rounded-xl border border-gray-800 mb-3 flex justify-between items-center">
              <div><span className="font-semibold">{w.userId?.username}</span><span className="text-gray-400 ml-2">${w.amount}</span></div>
              <div className="flex gap-2"><button onClick={() => approve(w._id)} className="px-4 py-1 rounded bg-accent text-dark font-semibold">Approve</button><button onClick={() => reject(w._id)} className="px-4 py-1 rounded bg-red-600 text-white">Reject</button></div>
            </div>
          ))
        )}
      </div>
    </>
  );
}