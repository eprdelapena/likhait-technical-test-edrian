#!/bin/bash

# ======================================================
# Project Setup Script
# - Installs frontend (Node.js) and backend (Ruby/Rails) dependencies
# - Uses npm for frontend and bundle for backend
# - Designed for macOS (auto-closes Terminal after execution)
# ======================================================

# Determine the absolute path to the project root directory.
# Assumes the script is located two levels down from the project root.
# Print a blank line and display the detected project root
ROOT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
echo ""
echo "PROJECT ROOT LOCATION DETECTED:"
echo "$ROOT_DIR"
echo ""

# --- Frontend Setup ---
echo "Setting up frontend..."

# Change directory to the frontend folder
# Exit if the folder is not found
cd "$ROOT_DIR/frontend" || { echo "Frontend folder not found!"; exit 1; }

# Check if package.json exists in frontend directory
if [ -f package.json ]; then
  # Install Node.js dependencies
  echo "Running npm install..."
  npm install
else
  echo "package.json not found in frontend!"
fi
echo "Frontend setup complete."
echo ""

# --- Backend Setup ---
echo "Setting up backend..."
# Change directory to the backend folder
# Exit if the folder is not found
cd "$ROOT_DIR/backend" || { echo "Backend folder not found!"; exit 1; }

# Check if Gemfile exists in backend directory
if [ -f Gemfile ]; then
# Install Ruby gems specified in the Gemfile
  echo "Installing Ruby gems..."
  bundle install
else
  echo "Gemfile not found in backend!"
fi

# Wait for user input before closing the terminal window
echo ""
read -n 1 -s -r -p "Press any key to close this window..."
echo ""

# Close the Terminal window explicitly (macOS only)
osascript -e 'tell application "Terminal" to close front window' &>/dev/null

exit 0