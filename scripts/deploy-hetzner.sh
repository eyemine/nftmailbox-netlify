#!/bin/bash
# Deploy nftmail.box to Hetzner server
# Usage: ./deploy-hetzner.sh [server-ip]

set -e

SERVER_IP=${1:-"46.225.158.75"}
SERVER_USER="root"
APP_NAME="nftmail"
REMOTE_DIR="/opt/$APP_NAME"

echo "📦 Building Docker image locally..."
docker build -t $APP_NAME:latest .

echo "🚀 Saving image to tar..."
docker save $APP_NAME:latest | gzip > $APP_NAME.tar.gz

echo "📤 Copying to Hetzner..."
scp $APP_NAME.tar.gz $SERVER_USER@$SERVER_IP:/tmp/
scp docker-compose.yml $SERVER_USER@$SERVER_IP:$REMOTE_DIR/
scp .env.example $SERVER_USER@$SERVER_IP:$REMOTE_DIR/.env

echo "🔧 Loading image on Hetzner..."
ssh $SERVER_USER@$SERVER_IP "docker load < /tmp/$APP_NAME.tar.gz"
ssh $SERVER_USER@$SERVER_IP "rm /tmp/$APP_NAME.tar.gz"

echo "🔄 Restarting service..."
ssh $SERVER_USER@$SERVER_IP "cd $REMOTE_DIR && docker-compose down && docker-compose up -d"

echo "✅ Deployment complete!"
