FROM node:lts-alpine

# Working directory
WORKDIR /app

# Install dependencies
COPY package.json ./
RUN npm install

# Copy source
COPY . .

# Build and cleanup
ENV NODE_ENV=production
RUN npm run build \
    && npm prune

# Start server
CMD ["npm", "start"]
