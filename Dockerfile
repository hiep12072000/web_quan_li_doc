
# Use the official Node.js image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json, yarn.lock (if exists), and other necessary files, but exclude node_modules
COPY package.json yarn.lock* ./
COPY .output/ /app/
COPY . .

# Remove the pre-existing node_modules folder in .output
RUN rm -rf .output/server/node_modules

# Install dependencies in the Docker container environment
RUN yarn install

# Start the application
CMD ["yarn", "start"]
