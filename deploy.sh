#!/bin/bash
# deploy.sh - One-time deployment script for GitHub Pages user site

echo "Building site..."
npm run build

echo "Creating temporary deployment directory..."
mkdir -p deploy-temp
cp -r _site/* deploy-temp/

echo "Initializing git repo in deploy directory..."
cd deploy-temp
git init
git add -A
git commit -m "Deploy $(date +'%Y-%m-%d %H:%M:%S')"

echo "Adding remote and pushing..."
git remote add origin https://github.com/juntz-g1thub/juntz-g1thub.github.io.git
git branch -M main
git push -f origin main

echo "Cleaning up..."
cd ..
rm -rf deploy-temp

echo "✅ Deployment complete! Visit: https://juntz-g1thub.github.io"