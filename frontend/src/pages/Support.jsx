import React, { useState, useEffect } from 'react';
import api from '../utils/api';

export default function Support() {
  const [message, setMessage] = useState('');
  const [tickets, setTickets] = useState([]);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    api.get('/support').then(res => setTickets(res.data));
  }, [sent]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post('/support', { message });
    setMessage('');
    setSent(!sent);
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-primary mb-4">Support</h2>
      <div className="bg-card p-4 rounded-xl border border-gray-800 mb-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            placeholder="Describe your issue..."
            value={message}
            onChange={e => setMessage(e.target.value)}
            className="w-full p-3 rounded-lg bg-dark border border-gray-700 text-white focus:border-primary outline-none h-24"
            required
          />
          <button type="submit" className="w-full py-3 rounded-lg bg-primary hover:bg-primary/80 text-white font-semibold transition">
            Send Message
          </button>
        </form>
      </div>

      <div className="space-y-2">
        {tickets.map(t => (
          <div key={t._id} className="bg-card p-4 rounded-xl border border-gray-800">
            <div className="flex justify-between">
              <span className="text-sm text-gray-400">{new Date(t.createdAt).toLocaleString()}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${t.status === 'open' ? 'bg-yellow-900/50 text-yellow-400' : 'bg-green-900/50 text-green-400'}`}>
                {t.status}
              </span>
            </div>
            <div className="text-white text-sm mt-1">{t.message}</div>
            {t.reply && (
              <div className="mt-2 bg-dark p-2 rounded-lg text-sm text-gray-300 border-l-2 border-primary">
                <span className="text-primary">Admin:</span> {t.reply}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}