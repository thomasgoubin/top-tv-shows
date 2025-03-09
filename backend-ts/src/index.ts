import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import showsRoutes from './routes/showsRoutes';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use(cors());

// API routes
app.use('/api', showsRoutes);

// Serve static files from the public directory (prebuilt frontend)
const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath));

// Handle any requests that don't match the above
app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api/shows`);
}); 