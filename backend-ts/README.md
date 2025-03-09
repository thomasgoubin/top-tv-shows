# TopTvShows - Backend

Backend API for the TopTvShows application that displays popular TV shows from various streaming platforms.

## Features

- Fetches real-time data from Streaming Availability API
- Filterable by platform, timeframe, and country
- Caching mechanism for better performance
- Error handling and fallback options

## Local Development

1. Install dependencies:
   ```
   npm install
   ```

2. Create `.env` file from example:
   ```
   cp .env.example .env
   ```

3. Add your Rapid API key to the `.env` file:
   ```
   RAPID_API_KEY=your_rapid_api_key_here
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Access the API at:
   ```
   http://localhost:8080/api/shows
   ```

## Production Deployment to Railway

### Option 1: Deploy via Railway CLI

1. Install Railway CLI:
   ```
   npm i -g @railway/cli
   ```

2. Login to Railway:
   ```
   railway login
   ```

3. Link to your Railway project:
   ```
   railway link
   ```

4. Deploy to Railway:
   ```
   railway up
   ```

### Option 2: Deploy via GitHub Integration

1. Push your code to GitHub
2. Create a new project in Railway
3. Connect to your GitHub repository
4. Railway will automatically deploy your application

### Environment Variables

Set the following environment variables in Railway:

- `RAPID_API_KEY`: Your Streaming Availability API key
- `NODE_ENV`: Set to `production`
- `PORT`: Railway will set this automatically
- `FRONTEND_URL`: If you're deploying frontend separately

## API Endpoints

- `GET /api/shows` - Fetch shows by platform, timeframe, and country
- `POST /api/refresh` - Force refresh shows data
- `GET /api/cached-platforms` - Get all platforms with cached data
- `GET /api/countries` - Get list of available countries

## License

MIT 