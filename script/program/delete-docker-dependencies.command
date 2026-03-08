#!/bin/bash

# ======================================================
# Docker Project Cleanup Script
# - Stops all running containers
# - Removes images, volumes, and orphaned containers
# - Prunes dangling Docker resources
# - Designed for macOS (auto-closes Terminal after execution)
# ======================================================

# Determine the absolute path to the project root directory.
# This assumes the script is located two levels down from the project root.
ROOT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"

# Store the full path to the docker-compose.yml file in the project root.
COMPOSE_FILE="$ROOT_DIR/docker-compose.yml"

# Inform the user where the project root was detected
echo ""
echo "PROJECT ROOT LOCATION DETECTED:"
echo "$ROOT_DIR"
echo ""

# Check if docker-compose.yml exists in the project root.
# If not found, show an error message and wait for user input before exiting.
if [ ! -f "$COMPOSE_FILE" ]; then
  echo "docker-compose.yml not found in project root!"
  read -n 1 -s -r -p "Press any key to exit..."
  echo ""
  exit 1
fi

# Change directory to the project root.
# If cd fails (for example, permissions issue), exit with an error.
cd "$ROOT_DIR" || { echo "Cannot cd to project root!"; exit 1; }

# Inform the user that all running containers will be stopped.
echo "Stopping all containers..."

# Stop all containers, remove images associated with the services,
# remove anonymous volumes, and remove orphan containers not defined in the compose file.
docker compose down --rmi all --volumes --remove-orphans

# Optional cleanup: remove dangling images not associated with any container.
echo "Removing dangling images..."
docker image prune -f

# Optional cleanup: remove dangling volumes that are no longer referenced by any container.
echo "Removing dangling volumes..."
docker volume prune -f

# Indicate that Docker cleanup operations are complete
echo "Docker cleanup complete."

# Wait for user input before closing the terminal window
echo ""
read -n 1 -s -r -p "Press any key to close this window..."
echo ""
# Explicitly close the current Terminal window (macOS only)
osascript -e 'tell application "Terminal" to close front window' &>/dev/null

exit 0