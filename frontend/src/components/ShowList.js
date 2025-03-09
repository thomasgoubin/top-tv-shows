import React from 'react';
import ShowCard from './ShowCard';
import './ShowList.css';

function ShowList({ shows, loading, isDarkMode }) {
  if (loading) {
    return (
      <div className="show-list-loading">
        <div className="spinner"></div>
        <p>Loading shows...</p>
      </div>
    );
  }
  
  if (!shows || shows.length === 0) {
    return (
      <div className="show-list-empty">
        <p>No shows found for the selected platform and timeframe.</p>
      </div>
    );
  }

  return (
    <div className="show-list">
      {shows.map(show => (
        <ShowCard key={show.ImdbId} show={show} isDarkMode={isDarkMode} />
      ))}
    </div>
  );
}

export default ShowList; 