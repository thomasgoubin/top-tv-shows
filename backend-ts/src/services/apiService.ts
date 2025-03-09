import axios, { AxiosResponse } from 'axios';
import { Show } from '../models/types';

const API_HOST = 'streaming-availability.p.rapidapi.com';
const API_BASE_URL = 'https://streaming-availability.p.rapidapi.com';

// Pays par défaut (France)
const DEFAULT_COUNTRY = 'fr';

// Real popular TV shows on different platforms
const POPULAR_SHOWS = {
  netflix: [
    { id: "62286", title: "Breaking Bad" },
    { id: "63351", title: "Stranger Things" },
    { id: "63174", title: "The Crown" },
    { id: "63248", title: "Black Mirror" },
    { id: "63245", title: "Ozark" },
    { id: "63247", title: "Narcos" },
    { id: "63220", title: "The Witcher" },
    { id: "62560", title: "Peaky Blinders" },
    { id: "63189", title: "Money Heist" },
    { id: "63339", title: "Mindhunter" }
  ],
  prime: [
    { id: "62234", title: "The Boys" },
    { id: "63330", title: "The Marvelous Mrs. Maisel" },
    { id: "62227", title: "Fleabag" },
    { id: "62277", title: "Jack Ryan" },
    { id: "62123", title: "The Expanse" },
    { id: "62345", title: "Good Omens" },
    { id: "62784", title: "Bosch" },
    { id: "62390", title: "Upload" },
    { id: "62891", title: "Homecoming" },
    { id: "63321", title: "The Grand Tour" }
  ],
  disney: [
    { id: "63327", title: "The Mandalorian" },
    { id: "63341", title: "WandaVision" },
    { id: "63194", title: "Loki" },
    { id: "63255", title: "The Falcon and the Winter Soldier" },
    { id: "65832", title: "Hawkeye" },
    { id: "63219", title: "Star Wars: The Clone Wars" },
    { id: "67023", title: "Moon Knight" },
    { id: "63257", title: "What If...?" },
    { id: "71326", title: "Andor" },
    { id: "71247", title: "Obi-Wan Kenobi" }
  ],
  hbo: [
    { id: "62164", title: "Game of Thrones" },
    { id: "62112", title: "Succession" },
    { id: "63155", title: "Westworld" },
    { id: "62121", title: "Barry" },
    { id: "63353", title: "Euphoria" },
    { id: "63309", title: "Chernobyl" },
    { id: "62825", title: "The Last of Us" },
    { id: "63254", title: "Watchmen" },
    { id: "62823", title: "True Detective" },
    { id: "62347", title: "Big Little Lies" }
  ],
  hulu: [
    { id: "62256", title: "The Handmaid's Tale" },
    { id: "62546", title: "Only Murders in the Building" },
    { id: "63125", title: "Castle Rock" },
    { id: "62980", title: "Ramy" },
    { id: "62117", title: "Pen15" },
    { id: "62453", title: "Dopesick" },
    { id: "62543", title: "Reservation Dogs" },
    { id: "62321", title: "The Great" },
    { id: "63152", title: "The Act" },
    { id: "62987", title: "Normal People" }
  ],
  apple: [
    { id: "62259", title: "Ted Lasso" },
    { id: "63158", title: "Severance" },
    { id: "63208", title: "The Morning Show" },
    { id: "63140", title: "Foundation" },
    { id: "62134", title: "For All Mankind" },
    { id: "63128", title: "Servant" },
    { id: "63135", title: "See" },
    { id: "63265", title: "Mythic Quest" },
    { id: "63147", title: "Pachinko" },
    { id: "62356", title: "Slow Horses" }
  ],
  paramount: [
    { id: "63205", title: "Yellowstone" },
    { id: "62490", title: "Star Trek: Discovery" },
    { id: "63343", title: "Evil" },
    { id: "62156", title: "1883" },
    { id: "63291", title: "Star Trek: Picard" },
    { id: "62345", title: "The Good Fight" },
    { id: "63188", title: "Why Women Kill" },
    { id: "63317", title: "Mayor of Kingstown" },
    { id: "63318", title: "Tulsa King" },
    { id: "63319", title: "1923" }
  ]
};

