# Use Node.js base image
FROM node:14

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install npm dependencies (including rebuilding bcrypt)
RUN npm install --build-from-source bcrypt

# Copy application source code
COPY . .

# Expose the port your app runs on
EXPOSE 8080

# Command to run the application
CMD ["npm", "start"]
