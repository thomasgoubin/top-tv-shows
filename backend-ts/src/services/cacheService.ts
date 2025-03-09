import fs from 'fs';
import path from 'path';
import { CachedData, Cache, Show } from '../models/types';

const CACHE_DIR = path.join(process.cwd(), 'cache');
// 12 hours cache validity to minimize API calls (more conservative)
const CACHE_VALIDITY_MS = 12 * 60 * 60 * 1000;

// Ensure cache directory exists
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

// In-memory cache
let cache: Cache = {};

/**
 * Initialize the cache service by loading cached data from disk
 */
export function initCache(): void {
  try {
    const files = fs.readdirSync(CACHE_DIR);
    
    files.forEach(file => {
      if (!file.endsWith('.json')) return;

      const filePath = path.join(CACHE_DIR, file);
      const data = fs.readFileSync(filePath, 'utf8');
      
      try {
        const cachedData = JSON.parse(data) as CachedData;
        // Convert string timestamp to Date
        cachedData.timestamp = new Date(cachedData.timestamp);
        
        const key = file.replace('.json', '');
        cache[key] = cachedData;
      } catch (err) {
        console.error(`Error parsing cache file ${file}:`, err);
      }
    });
    
    console.log(`Loaded ${Object.keys(cache).length} items from cache`);
  } catch (err) {
    console.error('Error loading cache from disk:', err);
  }
}

/**
 * Get cached data for a key
 */
export function getCachedData(key: string): CachedData | null {
  return cache[key] || null;
}

/**
 * Set data in the cache
 */
export function setCachedData(key: string, shows: Show[]): CachedData {
  const timestamp = new Date();
  const cachedData: CachedData = {
    timestamp,
    shows
  };
  
  // Update in-memory cache
  cache[key] = cachedData;
  
  // Save to disk
  try {
    const filePath = path.join(CACHE_DIR, `${key}.json`);
    fs.writeFileSync(filePath, JSON.stringify(cachedData, null, 2));
    console.log(`Cache updated for ${key}`);
  } catch (err) {
    console.error(`Error saving cache for key ${key}:`, err);
  }
  
  return cachedData;
}

/**
 * Check if cached data is still valid (less than configured hours old)
 */
export function isCacheValid(cachedData: CachedData): boolean {
  const now = new Date();
  const cacheAge = now.getTime() - cachedData.timestamp.getTime();
  
  // Cache is valid if it's less than configured time
  return cacheAge < CACHE_VALIDITY_MS;
}

/**
 * Return all platforms that have cached data
 */
export function getCachedPlatforms(): string[] {
  return Object.keys(cache)
    .map(key => key.split('-')[0])
    .filter((v, i, a) => a.indexOf(v) === i); // Get unique values
} 