// Default TV shows if platform not found
const DEFAULT_SHOWS = [
  { id: "62286", title: "Breaking Bad" },
  { id: "62164", title: "Game of Thrones" },
  { id: "63351", title: "Stranger Things" },
  { id: "63327", title: "The Mandalorian" },
  { id: "62234", title: "The Boys" },
  { id: "62259", title: "Ted Lasso" },
  { id: "63205", title: "Yellowstone" },
  { id: "63174", title: "The Crown" },
  { id: "63158", title: "Severance" },
  { id: "62256", title: "The Handmaid's Tale" }
];

/**
 * Fetch shows from the Streaming Availability API
 */
export async function fetchShows(platform: string, timeframe: string, country: string = DEFAULT_COUNTRY): Promise<Show[]> {
  const rapidApiKey = process.env.RAPID_API_KEY;
  
  if (!rapidApiKey) {
    throw new Error('RAPID_API_KEY environment variable is not set');
  }
  
  try {
    console.log(`Fetching ${timeframe} shows for ${platform} in country ${country}`);
    
    // Determine the correct sort parameter based on timeframe
    let orderBy = '';
    switch (timeframe) {
      case 'day':
        orderBy = 'popularity_day';
        break;
      case 'week':
        orderBy = 'popularity_week';
        break;
      case 'past_week':
        orderBy = 'popularity_week'; // Closest equivalent
        break;
      case 'month':
        orderBy = 'popularity_month';
        break;
      case 'year':
        orderBy = 'popularity_year';
        break;
      default:
        orderBy = 'popularity_week';
    }
    
    // Use the correct API endpoint based on API documentation
    // First approach: Get top shows
    console.log("Using top shows endpoint for platform:", platform);
    
    const response = await axios({
      method: 'GET',
      url: `${API_BASE_URL}/shows/top`,
      params: {
        country: country,
        service: platform,
        show_type: 'series',
        output_language: 'en'
      },
      headers: {
        'X-RapidAPI-Key': rapidApiKey,
        'X-RapidAPI-Host': API_HOST
      }
    });
    
    console.log("API response status:", response.status);
    console.log("API response structure:", Object.keys(response.data || {}).join(', '));
    
    if (response.data && response.data.results && Array.isArray(response.data.results)) {
      console.log(`Received ${response.data.results.length} shows from API`);
      return transformResponseToShows(response.data.results);
    } else if (response.data && response.data.result && Array.isArray(response.data.result)) {
      console.log(`Received ${response.data.result.length} shows from API`);
      return transformResponseToShows(response.data.result);
    } else if (response.data && Array.isArray(response.data)) {
      console.log(`Received ${response.data.length} shows from API`);
      return transformResponseToShows(response.data);
    }
    
    console.warn("API returned unexpected data format, attempting alternative method");
    return fetchShowsAlternative(platform, timeframe, rapidApiKey, country);
    
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('API Error details:', error.response?.data || 'No response data');
      console.error('API Error status:', error.response?.status);
      console.error('API Error headers:', error.response?.headers);
      
      // If this fails, try an alternative approach
      return fetchShowsAlternative(platform, timeframe, rapidApiKey, country);
    }
    throw new Error(`API request failed: ${error}`);
  }
}

/**
 * Alternative approach to fetch shows if the first method fails
 */
