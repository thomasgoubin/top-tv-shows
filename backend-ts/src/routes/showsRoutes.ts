import { Router, Request, Response } from 'express';
import { fetchShows } from '../services/apiService';
import { getCachedData, setCachedData, isCacheValid, getCachedPlatforms } from '../services/cacheService';

const router = Router();

/**
 * GET /api/shows
 * Fetch shows based on platform, timeframe and country
 */
router.get('/shows', async (req: Request, res: Response) => {
  try {
    const platform = req.query.platform as string || 'netflix';
    const timeframe = req.query.timeframe as string || 'week';
    const country = req.query.country as string || 'fr'; // Default to France
    const forceRefresh = req.query.refresh === 'true';
    
    const cacheKey = `${platform}-${timeframe}-${country}`;
    
    if (!forceRefresh) {
      // Check cache first
      const cachedData = getCachedData(cacheKey);
      
      if (cachedData && isCacheValid(cachedData)) {
        console.log(`Returning cached data for ${cacheKey}`);
        return res.json({
          shows: cachedData.shows,
          cachedTimestamp: cachedData.timestamp,
          fromCache: true,
          country
        });
      }
    }
    
    try {
      // Fetch fresh data from API
      const shows = await fetchShows(platform, timeframe, country);
      
      // Save to cache only if we got results
      if (shows && shows.length > 0) {
        const cachedData = setCachedData(cacheKey, shows);
        
        return res.json({
          shows,
          cachedTimestamp: cachedData.timestamp,
          fromCache: false,
          country
        });
      } else {
        // If API returned no shows but we have cached data, return it with a warning
        const cachedData = getCachedData(cacheKey);
        if (cachedData) {
          console.log(`API returned no shows for ${cacheKey}, using cached data`);
          return res.json({
            shows: cachedData.shows,
            cachedTimestamp: cachedData.timestamp,
            fromCache: true,
            country,
            warning: "API returned no results, showing cached data"
          });
        }
        
        // No data at all
        return res.json({
          shows: [],
          country,
          warning: "No shows found for this platform and timeframe"
        });
      }
    } catch (error) {
      console.error('Error fetching from API:', error);
      
      // If API request fails but we have cached data, return it with a warning
      const cachedData = getCachedData(cacheKey);
      if (cachedData) {
        console.log(`API request failed for ${cacheKey}, using cached data`);
        return res.json({
          shows: cachedData.shows,
          cachedTimestamp: cachedData.timestamp,
          fromCache: true,
          country,
          warning: "Could not refresh data from API, showing cached data"
        });
      }
      
      // No cached data to fall back to
      throw error;
    }
  } catch (error) {
    console.error('Error in shows endpoint:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch shows',
      message: error instanceof Error ? error.message : String(error)
    });
  }
});

/**
 * POST /api/refresh
 * Force refresh shows data
 */
router.post('/refresh', async (req: Request, res: Response) => {
  try {
    const platform = req.query.platform as string;
    const timeframe = req.query.timeframe as string;
    const country = req.query.country as string || 'fr'; // Default to France
    
    if (!platform || !timeframe) {
      return res.status(400).json({ error: 'Platform and timeframe are required' });
    }
    
    try {
      // Fetch fresh data from API
      const shows = await fetchShows(platform, timeframe, country);
      
      // Save to cache
      const cacheKey = `${platform}-${timeframe}-${country}`;
      const cachedData = setCachedData(cacheKey, shows);
      
      return res.json({
        shows,
        cachedTimestamp: cachedData.timestamp,
        fromCache: false,
        country
      });
    } catch (error) {
      console.error('Error fetching from API:', error);
      
      // If API request fails but we have cached data, return it with a warning
      const cacheKey = `${platform}-${timeframe}-${country}`;
      const cachedData = getCachedData(cacheKey);
      if (cachedData) {
        return res.json({
          shows: cachedData.shows,
          cachedTimestamp: cachedData.timestamp,
          fromCache: true,
          country,
          warning: "Could not refresh data from API, showing cached data"
        });
      }
      
      // No cached data to fall back to
      throw error;
    }
  } catch (error) {
    console.error('Error refreshing shows:', error);
    return res.status(500).json({ 
      error: 'Failed to refresh shows',
      message: error instanceof Error ? error.message : String(error)
    });
  }
});

/**
 * GET /api/cached-platforms
 * Return all platforms that have cached data
 */
router.get('/cached-platforms', (req: Request, res: Response) => {
  const platforms = getCachedPlatforms();
  res.json({ platforms });
});

/**
 * GET /api/countries
 * Return list of available countries
 */
router.get('/countries', (_req: Request, res: Response) => {
  // Liste des pays les plus courants disponibles dans l'API
  const countries = [
    { code: 'fr', name: 'France' },
    { code: 'us', name: 'États-Unis' },
    { code: 'gb', name: 'Royaume-Uni' },
    { code: 'de', name: 'Allemagne' },
    { code: 'es', name: 'Espagne' },
    { code: 'it', name: 'Italie' },
    { code: 'ca', name: 'Canada' },
    { code: 'au', name: 'Australie' },
    { code: 'jp', name: 'Japon' },
    { code: 'br', name: 'Brésil' }
  ];
  
  res.json({ countries });
});

export default router; 