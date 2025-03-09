package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"sync"
	"time"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/movieofthenight/go-streaming-availability/v4"
	"github.com/rs/cors"
)

// CachedData represents our cached show data structure
type CachedData struct {
	Timestamp time.Time       `json:"timestamp"`
	Shows     []streaming.Show `json:"shows"`
}

// Cache for storing show data by platform and timeframe
var (
	cache     = make(map[string]CachedData)
	cacheLock sync.RWMutex
	cachePath = "./cache"
)

// Config variables
var (
	rapidAPIKey string
	port        string
)

func init() {
	// Load environment variables
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found, using environment variables")
	}

	rapidAPIKey = os.Getenv("RAPID_API_KEY")
	if rapidAPIKey == "" {
		log.Fatal("RAPID_API_KEY environment variable is required")
	}

	port = os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// Create cache directory if it doesn't exist
	if _, err := os.Stat(cachePath); os.IsNotExist(err) {
		os.MkdirAll(cachePath, 0755)
	}

	// Load cache from disk
	loadCacheFromDisk()
}

func main() {
	router := mux.NewRouter()

	// API routes
	router.HandleFunc("/api/shows", getShows).Methods("GET")
	router.HandleFunc("/api/refresh", refreshShows).Methods("POST")
	
	// Serve static files from frontend/build
	router.PathPrefix("/").Handler(http.FileServer(http.Dir("./frontend/build")))

	// Configure CORS
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000", "http://localhost:8080"},
		AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Origin", "Accept"},
		AllowCredentials: true,
	})

	// Start server
	fmt.Printf("Server starting on port %s...\n", port)
	log.Fatal(http.ListenAndServe(":"+port, c.Handler(router)))
}

// getShows handles the GET request to fetch shows data
func getShows(w http.ResponseWriter, r *http.Request) {
	platform := r.URL.Query().Get("platform")
	timeframe := r.URL.Query().Get("timeframe")
	forceRefresh := r.URL.Query().Get("refresh") == "true"

	if platform == "" {
		platform = "netflix" // Default to Netflix
	}
	if timeframe == "" {
		timeframe = "week" // Default to this week
	}

	cacheKey := platform + "-" + timeframe
	
	if !forceRefresh {
		// Check if we have cached data and it's still valid
		cacheLock.RLock()
		cachedData, exists := cache[cacheKey]
		cacheLock.RUnlock()

		if exists && time.Since(cachedData.Timestamp) < 24*time.Hour {
			// Return cached data if it's less than 24 hours old
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(map[string]interface{}{
				"shows":           cachedData.Shows,
				"cachedTimestamp": cachedData.Timestamp,
				"fromCache":       true,
			})
			return
		}
	}

	// If we get here, we need to fetch fresh data
	shows, err := fetchShowsFromAPI(platform, timeframe)
	if err != nil {
		http.Error(w, "Error fetching shows: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Cache the new data
	now := time.Now()
	cacheLock.Lock()
	cache[cacheKey] = CachedData{
		Timestamp: now,
		Shows:     shows,
	}
	cacheLock.Unlock()

	// Save cache to disk
	saveCacheToDisk()

	// Return the data
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"shows":           shows,
		"cachedTimestamp": now,
		"fromCache":       false,
	})
}

// refreshShows handles the POST request to force refresh shows data
func refreshShows(w http.ResponseWriter, r *http.Request) {
	platform := r.URL.Query().Get("platform")
	timeframe := r.URL.Query().Get("timeframe")

	if platform == "" || timeframe == "" {
		http.Error(w, "Platform and timeframe are required", http.StatusBadRequest)
		return
	}

	shows, err := fetchShowsFromAPI(platform, timeframe)
	if err != nil {
		http.Error(w, "Error fetching shows: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Update cache
	cacheKey := platform + "-" + timeframe
	now := time.Now()
	
	cacheLock.Lock()
	cache[cacheKey] = CachedData{
		Timestamp: now,
		Shows:     shows,
	}
	cacheLock.Unlock()

	// Save cache to disk
	saveCacheToDisk()

	// Return the refreshed data
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"shows":           shows,
		"cachedTimestamp": now,
		"fromCache":       false,
	})
}

// fetchShowsFromAPI retrieves shows from the streaming availability API
func fetchShowsFromAPI(platform string, timeframe string) ([]streaming.Show, error) {
	client := streaming.NewAPIClientFromRapidAPIKey(rapidAPIKey, nil)
	ctx := context.Background()

	// Determine appropriate time period based on timeframe
	var orderBy string
	switch timeframe {
	case "day":
		orderBy = "popularity_1day"
	case "week":
		orderBy = "popularity_1week"
	case "past_week":
		orderBy = "popularity_2week"  // Not exact but close
	case "month":
		orderBy = "popularity_1month"
	case "year":
		orderBy = "popularity_1year"
	default:
		orderBy = "popularity_1week"
	}

	// Request top shows based on platform and timeframe
	req := client.ShowsAPI.SearchShowsByFilters(ctx).
		Type("series").                  // Only TV shows
		OrderBy(orderBy).                // Sort by specified popularity
		Country("us").                   // Using US market
		Catalogs([]string{platform}).    // Specified platform
		Limit(20)                        // Limit to 20 shows

	// Execute the API request
	result, _, err := req.Execute()
	if err != nil {
		return nil, fmt.Errorf("API request failed: %w", err)
	}

	return result.Shows, nil
}

// saveCacheToDisk writes the current cache to disk
func saveCacheToDisk() {
	cacheLock.RLock()
	defer cacheLock.RUnlock()

	for key, data := range cache {
		filename := filepath.Join(cachePath, key+".json")
		
		file, err := os.Create(filename)
		if err != nil {
			log.Printf("Error creating cache file %s: %v", filename, err)
			continue
		}
		
		encoder := json.NewEncoder(file)
		encoder.SetIndent("", "  ")
		if err := encoder.Encode(data); err != nil {
			log.Printf("Error encoding cache to %s: %v", filename, err)
		}
		
		file.Close()
	}
}

// loadCacheFromDisk reads the cache from disk at startup
func loadCacheFromDisk() {
	files, err := os.ReadDir(cachePath)
	if err != nil {
		log.Printf("Error reading cache directory: %v", err)
		return
	}

	cacheLock.Lock()
	defer cacheLock.Unlock()

	for _, file := range files {
		if filepath.Ext(file.Name()) != ".json" {
			continue
		}

		filename := filepath.Join(cachePath, file.Name())
		data, err := os.ReadFile(filename)
		if err != nil {
			log.Printf("Error reading cache file %s: %v", filename, err)
			continue
		}

		var cachedData CachedData
		if err := json.Unmarshal(data, &cachedData); err != nil {
			log.Printf("Error parsing cache file %s: %v", filename, err)
			continue
		}

		key := file.Name()[:len(file.Name())-5] // Remove .json extension
		cache[key] = cachedData
	}
} 