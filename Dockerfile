# Use an official Ubuntu as a base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /src/

# Copy your local project files into the Docker image
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Build the app
RUN npm run build

# Install serve to serve the build
RUN npm install -g serve

#Expose the port the app will run on
EXPOSE 3000

# Serve the app
CMD ["serve", "-s", "build"]
