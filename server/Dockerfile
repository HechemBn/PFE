FROM node:18-alpine


# Create and change to the app directory.
WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./

RUN npm install


# Copy local code to the container image.
COPY . .

EXPOSE 8000



CMD ["npm", "run" ,"dev"]