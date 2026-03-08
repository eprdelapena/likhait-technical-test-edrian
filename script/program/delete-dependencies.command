#!/bin/bash


# ======================================================
# Project Delete Script
# - Deletes frontend (Node.js) and backend (Ruby/Rails) dependencies
# - Removes lock files and modules for fresh install
# ======================================================

# --- Determine Project Root ---
# Get the absolute path to the project root (two levels up from script location)
ROOT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
echo ""
echo "PROJECT ROOT LOCATION DETECTED:"
echo "$ROOT_DIR"
echo ""

# --- Delete Frontend Dependencies ---
echo "Cleaning frontend..."
FRONTEND_DIR="$ROOT_DIR/frontend"
if [ -d "$FRONTEND_DIR/node_modules" ]; then
  echo "Removing node_modules..."
  rm -rf "$FRONTEND_DIR/node_modules"
else
  echo "No node_modules folder found in frontend."
fi

# Remove package-lock.json if it exists
if [ -f "$FRONTEND_DIR/package-lock.json" ]; then
  echo "Removing package-lock.json..."
  rm "$FRONTEND_DIR/package-lock.json"
fi
echo "Frontend cleanup complete."
echo ""

# --- Delete Backend Dependencies ---
# Remove vendor/bundle folder if it exists (Ruby gems)
echo "Cleaning backend..."
BACKEND_DIR="$ROOT_DIR/backend"
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

# --- Deletion Complete ---
echo "Cleanup finished. You can now reinstall dependencies."

# Wait for user input before closing
echo ""
read -n 1 -s -r -p "Press any key to close this window..."
echo ""

# Close the Terminal window (macOS only)
osascript -e 'tell application "Terminal" to close front window' &>/dev/null

exit 0