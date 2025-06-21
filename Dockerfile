# Base image
FROM node:18

# Work Directory
WORKDIR /app

# Copy package.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Expose the port
EXPOSE 8080

# COMMAND TO START THE APP
CMD ["npm", "run", "prod"]