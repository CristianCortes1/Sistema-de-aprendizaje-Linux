# Fix Deployment Issues

## Problem Summary
1. Git permission error on VPS
2. `pnpm-lock.yaml` not found during Docker build
3. Deploy script pulling from wrong branch

## Solution Steps

Run these commands on your VPS (via SSH):

### Step 1: Fix Git Permissions
```bash
cd ~/Sistema-de-aprendizaje-Linux
sudo chown -R ubuntu:ubuntu .git
sudo chmod -R u+rw .git
```

### Step 2: Pull from correct branch
```bash
git pull origin docker
```

### Step 3: Check if pnpm-lock.yaml exists in Backend
```bash
ls -la Backend/pnpm-lock.yaml
```

### If pnpm-lock.yaml is missing (Step 4a):
```bash
cd Backend
pnpm install
git add pnpm-lock.yaml
git commit -m "Add pnpm-lock.yaml"
git push origin docker
cd ..
```

### If pnpm-lock.yaml exists (Step 4b):
The file should already be there. If git shows it as modified:
```bash
cd Backend
git status
# If modified, commit it
git add pnpm-lock.yaml
git commit -m "Update pnpm-lock.yaml"
git push origin docker
cd ..
```

### Step 5: Run deployment
```bash
sudo ./deploy-vps.sh
```

## Alternative: Run deployment without sudo (if permissions allow)
```bash
# Give ubuntu user docker permissions if not already done
sudo usermod -aG docker ubuntu
# Logout and login again for changes to take effect
exit
# SSH back in
ssh -i ~/.ssh/PenguinPath.pem ubuntu@3.14.29.219
# Try deployment without sudo
cd ~/Sistema-de-aprendizaje-Linux
./deploy-vps.sh
```

## Note about pnpm-lock.yaml
This file should be committed to git. Check your local repository:
```bash
git status Backend/pnpm-lock.yaml
git ls-files Backend/pnpm-lock.yaml
```

If it's not tracked, you need to commit it locally and push to the `docker` branch.
