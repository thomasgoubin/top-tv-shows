# Top TV Shows Dashboard

A comprehensive web application that displays top TV shows from major streaming platforms with information about ratings, descriptions, and links to IMDb.

## Features

- Browse top TV shows from Netflix, Prime Video, Disney+, HBO, Hulu, Apple TV+, and Paramount+
- Filter shows by timeframe: today, this week, past week, past month, past year
- View show details including posters, summaries, and IMDb ratings
- Efficient caching system to minimize API calls
- Manual refresh button to control when to update data
- Responsive design for all device sizes

## Technologies

- **Backend:** Go with gorilla/mux for routing
- **Frontend:** React.js
- **API:** [Streaming Availability API](https://github.com/movieofthenight/go-streaming-availability)
- **Deployment:** Docker, Railway

## Prerequisites

- Go 1.19 or later
- Node.js 16 or later
- npm
- RapidAPI key for Streaming Availability API

## Local Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/top-tv-shows.git
   cd top-tv-shows
   ```

2. Backend setup:
   ```bash
   cd backend
   
   # Create a .env file with your RapidAPI key
   echo "RAPID_API_KEY=your_rapidapi_key_here" > .env
   
   # Download dependencies
   go mod tidy
   
   # Run the backend server
   go run main.go
   ```

3. Frontend setup:
   ```bash
   cd frontend
   npm install
   npm start
   ```

4. Open your browser and navigate to http://localhost:3000

## Deployment

This project is configured for easy deployment to Railway:

1. Push your code to a GitHub repository
2. Connect Railway to your GitHub repository
3. Create a new project from the repository
4. Add the environment variable:
   - `RAPID_API_KEY=your_rapidapi_key_here`
5. Deploy the project

## API Usage Notes

- The Streaming Availability API is limited to 1000 calls per month on the free tier
- This application implements efficient caching to minimize API calls
- Data is refreshed only on user request via the "Refresh Data" button
- Cache persists between server restarts using the file system

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Movie of the Night](https://github.com/movieofthenight/go-streaming-availability) for the Streaming Availability API
- All streaming services for providing their content # top-tv-shows
