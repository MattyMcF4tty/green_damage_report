# Use the official Node.js image.
FROM node:14

# Set the working directory.
WORKDIR /usr/src/app

# Copy the dependencies file.
COPY package*.json ./

# Install dependencies.
RUN npm install -g npm@7  # Ensure npm 7 or later is used
RUN npm install

# Copy the content of the local src directory to the working directory.
COPY . .

# Build the app.
RUN npm run build

# Expose the app on port 3000.
EXPOSE 3000

# Command to run the app.
CMD [ "npm", "start" ]
