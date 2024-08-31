# Use the official Node.js image as the base image.
FROM node:18

# Set the working directory.
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files.
COPY package*.json ./

# Install the dependencies.
RUN npm install

# Copy the rest of the application code.
COPY . .

# Build the React app.
RUN npm run build

# Use the official Nginx image to serve the build artifacts.
FROM nginx:alpine

# Copy the build artifacts to the Nginx web root.
COPY --from=0 /usr/src/app/build /usr/share/nginx/html

# Expose port 80 to the outside world.
EXPOSE 80

# Start Nginx when the container has started.
CMD ["nginx", "-g", "daemon off;"]
