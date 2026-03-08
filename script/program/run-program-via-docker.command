#!/bin/bash

# ======================================================
# Docker Project Start Script
# - Starts all Docker services defined in docker-compose.yml
# - Monitors logs in real-time (docker compose up)
# - Validates docker-compose.yml exists before running
# - Designed for macOS (auto-closes Terminal after execution)
# ======================================================

# Determine the absolute path to the project root directory
# Assumes the script is located two levels down from the project root
ROOT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"

# Store the full path to docker-compose.yml in the project root
COMPOSE_FILE="$ROOT_DIR/docker-compose.yml"

# Print a blank line for readability
echo ""
echo "PROJECT ROOT LOCATION DETECTED:"
echo "$ROOT_DIR"
echo ""

# Check if docker-compose.yml exists in the project root
# If not found, display an error, wait for user input, and close Terminal
if [ ! -f "$COMPOSE_FILE" ]; then
  echo "docker-compose.yml not found in project root!"
    # Wait for user input so the user can read the message
  read -n 1 -s -r -p "Press any key to exit..."
  echo ""
    # Close the front Terminal window (macOS only)
  osascript -e 'tell application "Terminal" to close front window' &>/dev/null
  exit 1
fi

# Inform the user that Docker services are being started and logs will be monitored
echo "Starting all Docker services (monitoring logs)..."

# Change directory to the project root
# Exit with an error message if the cd command fails
cd "$ROOT_DIR" || { echo "Cannot cd to project root!"; exit 1; }

# Start all Docker services and attach to their logs
# Runs in the foreground, allowing Ctrl+C to stop
docker compose up

# After stopping services with Ctrl+C, prompt the user before closing Terminal
echo ""
read -n 1 -s -r -p "Press any key to close this window..."
echo ""

# Close the Terminal window explicitly (macOS only)
osascript -e 'tell application "Terminal" to close front window' &>/dev/null
exit 0