async function fetchShowsAlternative(
  platform: string, 
  timeframe: string, 
  apiKey: string, 
  country: string = DEFAULT_COUNTRY
): Promise<Show[]> {
  console.log(`Attempting alternative method for ${platform} in country ${country}`);
  
  try {
    // Try search by filters endpoint
    const params = {
      country: country,
      catalogs: platform,
      show_type: 'series',
      output_language: 'en',
      order_by: getOrderByParam(timeframe)
    };
    
    console.log("Using search filters endpoint with params:", params);
    
    const response = await axios({
      method: 'GET',
      url: `${API_BASE_URL}/shows/search/filters`,
      params: params,
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': API_HOST
      }
    });
    
    console.log("Alternative API response status:", response.status);
    console.log("Alternative API response structure:", Object.keys(response.data || {}).join(', '));
    
    if (response.data && response.data.results && Array.isArray(response.data.results)) {
      console.log(`Received ${response.data.results.length} shows from alternative API endpoint`);
      return transformResponseToShows(response.data.results);
    } else if (response.data && response.data.result && Array.isArray(response.data.result)) {
      console.log(`Received ${response.data.result.length} shows from alternative API endpoint`);
      return transformResponseToShows(response.data.result);
    } else if (response.data && Array.isArray(response.data)) {
      console.log(`Received ${response.data.length} shows from alternative API endpoint`);
      return transformResponseToShows(response.data);
    }
    
    // If both methods fail, use the last resort approach
    return fetchLastResort(platform, timeframe, apiKey, country);
    
  } catch (error) {
    console.error('Alternative API Error:', error);
    // Try one last approach
    return fetchLastResort(platform, timeframe, apiKey, country);
  }
}

/**
 * Last resort approach to fetch shows
 */
async function fetchLastResort(
  platform: string, 
  timeframe: string, 
  apiKey: string, 
  country: string = DEFAULT_COUNTRY
): Promise<Show[]> {
  console.log(`Attempting last resort method for ${platform} in country ${country}`);
  
  try {
    // Use search by title with popular show titles
    const popularTitles = [
      "Breaking Bad", 
      "Game of Thrones", 
      "Stranger Things", 
      "The Crown", 
      "The Mandalorian",
      "The Witcher",
      "The Boys",
      "Ozark",
      "Succession",
      "Squid Game"
    ];
    
    // Try to fetch a few popular shows by title
    const showPromises = popularTitles.map(title => 
      axios({
        method: 'GET',
        url: `${API_BASE_URL}/shows/search/title`,
        params: {
          title: title,
          country: country,
          output_language: 'en'
        },
        headers: {
          'X-RapidAPI-Key': apiKey,
          'X-RapidAPI-Host': API_HOST
        }
      }).catch(err => {
        console.log(`Error fetching show title ${title}: ${err.message}`);
        return null;
      })
    );
    
    const results = await Promise.all(showPromises);
    
    let allShows: any[] = [];
    
    results.forEach(result => {
      if (result && result.data) {
        if (result.data.result && Array.isArray(result.data.result)) {
          allShows = allShows.concat(result.data.result);
        } else if (result.data.results && Array.isArray(result.data.results)) {
          allShows = allShows.concat(result.data.results);
        } else if (Array.isArray(result.data)) {
          allShows = allShows.concat(result.data);
        }
      }
    });
    
    console.log(`Last resort successful! Retrieved ${allShows.length} shows.`);
    
    if (allShows.length > 0) {
      return transformResponseToShows(allShows);
    }
    
    // If all approaches fail, we'll return an empty array
    console.error("All API approaches failed. The API may have changed or may be unavailable.");
    return [];
    
  } catch (error) {
    console.error('Last resort API Error:', error);
    return [];
  }
}

/**
 * Helper function to get the correct order_by parameter based on timeframe
 */
function getOrderByParam(timeframe: string): string {
  switch (timeframe) {
    case 'day':
      return 'popularity_day';
    case 'week':
      return 'popularity_week';
    case 'past_week':
      return 'popularity_week';
    case 'month':
      return 'popularity_month';
    case 'year':
      return 'popularity_year';
    default:
      return 'popularity_week';
  }
}

/**
 * Transform API response to our Show interface
 */
function transformResponseToShows(items: any[]): Show[] {
  return items.map(item => transformSingleShowToShow(item));
}

/**
 * Transform a single show item to our Show interface
 */
