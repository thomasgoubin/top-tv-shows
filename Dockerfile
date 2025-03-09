# Build the React frontend
FROM node:16-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Build the TypeScript backend
FROM node:16-alpine AS backend-build
WORKDIR /app/backend
COPY backend-ts/package*.json ./
RUN npm install
COPY backend-ts/ ./
RUN npm run build

# Final stage
FROM node:16-alpine
WORKDIR /app
RUN mkdir -p /app/cache

# Copy backend build files
COPY --from=backend-build /app/backend/dist ./
COPY --from=backend-build /app/backend/package*.json ./
COPY --from=backend-build /app/backend/node_modules ./node_modules

# Copy frontend build files
COPY --from=frontend-build /app/frontend/build ./frontend/build

# Set environment variables
ENV NODE_ENV=production

EXPOSE 8080
CMD ["node", "index.js"] 