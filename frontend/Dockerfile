# Use Node.js to build the app
FROM node:18 AS builder

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the frontend code and build
COPY . .
RUN npm run build

# # Use Nginx to serve the built files
# FROM nginx:latest

# # Copy built frontend files to Nginx public directory
# COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 3000

# Start Nginx
# CMD ["nginx", "-g", "daemon off;"]
CMD ["npm", "run", "dev"]