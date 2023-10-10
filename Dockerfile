# Use a more recent Node.js image.
FROM node:16

# Set the working directory.
WORKDIR /usr/src/app

# Copy the dependencies file.
COPY package*.json ./

# Install dependencies.
RUN npm install -g npm@9.5.0  # Ensure a specific npm version or latest
RUN npm install

# Copy the content of the local src directory to the working directory.
COPY . .

# Build the app.
RUN npm run build

# Expose the app on port 3000.
EXPOSE 3000

# Command to run the app.
CMD [ "npm", "start" ]
