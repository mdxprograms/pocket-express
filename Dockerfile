# Use the official Node.js image
FROM node:18

# Set the working directory in the container
WORKDIR /workspace

# Copy only package.json and package-lock.json first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the application port
EXPOSE 3000

# Command to start the application (you can adjust for your needs)
CMD ["npm", "start"]
