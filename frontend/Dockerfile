# Build Stage
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --no-audit --prefer-offline

# Copy all files and build
COPY . .
ENV NODE_OPTIONS=--max_old_space_size=2048
RUN npm run build

# Production Stage
FROM node:18-alpine AS production

WORKDIR /app

# Install serve to run the application
RUN npm install -g serve

# Copy build files from build stage
COPY --from=build /app/build ./build

EXPOSE 3000

# Start the application
CMD ["serve", "-s", "build", "-l", "3000"] 