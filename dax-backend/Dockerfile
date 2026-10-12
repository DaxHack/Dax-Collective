# dax-backend/Dockerfile
#
# Public-baseline-safe image: builds and starts with ZERO Firebase/Drive
# credentials baked in. No credential file is copied into the image.
# Admin features (if ever enabled) are turned on entirely via runtime
# environment variables / secrets supplied by the hosting platform —
# never via files added at build time.

FROM node:20-slim AS base

WORKDIR /app

# Install dependencies first for better layer caching.
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy application source. (.dockerignore should exclude .env, credentials/,
# node_modules, and .git — see .dockerignore alongside this file.)
COPY . .

ENV NODE_ENV=production
EXPOSE 5000

# Public baseline default: admin uploads OFF unless explicitly set at deploy
# time via the platform's secret/env var UI.
ENV ENABLE_ADMIN_UPLOADS=false
ENV ENABLE_DRIVE_AUTOMATION=false
ENV ALLOW_PUBLIC_DRIVE_FILES=false

CMD ["node", "server.js"]
