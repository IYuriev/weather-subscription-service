# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci && npm cache clean --force

# Production stage
FROM node:20-alpine AS production
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Copy built application from builder stage
COPY --from=builder /app/node_modules ./node_modules

# Copy source code
COPY . .

# Build the application
RUN npm run build:weather

# Expose port
EXPOSE 4001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:4001/health || exit 1

# Start the application
CMD ["npm", "run", "start:weather:prod"]