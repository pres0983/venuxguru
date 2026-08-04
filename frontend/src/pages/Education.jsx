import React from 'react';

const articles = [
  { title: 'What is Crypto Trading?', content: 'Crypto trading involves buying and selling digital assets on exchanges. Prices are driven by supply, demand, news, and market sentiment.' },
  { title: 'Understanding RSI', content: 'RSI (Relative Strength Index) measures momentum. Values below 30 indicate oversold (buy signal), above 70 indicate overbought (sell signal).' },
  { title: 'EMA Strategy', content: 'Exponential Moving Average (EMA) gives more weight to recent prices. A crossover of fast EMA above slow EMA signals an uptrend.' },
  { title: 'Risk Management', content: 'Never risk more than 2% of your portfolio per trade. Use stop-loss orders to limit losses and take-profit orders to secure gains.' },
  { title: 'Market Sentiment', content: 'Fear and greed drive crypto markets. Use tools like the Fear & Greed Index to gauge market psychology.' },
];

export default function Education() {
  return (
    <div>
      <h2 className="text-xl font-bold text-primary mb-4">📚 Trading Education</h2>
      <div className="space-y-3">
        {articles.map((a, i) => (
          <div key={i} className="bg-card p-4 rounded-xl border border-gray-800">
            <h3 className="text-white font-semibold">{a.title}</h3>
            <p className="text-gray-400 text-sm mt-1">{a.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}