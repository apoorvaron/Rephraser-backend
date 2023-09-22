# Use an official Node.js runtime as the base image
FROM node:16.20.2-bullseye-slim

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install application dependencies
RUN npm cache clean -f
RUN npm prune
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Expose the port your application will run on
EXPOSE 4000

# Start the application
CMD ["npm", "start"]
