ARG NODE_VERSION=18.17.0
FROM node:${NODE_VERSION}-alpine as base

# Set working directory
WORKDIR /usr/src/app

# Create a separate stage for dependencies
FROM base as deps

# Install dependencies
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

# Create a separate stage for building
FROM deps as build

# Copy source code
COPY . .

# Install dependencies and build the application
RUN npm install
RUN npm run build

# Create the final stage
FROM base as final

# Set environment to production
ENV NODE_ENV production

# Change to the non-root user
USER node

# Copy package.json
COPY package.json .

# Copy dependencies from the 'deps' stage
COPY --from=deps /usr/src/app/node_modules ./node_modules

# Copy the build output from the 'build' stage
COPY --from=build /usr/src/app/.next ./.next

# Expose the port the app runs on
EXPOSE 3000

# Set the command to run the application
CMD npm start