function transformSingleShowToShow(item: any): Show {
  // Extract the data differently based on the shape of the item
  let imdbId = '';
  let title = '';
  let year = '';
  let type = 'series';
  let overview = '';
  let imageUrl = '';
  let imdbRating = '0';
  let genres: string[] = [];
  
  // Handle different API response formats
  if (item.imdbID) imdbId = item.imdbID;
  else if (item.imdbId) imdbId = item.imdbId;
  else if (item.id) imdbId = item.id;
  
  if (item.title) title = item.title;
  else if (item.name) title = item.name;
  
  if (item.year) year = item.year.toString();
  else if (item.releaseYear) year = item.releaseYear.toString();
  else if (item.first_air_date) year = item.first_air_date.substr(0, 4);
  else if (item.release_date) year = item.release_date.substr(0, 4);
  
  if (item.type) type = item.type;
  else if (item.showType) type = item.showType;
  else if (item.itemType) type = item.itemType;
  else if (item.media_type) type = item.media_type;
  
  if (item.overview) overview = item.overview;
  else if (item.plot) overview = item.plot;
  else if (item.description) overview = item.description;
  
  imageUrl = extractImageUrl(item);
  
  if (item.imdbRating) imdbRating = item.imdbRating.toString();
  else if (item.rating) imdbRating = item.rating.toString();
  else if (item.vote_average) imdbRating = item.vote_average.toString();
  
  genres = extractGenres(item);
  
  return {
    ImdbId: imdbId,
    Title: title,
    Year: year,
    Type: type,
    ImageUrl: imageUrl,
    ImdbRating: imdbRating,
    Overview: overview,
    Genres: genres
  };
}

/**
 * Extract image URL from various possible formats
 */
function extractImageUrl(item: any): string {
  // Handle different API image formats
  
  // StreamingAvailability API v4 format
  if (item.posterURLs) {
    return item.posterURLs['780'] || 
           item.posterURLs['500'] || 
           item.posterURLs['342'] || 
           item.posterURLs['185'] || 
           item.posterURLs.original || '';
  }
  
  // StreamingAvailability API older format
  if (item.imageSet) {
    if (item.imageSet.verticalPoster) {
      return item.imageSet.verticalPoster.w720 || 
             item.imageSet.verticalPoster.w600 || 
             item.imageSet.verticalPoster.w480 || 
             item.imageSet.verticalPoster.w360 || 
             item.imageSet.verticalPoster.w240 || '';
    }
    
    if (item.imageSet.horizontalPoster) {
      return item.imageSet.horizontalPoster.w1080 ||
             item.imageSet.horizontalPoster.w720 ||
             item.imageSet.horizontalPoster.w480 ||
             item.imageSet.horizontalPoster.w360 || '';
    }
  }
  
  // Common formats
  if (item.ImageUrl) return item.ImageUrl;
  if (item.imageUrl) return item.imageUrl;
  if (item.poster_path) return `https://image.tmdb.org/t/p/w500${item.poster_path}`;
  if (item.backdrop_path) return `https://image.tmdb.org/t/p/w500${item.backdrop_path}`;
  if (item.poster) return item.poster;
  if (item.image) return item.image;
  
  return '';
}

/**
 * Extract genres from various possible formats
 */
function extractGenres(item: any): string[] {
  if (item.genres && Array.isArray(item.genres)) {
    if (typeof item.genres[0] === 'string') {
      return item.genres;
    }
    if (item.genres[0] && (item.genres[0].name || item.genres[0].title)) {
      return item.genres.map((g: any) => g.name || g.title);
    }
  }
  
  if (item.genreNames && Array.isArray(item.genreNames)) {
    return item.genreNames;
  }
  
  if (item.genre_ids && Array.isArray(item.genre_ids)) {
    // Here we could map genre IDs to names if we had a mapping
    return [];
  }
  
  if (item.Genres && Array.isArray(item.Genres)) {
    return item.Genres;
  }
  
  return [];
} 