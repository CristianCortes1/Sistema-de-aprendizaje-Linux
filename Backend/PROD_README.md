Production deployment (simple two-container setup)
===============================================

This guide explains how to deploy a minimal production setup that runs two containers on the same Docker network:
- `ubuntu-service`: an Ubuntu container with SSH (devuser / 1234) used as the remote shell target.
- `backend`: your NestJS backend image which connects to `ubuntu-service` via SSH and exposes the API on port 3000.

WARNING: this is intended for staging / controlled environments. It is NOT production hardened. Read the security notes.

Prerequisites (on a Linux VPS, e.g. Ubuntu 22.04)
-------------------------------------------------
- Docker Engine (install with the official script or your distro package manager)
- Docker Compose (v2) or the built-in `docker compose` plugin
- A user with sudo privileges

Quick install (Ubuntu example):

```bash
sudo apt update
sudo apt install -y ca-certificates curl gnupg
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
sudo usermod -aG docker $USER
```

Deploy the compose stack
------------------------
1. Copy your repository or only the `Backend` folder to the server.
2. From the `Backend` folder run:

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

3. Check containers and logs:

```bash
docker ps
docker logs -f nest-backend
```

Notes
-----
- The compose file uses `TARGET_HOST=ubuntu-service` so the backend can `ssh` to the ubuntu container by its service name (DNS resolution is provided by Docker network).
- If you need to reach the Ubuntu container from the outside for debugging, uncomment the `ports` mapping in `docker-compose.prod.yml` (mapped to host port 2222 -> container 22).
- Change credentials: `devuser:1234` is intentionally weak and only for testing. Use keys and stronger passwords in real environments.

Security recommendations (must do for real production)
----------------------------------------------------
- Do NOT expose container shells directly to the public internet.
- Use SSH keys instead of passwords. Store private keys in Railway/host secret manager.
- Add network/firewall rules to restrict inbound access.
- Consider using a bastion host or reverse-proxy with auth.
- Replace the ubuntu image with a minimal, hardened image and remove unnecessary packages.

If you want I can:
- Add SSH key support (configure backend to use a private key from env var `TARGET_SSH_KEY`).
- Add healthchecks and readiness probes to the compose file.
- Help you harden the flow (locker, per-session containers, resource limits).
