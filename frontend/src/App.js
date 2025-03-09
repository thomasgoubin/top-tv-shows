import React, { useState, useEffect } from 'react';
import './App.css';
import ShowList from './components/ShowList';
import PlatformSelector from './components/PlatformSelector';
import TimeframeSelector from './components/TimeframeSelector';
import CountrySelector from './components/CountrySelector';
import Header from './components/Header';

function App() {
  const [platform, setPlatform] = useState('netflix');
  const [timeframe, setTimeframe] = useState('week');
  const [country, setCountry] = useState('fr'); // France par défaut
  const [countries, setCountries] = useState([]);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [warning, setWarning] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Fetch available countries when component mounts
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('/api/countries');
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }
        const data = await response.json();
        setCountries(data.countries || []);
      } catch (err) {
        console.error('Failed to fetch countries:', err);
        // Use default countries in case of error
        setCountries([
          { code: 'fr', name: 'France' },
          { code: 'us', name: 'États-Unis' },
          { code: 'gb', name: 'Royaume-Uni' }
        ]);
      }
    };
    
    fetchCountries();
  }, []);

  // Fetch shows when platform, timeframe or country changes
  useEffect(() => {
    fetchShows();
  }, [platform, timeframe, country]);

  // Apply dark mode class to body
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  const fetchShows = async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);
      setWarning(null);
      
      if (forceRefresh) {
        setIsRefreshing(true);
      }

      const queryParams = new URLSearchParams({
        platform,
        timeframe,
        country,
        refresh: forceRefresh ? 'true' : 'false'
      });

      const endpoint = forceRefresh 
        ? `/api/refresh?${queryParams}` 
        : `/api/shows?${queryParams}`;
      
      const method = forceRefresh ? 'POST' : 'GET';

      const response = await fetch(endpoint, { method });
      
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      
      const data = await response.json();

      // Check for warning message from the API
      if (data.warning) {
        setWarning(data.warning);
      }
      
      setShows(data.shows || []);
      if (data.cachedTimestamp) {
        setLastUpdated(new Date(data.cachedTimestamp));
      }
    } catch (err) {
      setError(`Failed to fetch shows: ${err.message}`);
      console.error(err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchShows(true);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`App ${isDarkMode ? 'dark-mode' : ''}`}>
      <Header />
      
      <div className="controls">
        <PlatformSelector 
          platform={platform} 
          setPlatform={setPlatform} 
        />
        
        <TimeframeSelector 
          timeframe={timeframe} 
          setTimeframe={setTimeframe} 
        />
        
        <CountrySelector
          country={country}
          setCountry={setCountry}
          countries={countries}
        />
        
        <button 
          className="refresh-button" 
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
        </button>

        <div className="theme-switch">
          <span>{isDarkMode ? '🌙' : '☀️'}</span>
          <label className="switch">
            <input 
              type="checkbox" 
              checked={isDarkMode}
              onChange={toggleDarkMode}
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>
      
      {lastUpdated && (
        <div className="last-updated">
          Last updated: {lastUpdated.toLocaleString()}
          {country && <span> | Pays: {countries.find(c => c.code === country)?.name || country}</span>}
        </div>
      )}
      
      {warning && <div className="warning-message">{warning}</div>}
      
      {error && <div className="error-message">{error}</div>}
      
      <ShowList shows={shows} loading={loading} isDarkMode={isDarkMode} />
    </div>
  );
}

export default App; 