#!/bin/bash
# Hetzner server setup for nftmail.box
# Run this on the Hetzner server first

set -e

echo "🔧 Updating system..."
apt update && apt upgrade -y

echo "🐳 Installing Docker..."
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
usermod -aG docker root

echo "🌐 Installing Nginx..."
apt install -y nginx certbot python3-certbot-nginx

echo "📁 Creating app directory..."
mkdir -p /opt/nftmail

echo "🔥 Configuring firewall..."
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

echo "✅ Server setup complete!"
echo "Next steps:"
echo "1. Copy docker-compose.yml and .env to /opt/nftmail"
echo "2. Configure nginx reverse proxy"
echo "3. Run certbot for SSL"
