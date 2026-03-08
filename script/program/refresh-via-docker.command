#!/usr/bin/env bash

# Exit immediately if a command exits with a non-zero status
set -e

# ======================================================
# Full Project Reset & Setup Script
# - Cleans frontend/backend dependencies
# - Stops Docker services and removes Docker resources
# - Reinstalls dependencies
# - Starts Docker services
# ======================================================

# Determine the absolute path to the project root directory
# Assumes the script is located two levels down from the project root
ROOT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"

# Store the full path to docker-compose.yml in the project root
COMPOSE_FILE="$ROOT_DIR/docker-compose.yml"

# Print a blank line and display the detected project root
echo ""
echo "PROJECT ROOT LOCATION DETECTED:"
echo "$ROOT_DIR"
echo ""

########################################
# CLEAN FRONTEND
########################################

echo "Cleaning frontend..."
FRONTEND_DIR="$ROOT_DIR/frontend"

# Remove node_modules folder if it exists
if [ -d "$FRONTEND_DIR/node_modules" ]; then
  echo "Removing node_modules..."
  rm -rf "$FRONTEND_DIR/node_modules"
else
  echo "No node_modules folder found."
fi

# Remove package-lock.json if it exists
if [ -f "$FRONTEND_DIR/package-lock.json" ]; then
  echo "Removing package-lock.json..."
  rm "$FRONTEND_DIR/package-lock.json"
fi

echo "Frontend cleanup complete."
echo ""

########################################
# CLEAN BACKEND
########################################

echo "Cleaning backend..."
BACKEND_DIR="$ROOT_DIR/backend"

# Remove vendor/bundle folder if it exists (Ruby gems)
if [ -d "$BACKEND_DIR/vendor/bundle" ]; then
  echo "Removing vendor/bundle..."
  rm -rf "$BACKEND_DIR/vendor/bundle"
fi

# Remove Gemfile.lock if it exists
if [ -f "$BACKEND_DIR/Gemfile.lock" ]; then
  echo "Removing Gemfile.lock..."
  rm "$BACKEND_DIR/Gemfile.lock"
fi

echo "Backend cleanup complete."
echo ""

########################################
# DOCKER STOP
########################################

# Check if docker-compose.yml exists before attempting Docker commands
if [ ! -f "$COMPOSE_FILE" ]; then
  echo "docker-compose.yml not found in project root!"
  exit 1
fi

# Change directory to project root
cd "$ROOT_DIR"

# Stop all Docker services defined in docker-compose.yml
echo "Stopping Docker services..."
docker compose down

########################################
# DOCKER CLEANUP
########################################

# Stop services again and remove all related images, volumes, and orphan containers
echo "Removing containers, volumes, images..."
docker compose down --rmi all --volumes --remove-orphans

# Remove dangling images not associated with any container
echo "Removing dangling images..."
docker image prune -f

# Remove dangling volumes not associated with any container
echo "Removing dangling volumes..."
docker volume prune -f

echo "Docker cleanup complete."
echo ""

########################################
# INSTALL FRONTEND DEPENDENCIES
########################################

echo "Installing frontend dependencies..."

# Change to frontend directory
cd "$ROOT_DIR/frontend" || { echo "Frontend folder missing!"; exit 1; }

# Install Node.js dependencies if package.json exists
if [ -f package.json ]; then
  npm install
else
  echo "package.json not found!"
fi

echo "Frontend setup complete."
echo ""

########################################
# INSTALL BACKEND DEPENDENCIES
########################################

echo "Installing backend dependencies..."

# Change to backend directory
cd "$ROOT_DIR/backend" || { echo "Backend folder missing!"; exit 1; }

# Install Ruby gems if Gemfile exists
if [ -f Gemfile ]; then
  bundle install
else
  echo "Gemfile not found!"
fi

echo "Backend setup complete."
echo ""

########################################
# START DOCKER
########################################

# Change to project root and start Docker services in foreground
echo "Starting Docker services..."

cd "$ROOT_DIR"
docker compose up

########################################
# EXIT
########################################

# Wait for user input before closing terminal
echo ""
read -n 1 -s -r -p "Press any key to close..."
echo ""

exit 0