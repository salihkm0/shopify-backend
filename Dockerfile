# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.14.0
FROM node:${NODE_VERSION}-alpine

# Set NODE_ENV to production by default
ENV NODE_ENV production

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first to leverage Docker's caching
COPY package.json package-lock.json ./

# Install dependencies without dev dependencies
RUN npm ci --omit=dev

# Copy the rest of the application files
COPY . .

# Change user to non-root
USER node

# Expose the port your application runs on
EXPOSE 5558

# Start the application
CMD ["npm", "start"]
