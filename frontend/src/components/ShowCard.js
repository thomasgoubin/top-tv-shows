import React from 'react';
import './ShowCard.css';

function ShowCard({ show, isDarkMode }) {
  // Handle missing image
  const posterUrl = show.ImageUrl || 'https://via.placeholder.com/300x450?text=No+Image';
  
  // Format IMDb rating with one decimal place
  const formattedRating = show.ImdbRating 
    ? parseFloat(show.ImdbRating).toFixed(1) 
    : 'N/A';

  return (
    <div className={`show-card ${isDarkMode ? 'dark' : ''}`}>
      <div className="show-card-image">
        <img src={posterUrl} alt={show.Title} />
        <div className="show-card-ratings">
          <div className="rating imdb-rating">
            <span>⭐ {formattedRating}</span>
          </div>
        </div>
      </div>
      
      <div className="show-card-content">
        <h3 className="show-card-title">{show.Title}</h3>
        <p className="show-card-year">{show.Year}</p>
        <p className="show-card-overview">
          {show.Overview 
            ? (show.Overview.length > 150 
                ? `${show.Overview.substring(0, 150)}...` 
                : show.Overview)
            : 'No description available.'}
        </p>
        
        <div className="card-links">
          <a 
            href={`https://www.imdb.com/title/${show.ImdbId}/`} 
            className="imdb-link" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            View on IMDb
          </a>
          <a 
            href={`https://www.rottentomatoes.com/search?search=${encodeURIComponent(show.Title)}`} 
            className="rt-link" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            Find on RT
          </a>
        </div>
      </div>
    </div>
  );
}

export default ShowCard; 