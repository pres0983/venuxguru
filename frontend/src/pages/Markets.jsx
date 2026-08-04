import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { FaStar } from 'react-icons/fa';

export default function Markets() {
  const [prices, setPrices] = useState([]);
  const [favorites, setFavorites] = useState(['BTC', 'ETH', 'BNB']);

  useEffect(() => {
    const symbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'XRPUSDT', 'ADAUSDT'];
    Promise.all(symbols.map(s =>
      fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${s}`).then(r => r.json())
    )).then(data => setPrices(data));
  }, []);

  const toggleFavorite = (symbol) => {
    setFavorites(prev =>
      prev.includes(symbol) ? prev.filter(s => s !== symbol) : [...prev, symbol]
    );
  };

  return (
    <div>
      <div className="flex gap-2 mb-4 overflow-x-auto">
        {['Favorites', 'Hot', 'TradFi', 'Alpha', 'New'].map(tab => (
          <button key={tab} className="px-4 py-1 rounded-full text-sm bg-card border border-gray-700 text-gray-300 whitespace-nowrap">
            {tab}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {prices.map((p, i) => (
          <div key={i} className="bg-card p-4 rounded-xl border border-gray-800 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <button onClick={() => toggleFavorite(p.symbol.replace('USDT', ''))}>
                <FaStar className={favorites.includes(p.symbol.replace('USDT', '')) ? 'text-yellow-400' : 'text-gray-600'} />
              </button>
              <div>
                <div className="font-semibold text-white">{p.symbol.replace('USDT', '')}</div>
                <div className="text-xs text-gray-500">${p.lastPrice}</div>
              </div>
            </div>
            <div className={`text-sm font-semibold ${parseFloat(p.priceChangePercent) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {parseFloat(p.priceChangePercent).toFixed(2)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}