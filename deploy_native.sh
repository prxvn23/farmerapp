#!/bin/bash

echo "🚀 Starting Native Deployment..."

# 1. Install Backend Dependencies
echo "📦 Installing Backend Dependencies..."
cd backend

# FIX: Resolve dependencies for this specific environment (PHP 8.3 & MongoDB Ext 1.15)
# Remove lock file to allow resolution
if [ -f "composer.lock" ]; then
    echo "⚠️ Removing composer.lock to resolve dependencies for this environment..."
    rm composer.lock
fi

# Force compatible versions
echo "🔧 Adjusting dependencies..."
composer require endroid/qr-code:"^6.0" --no-update # Downgrade from 6.1 (PHP 8.4) to 6.0 (PHP 8.3)
composer require mongodb/mongodb:"^1.15" --no-update # Match installed extension version

composer install --no-dev --optimize-autoloader
cd ..

# 2. Build Frontend
echo "⚛️ Building Frontend..."
cd client
npm install
npm run build
cd ..

# 3. Deploy to Apache Root
# Validated from logs: Server extracts to ~/htdocs
TARGET_DIR="$HOME/htdocs"

echo "📂 Deploying to $TARGET_DIR..."

# Clear old files (Be careful!)
sudo rm -rf $TARGET_DIR/*

# Copy Backend Files
echo "   Copying Backend..."
sudo cp -r backend/* $TARGET_DIR/
sudo cp backend/.htaccess $TARGET_DIR/
sudo cp backend/.env $TARGET_DIR/

# Copy Frontend Build
echo "   Copying Frontend..."
sudo cp -r client/build/* $TARGET_DIR/

# Fix Permissions
echo "🔐 Fixing Permissions..."
sudo chown -R www-data:www-data $TARGET_DIR
sudo chmod -R 755 $TARGET_DIR

echo "✅ Deployment Complete!"
echo "👉 Visit: https://farmer.selfmade.lol"
