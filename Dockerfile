# Use Node.js 18 LTS as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Install git (needed for some operations)
RUN apk add --no-cache git

# Copy package files
COPY package*.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install

# Copy the rest of the application
COPY . .

# Expose port 3000 for development server
EXPOSE 3000

# Default command
CMD ["pnpm", "run", "dev"]
