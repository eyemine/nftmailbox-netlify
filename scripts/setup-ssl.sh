#!/bin/bash
# SSL setup for nftmail.box using Let's Encrypt
# Run this on Hetzner after nginx is configured

set -e

echo "🔐 Setting up SSL with Let's Encrypt..."

# Stop nginx temporarily to allow certbot to use port 80
systemctl stop nginx

# Obtain SSL certificate
certbot certonly --standalone \
  -d nftmail.box \
  -d www.nftmail.box \
  --email your-email@example.com \
  --agree-tos \
  --non-interactive

# Start nginx
systemctl start nginx

# Setup auto-renewal
echo "0 0 * * 0 certbot renew --quiet && systemctl reload nginx" | crontab -

echo "✅ SSL setup complete!"
echo "Certificate location: /etc/letsencrypt/live/nftmail.box/"
