# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci && npm cache clean --force

# Production stage
FROM node:20-alpine AS production
WORKDIR /app

# Install curl for health checks
RUN apk add --no-cache curl

# Copy package files
COPY package.json package-lock.json ./

# Copy built application from builder stage
COPY --from=builder /app/node_modules ./node_modules

# Copy source code
COPY . .

# Generate Prisma client first (needed for TypeScript compilation)
RUN npx prisma generate --schema ./apps/subscription/prisma/schema.prisma

# Build the application (after Prisma client is generated)
RUN npm run build:subscription

# Expose port
EXPOSE 4002

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:4002/health || exit 1

# Start the application with database migration
CMD ["sh", "-c", "npx prisma migrate deploy --schema ./apps/subscription/prisma/schema.prisma && npm run start:subscription:prod"]
