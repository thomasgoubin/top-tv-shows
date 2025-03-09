import React from 'react';
import './TimeframeSelector.css';

function TimeframeSelector({ timeframe, setTimeframe }) {
  const timeframes = [
    { id: 'day', name: 'Today' },
    { id: 'week', name: 'This Week' },
    { id: 'past_week', name: 'Past Week' },
    { id: 'month', name: 'Past Month' },
    { id: 'year', name: 'Past Year' },
  ];

  return (
    <div className="timeframe-selector">
      <label htmlFor="timeframe">Time Period:</label>
      <select 
        id="timeframe"
        value={timeframe} 
        onChange={(e) => setTimeframe(e.target.value)}
      >
        {timeframes.map(t => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default TimeframeSelector; 