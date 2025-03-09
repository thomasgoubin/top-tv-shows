import React from 'react';
import './PlatformSelector.css';

function PlatformSelector({ platform, setPlatform }) {
  const platforms = [
    { id: 'netflix', name: 'Netflix' },
    { id: 'prime', name: 'Prime Video' },
    { id: 'disney', name: 'Disney+' },
    { id: 'hbo', name: 'HBO Max' },
    { id: 'hulu', name: 'Hulu' },
    { id: 'apple', name: 'Apple TV+' },
    { id: 'paramount', name: 'Paramount+' },
  ];

  return (
    <div className="platform-selector">
      <label htmlFor="platform">Streaming Platform:</label>
      <select 
        id="platform"
        value={platform} 
        onChange={(e) => setPlatform(e.target.value)}
      >
        {platforms.map(p => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default PlatformSelector; 