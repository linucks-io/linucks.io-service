# Step 1: Generate letsencrypt TLS keys (maybe using certbot) and place them in /certs

ln -sf /noVNC/vnc.html /noVNC/index.html
# rm -rf /noVNC/vnc.html /noVNC/vnc_lite.html

# without SSL
/noVNC/utils/launch.sh --vnc localhost:5900

# with SSL
# /noVNC/utils/launch.sh --vnc localhost:5900 --cert /certs/fullchain1.pem --key /certs/privkey1.pem --ssl-only