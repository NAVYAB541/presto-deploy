# Use official Node.js image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install esm
RUN npm install

# Copy the rest of the backend code
COPY . .

# Expose the backend port
EXPOSE 5000

# Start the backend server
CMD ["npm", "start"]
