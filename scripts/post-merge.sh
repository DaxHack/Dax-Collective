#!/bin/bash
set -e

# Install frontend dependencies
echo "Installing dax-main dependencies..."
cd dax-main && npm install --legacy-peer-deps
cd ..

# Install backend dependencies if package.json changed
if [ -f dax-backend/package.json ]; then
  echo "Installing dax-backend dependencies..."
  cd dax-backend && npm install --legacy-peer-deps
  cd ..
fi

echo "Post-merge setup complete."
