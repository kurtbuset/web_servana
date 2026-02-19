# Build stage
FROM node:20-alpine as build

WORKDIR /app

# Accept build arguments
ARG VITE_BACKEND_URL
ARG VITE_SOCKET_URL
ARG NODE_ENV

# Set environment variables from build args
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL
ENV VITE_SOCKET_URL=$VITE_SOCKET_URL
ENV NODE_ENV=$NODE_ENV

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application (now with proper env vars)
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built application from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]