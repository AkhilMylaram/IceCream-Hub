# =============================================================
#  IceCream Hub — NGINX Dockerfile
#  Base: nginx:1.25-alpine (smallest production-ready image)
#  Purpose: Reverse proxy + static asset cache
# =============================================================

FROM nginx:1.25-alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy our custom configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Create cache directory with correct permissions
RUN mkdir -p /var/cache/nginx && chown -R nginx:nginx /var/cache/nginx

# Expose HTTP port
EXPOSE 80

# Nginx runs in foreground by default in the official image
CMD ["nginx", "-g", "daemon off;"]
