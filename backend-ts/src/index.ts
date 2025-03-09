import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import showsRoutes from './routes/showsRoutes';
import { initCache } from './services/cacheService';

// Load environment variables
dotenv.config();

// Initialize cache
initCache();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL || true
    : 'http://localhost:3000'
}));

// API routes
app.use('/api', showsRoutes);

// Serve static files from the frontend build folder in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../frontend/build')));
  
  // Handle any requests that don't match the above
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/build', 'index.html'));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api/shows`);
}); 