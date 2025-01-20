#!/bin/bash

# Load NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Use Node.js version from .nvmrc
nvm use || { echo "Failed to load Node.js version from .nvmrc"; exit 1; }

# Start the application
npm run start