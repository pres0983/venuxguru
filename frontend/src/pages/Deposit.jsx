import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Layout from '../components/Layout';

export default function Deposit() {
  const [address, setAddress] = useState('');

  useEffect(() => {
    api.get('/deposit/address').then(res => setAddress(res.data.address));
  }, []);

  return (
    <Layout>
      <div className="p-4">
        <div className="bg-card p-6 rounded-xl border border-gray-800">
          <h2 className="text-2xl font-bold text-primary mb-2">Deposit</h2>
          <p className="text-gray-400 mb-4">Send USDT (BEP20) to the address below</p>
          <div className="bg-dark p-4 rounded-lg border border-gray-700 break-all font-mono text-sm">{address || 'Loading...'}</div>
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div className="bg-dark p-3 rounded-lg"><span className="text-gray-400">Min Deposit</span><br />10 USDT</div>
            <div className="bg-dark p-3 rounded-lg"><span className="text-gray-400">Network</span><br />BEP20 (BSC)</div>
          </div>
          <p className="text-gray-500 text-xs mt-4">Funds are credited automatically after 1-3 confirmations</p>
        </div>
      </div>
    </Layout>
  );
}