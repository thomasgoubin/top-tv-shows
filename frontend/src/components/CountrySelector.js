import React from 'react';
import './CountrySelector.css';

function CountrySelector({ country, setCountry, countries }) {
  return (
    <div className="selector">
      <label htmlFor="country-select">Pays</label>
      <select 
        id="country-select"
        value={country}
        onChange={(e) => setCountry(e.target.value)}
      >
        {countries.map((countryItem) => (
          <option key={countryItem.code} value={countryItem.code}>
            {countryItem.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default CountrySelector; 