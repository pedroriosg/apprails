#!/bin/sh

echo "Starting certbot..."
mkdir -p /var/www/html
certbot certonly --webroot --webroot-path=/var/www/html --email jasilvamc@gmail.com --agree-tos --no-eff-email --staging -d buyingnewsoul.me

# echo "Reloading nginx..."
# nginx -s reload

# echo "Renewing certificates..."
# nginx -s reload
# while :; do
#   certbot renew
#   sleep 12h
# done