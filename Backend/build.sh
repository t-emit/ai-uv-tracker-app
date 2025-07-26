#!/usr/bin/env bash
# exit on error
set -o errexit

# --- ADD THESE LINES FOR GIT LFS ---
# Install the client
apt-get update && apt-get install -y git-lfs

# Pull the large files
git lfs pull
# ------------------------------------

# Install Python dependencies
pip install --upgrade pip
pip install -r requirements.txt