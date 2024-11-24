# Use the official Node.js image as the base image
FROM node:20

# Create a directory for the application
WORKDIR /app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the NestJS application
RUN npm run build

ENV HTTP_PORT=3001
# Expose the port the app runs on
EXPOSE 3001

# Start the application
CMD ["npm", "run", "start:prod"]
