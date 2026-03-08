#!/bin/bash

# ======================================================
# Docker Project Stop Script
# - Stops all running Docker services defined in docker-compose.yml
# - Removes containers, networks, and default volumes
# - Validates docker-compose.yml exists before running
# - Designed for macOS (auto-closes Terminal after execution)
# ======================================================

# Determine the absolute path to the project root directory.
# Assumes the script is located two levels down from the project root.
ROOT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"

# Store the full path to docker-compose.yml in the project root.
COMPOSE_FILE="$ROOT_DIR/docker-compose.yml"

# Print a blank line for readability
echo ""
# Inform the user of the detected project root location
echo "PROJECT ROOT LOCATION DETECTED:"
echo "$ROOT_DIR"
echo ""

# Check if docker-compose.yml exists in the project root.
# If it does not exist, print an error, wait for a key press, and close Terminal.
if [ ! -f "$COMPOSE_FILE" ]; then
  echo "docker-compose.yml not found in project root!"
  # Wait for user input to ensure they see the message
  read -n 1 -s -r -p "Press any key to exit..."
  echo ""
    # Close the front Terminal window (macOS only)
  osascript -e 'tell application "Terminal" to close front window' &>/dev/null
  exit 1
fi

# Inform the user that Docker services will be stopped and resources removed
# Change directory to the project root
# Exit with an error message if the cd command fails
echo "Stopping all Docker services and removing resources..."
cd "$ROOT_DIR" || { echo "Cannot cd to project root!"; exit 1; }

# Stop all Docker services, remove containers, networks, and default volumes
docker compose down

# After finishing, prompt the user before closing the Terminal window
echo ""
read -n 1 -s -r -p "Press any key to close this window..."
echo ""

# Close the Terminal window (macOS only)
osascript -e 'tell application "Terminal" to close front window' &>/dev/null
exit 0