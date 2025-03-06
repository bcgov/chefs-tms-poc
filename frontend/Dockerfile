# Use an official node image as the base image
FROM node:20.18.2-alpine3.21

ENV NO_UPDATE_NOTIFIER=true
WORKDIR /opt/app-root/src

# Copy the application source code to the working directory
COPY . .

# Set the necessary permissions
RUN set -x \
    && chmod -R 755 /opt/app-root/src/ \
    && chown -R node:node /opt/app-root/src/

# Install the dependencies
RUN npm install

# Build the application for production
RUN npm run build

# Switch to the node user
USER node

# Expose the port that the application will run on
EXPOSE 4173

# Use npm to run the application
CMD ["npm", "run", "preview"]
