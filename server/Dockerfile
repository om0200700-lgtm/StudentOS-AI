# Base stage
FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./

# Dependencies
FROM base AS dependencies
RUN npm ci

# Production Build
FROM base AS release
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Expose port
EXPOSE 5000

# Start command
CMD ["npm", "start"]
