import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Navbar from '../components/Navbar';

export default function AdminSupport() {
  const [tickets, setTickets] = useState([]);
  const [reply, setReply] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const basic = btoa('admin:VenuxAdmin2026!');

  useEffect(() => {
    api.get('/admin/support', { headers: { Authorization: `Basic ${basic}` } }).then(res => setTickets(res.data));
  }, []);

  const handleReply = async (id) => {
    await api.put(`/admin/support/${id}/reply`, { reply }, { headers: { Authorization: `Basic ${basic}` } });
    setReply('');
    setSelectedId(null);
    const res = await api.get('/admin/support', { headers: { Authorization: `Basic ${basic}` } });
    setTickets(res.data);
  };

  return (
    <>
      <Navbar />
      <div className="p-4 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-primary mb-4">Support Tickets</h2>
        {tickets.map(t => (
          <div key={t._id} className="bg-card p-4 rounded-xl border border-gray-800 mb-3">
            <div className="flex justify-between">
              <span className="font-semibold text-white">{t.userId?.username}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${t.status === 'open' ? 'bg-yellow-900/50 text-yellow-400' : 'bg-green-900/50 text-green-400'}`}>{t.status}</span>
            </div>
            <div className="text-gray-300 text-sm mt-1">{t.message}</div>
            {t.reply && <div className="mt-2 bg-dark p-2 rounded-lg text-sm text-gray-300 border-l-2 border-primary">Admin: {t.reply}</div>}
            {t.status === 'open' && (
              <div className="mt-2 flex gap-2">
                <input type="text" placeholder="Reply..." value={reply} onChange={e => setReply(e.target.value)} className="flex-1 p-2 rounded-lg bg-dark border border-gray-700 text-white text-sm" />
                <button onClick={() => handleReply(t._id)} className="px-4 py-2 rounded-lg bg-primary text-white text-sm">Send</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}