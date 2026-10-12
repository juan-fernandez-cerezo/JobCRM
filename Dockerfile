# ==========================================
# Stage 1: Build the static assets (Vite React Client)
# ==========================================
FROM node:20-alpine AS builder
WORKDIR /app

# Copy lock files to run high-speed clean installs
COPY package*.json ./
RUN npm ci

# Copy the rest of the codebase
COPY . .

# Run compilation
RUN npm run build

# ==========================================
# Stage 2: Serve using Nginx container
# ==========================================
FROM nginx:stable-alpine

# Copy built bundle from compilation stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Replace default configuration with custom routing configurations
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
