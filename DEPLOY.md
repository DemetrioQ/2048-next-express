# Deployment Guide

This guide covers deploying the 2048 app (Next.js frontend + Express backend) to a Linux VPS using Docker Compose. The result is two containers behind an Nginx reverse proxy with HTTPS.

---

## Prerequisites

- A VPS running Ubuntu 22.04+ (DigitalOcean, Hetzner, Linode, etc.) with at least 1 GB RAM
- A domain name with two DNS A records pointing to your VPS IP:
  - `yourdomain.com` → frontend (Next.js)
  - `api.yourdomain.com` → backend (Express)
- Root or sudo access on the server

---

## 1. Provision the server

SSH into your server and update packages:

```bash
apt update && apt upgrade -y
```

Install Docker and Docker Compose:

```bash
curl -fsSL https://get.docker.com | sh
apt install -y docker-compose-plugin
```

Verify:

```bash
docker --version
docker compose version
```

---

## 2. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/2048-next-express.git
cd 2048-next-express
```

---

## 3. Create environment files

### Backend — `apps/2048-express/.env`

```env
NODE_ENV=production
PORT=8000
FRONTEND_URL=https://yourdomain.com

MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/2048?retryWrites=true&w=majority

SESSION_SECRET=replace-with-a-long-random-string
JWT_ACCESS_SECRET=replace-with-a-long-random-string
JWT_REFRESH_SECRET=replace-with-a-long-random-string

GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

UPLOADTHING_TOKEN=your-uploadthing-token
RESEND_API_KEY=your-resend-api-key
```

### Frontend — `apps/2048-next/.env`

```env
NEXT_PUBLIC_BACKEND_URL=https://api.yourdomain.com
NEXT_PUBLIC_FRONTEND_URL=https://yourdomain.com
UPLOADTHING_TOKEN=your-uploadthing-token
EMAIL_VALIDATION_COOLDOWN_IN_MINUTES=1
```

### Root `.env` (for docker-compose build args)

Create a `.env` file at the repo root so Docker Compose can read the `NEXT_PUBLIC_` vars at build time:

```env
NEXT_PUBLIC_BACKEND_URL=https://api.yourdomain.com
NEXT_PUBLIC_FRONTEND_URL=https://yourdomain.com
```

> **Security note:** None of these `.env` files are committed to git (they are gitignored). Never commit secrets.

---

## 4. Configure OAuth callback URLs

In Google Cloud Console and GitHub OAuth app settings, add these callback URLs:

| Provider | Callback URL |
|---|---|
| Google | `https://api.yourdomain.com/auth/google/callback` |
| GitHub | `https://api.yourdomain.com/auth/github/callback` |

---

## 5. Build and start the containers

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

Check that both containers are running:

```bash
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs -f
```

The services are now listening on:
- Frontend: port `3000`
- Backend: port `8000`

---

## 6. Set up Nginx as a reverse proxy

Install Nginx:

```bash
apt install -y nginx
```

Create a config file for each service:

**`/etc/nginx/sites-available/2048-frontend`**

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
    }
}
```

**`/etc/nginx/sites-available/2048-backend`**

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the sites and reload Nginx:

```bash
ln -s /etc/nginx/sites-available/2048-frontend /etc/nginx/sites-enabled/
ln -s /etc/nginx/sites-available/2048-backend /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
```

---

## 7. Enable HTTPS with Let's Encrypt

Install Certbot:

```bash
apt install -y certbot python3-certbot-nginx
```

Get certificates for both domains:

```bash
certbot --nginx -d yourdomain.com -d api.yourdomain.com
```

Certbot will automatically update the Nginx configs to redirect HTTP → HTTPS and add SSL configuration. Certificates auto-renew via a cron job installed by Certbot.

---

## 8. Firewall

Allow only the necessary ports:

```bash
ufw allow ssh
ufw allow 80
ufw allow 443
ufw enable
```

Do NOT expose ports 3000 or 8000 to the public — traffic should flow through Nginx.

---

## Updating the deployment

To deploy a new version:

```bash
git pull
docker compose -f docker-compose.prod.yml up -d --build
```

Docker Compose will rebuild changed images and restart only the affected containers. Old images can be pruned with:

```bash
docker image prune -f
```

---

## Viewing logs

```bash
# All services
docker compose -f docker-compose.prod.yml logs -f

# Single service
docker compose -f docker-compose.prod.yml logs -f backend
docker compose -f docker-compose.prod.yml logs -f frontend
```

---

## Troubleshooting

**Next.js standalone server.js not found**
The Next.js standalone build places `server.js` at the root of `.next/standalone/`. If the CMD fails, check the build output inside the container:
```bash
docker compose -f docker-compose.prod.yml run --rm frontend ls -la
```

**Backend can't connect to MongoDB**
- Check that `MONGO_URI` is correct and the Atlas cluster allows connections from your VPS IP (or `0.0.0.0/0` for all IPs in Atlas Network Access settings).

**CORS errors in the browser**
- Ensure `FRONTEND_URL` in the backend `.env` matches the exact origin (including `https://` and no trailing slash).

**OAuth redirects fail**
- Confirm callback URLs in Google/GitHub match exactly what the backend uses: `https://api.yourdomain.com/auth/google/callback`.
