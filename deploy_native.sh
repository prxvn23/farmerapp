#!/bin/bash
set -e  # 🛑 Exit immediately if any command fails

echo "🚀 Starting Native Deployment..."

# 1. Install Backend Dependencies
echo "📦 Installing Backend Dependencies..."
cd backend

# FIX: Resolve dependencies for this specific environment
if [ -f "composer.lock" ]; then
    echo "⚠️ Removing composer.lock to resolve dependencies..."
    rm composer.lock
fi

# Force compatible versions
echo "🔧 Adjusting dependencies..."
composer require endroid/qr-code:"^6.0" --no-update 
composer require mongodb/mongodb:"^1.15" --no-update 

composer install --no-dev --optimize-autoloader
cd ..

# 2. Build Frontend
echo "⚛️ Building Frontend..."
cd client
npm install && npm install lucide-react framer-motion # Ensure new deps are installed
CI=false npm run build  # CI=false prevents warnings from failing build
cd ..

# Check if build worked
if [ ! -f "client/build/index.html" ]; then
    echo "❌ BUILD FAILED: client/build/index.html not found!"
    exit 1
fi

# 3. Deploy to Apache Root
TARGET_DIR="$HOME/htdocs"

echo "📂 Deploying to $TARGET_DIR..."

# Clear old files
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

# Create and Fix Uploads Directory
if [ ! -d "$TARGET_DIR/uploads" ]; then
    echo "📂 Creating uploads directory..."
    mkdir -p "$TARGET_DIR/uploads"
fi
sudo chown -R www-data:www-data "$TARGET_DIR/uploads"
sudo chmod -R 777 "$TARGET_DIR/uploads"

echo "✅ Deployment Complete!"
echo "👉 Visit: https://farmer.selfmade.lol"
