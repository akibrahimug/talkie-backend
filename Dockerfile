# Use the official Node.js 18 image as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and yarn.lock files
COPY package.json ./
COPY yarn.lock ./

# Install dependencies
RUN yarn install

# Install PM2 globally
RUN yarn global add pm2

# Copy the rest of your application's code
COPY . .

# Compile TypeScript to JavaScript
RUN yarn build && echo "Listing build directory:" && ls -l /usr/src/app/build/src

# Make port 5000 available to the world outside this container
EXPOSE 5000

# Define environment variable, if needed
ENV NODE_ENV production

# Command to run your app using PM2
CMD ["pm2-runtime", "ecosystem.config.js"]
