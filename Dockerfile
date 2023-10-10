# Use the official Node.js image from the DockerHub
FROM node:alpine

# Set the working directory in Docker
WORKDIR /usr/src/app

# Copy the dependencies file to the working directory
COPY package*.json ./

# Install any dependencies
RUN npm install

# Copy the content of the local src directory to the working directory
COPY . .

# Specify the command to run on container start
CMD [ "npm", "start" ]
