# 🚀 Guía de Despliegue en Producción

## ⚠️ Importante: Railway NO es compatible

Este proyecto usa **Docker-in-Docker** para crear contenedores de terminal por usuario. Plataformas como Railway, Render, Heroku **NO permiten** montar el socket de Docker por razones de seguridad.

**Necesitas un VPS con Docker instalado.**

---

## 📋 Requisitos

- VPS con Ubuntu 20.04+ o Debian 11+
- Docker y Docker Compose instalados
- Acceso SSH al servidor
- Dominio apuntando al servidor (opcional, para HTTPS)
- Mínimo 2GB RAM, 2 CPU cores, 20GB disco

---

## 🎯 Opciones de Hosting

### ✅ Recomendados (soportan Docker-in-Docker):

1. **DigitalOcean Droplet** ($6-12/mes)
   - Droplet con Docker preinstalado
   - IP pública incluida
   - Fácil de configurar

2. **AWS EC2** (Free tier disponible)
   - t2.micro para pruebas
   - t2.small para producción
   - Configurar Security Groups

3. **Linode** ($5-10/mes)
   - Buena relación precio/rendimiento
   - IP pública incluida

4. **Vultr** ($6-12/mes)
   - Similar a DigitalOcean
   - Múltiples ubicaciones

5. **Hetzner Cloud** (€4-8/mes)
   - Muy económico
   - Excelente rendimiento

### ❌ NO Compatible:
- Railway
- Render
- Heroku
- Vercel
- Netlify

---

## 🛠️ Instalación en VPS

### 1. Conectar al servidor

```bash
ssh root@tu-servidor-ip
```

### 2. Instalar Docker (si no está instalado)

```bash
# Actualizar sistema
apt update && apt upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Instalar Docker Compose
apt install docker-compose-plugin -y

# Verificar instalación
docker --version
docker compose version
```

### 3. Clonar repositorio

```bash
# Instalar git si no está
apt install git -y

# Clonar proyecto
git clone https://github.com/cristianCortes1/Sistema-de-aprendizaje-Linux.git
cd Sistema-de-aprendizaje-Linux
git checkout docker
```

### 4. Configurar variables de entorno

```bash
# Copiar ejemplo
cp .env.production.example .env.production

# Editar con tus valores
nano .env.production
```

Completa:
```bash
POSTGRES_USER=postgres
POSTGRES_PASSWORD=TU_PASSWORD_MUY_SEGURO
POSTGRES_DB=penguinpath
JWT_SECRET=TU_JWT_SECRET_DE_AL_MENOS_32_CARACTERES_ALEATORIOS
FRONTEND_URL=https://tu-dominio.com  # o http://tu-ip
```

Guarda con `Ctrl+O`, `Enter`, `Ctrl+X`

### 5. Construir imagen de Ubuntu

```bash
cd Backend
docker build -f Dockerfile.ubuntu-user -t ubuntu-user .
cd ..
```

### 6. Desplegar

```bash
# Dar permisos al script
chmod +x deploy-vps.sh

# Ejecutar despliegue
./deploy-vps.sh
```

---

## 🌐 Configurar Dominio (Opcional)

### Con dominio propio:

1. **Apuntar DNS a tu servidor:**
   - Tipo A: `@` → `TU_IP_SERVIDOR`
   - Tipo A: `www` → `TU_IP_SERVIDOR`

2. **Instalar Nginx Proxy Manager** (recomendado):

```bash
# Crear carpeta
mkdir nginx-proxy-manager
cd nginx-proxy-manager

# Crear docker-compose.yml
cat > docker-compose.yml << 'EOF'
version: '3.8'
services:
  app:
    image: 'jc21/nginx-proxy-manager:latest'
    restart: unless-stopped
    ports:
      - '80:80'
      - '443:443'
      - '81:81'
    volumes:
      - ./data:/data
      - ./letsencrypt:/etc/letsencrypt
EOF

# Iniciar
docker-compose up -d
```

3. **Configurar proxy:**
   - Ir a `http://TU_IP:81`
   - Login: `admin@example.com` / `changeme`
   - Cambiar contraseña
   - Agregar Proxy Host:
     - Domain: `tu-dominio.com`
     - Forward to: `penguinpath-frontend-prod:80`
     - SSL: Solicitar certificado Let's Encrypt

---

## 🔒 Seguridad

### Firewall (ufw):

```bash
# Instalar
apt install ufw -y

# Configurar
ufw allow 22/tcp   # SSH
ufw allow 80/tcp   # HTTP
ufw allow 443/tcp  # HTTPS
ufw enable
```

### Actualizar contraseñas:

```bash
# Cambiar password de root
passwd

# Crear usuario no-root
adduser deploy
usermod -aG sudo deploy
usermod -aG docker deploy

# Deshabilitar login root
nano /etc/ssh/sshd_config
# Cambiar: PermitRootLogin no
systemctl restart ssh
```

---

## 📊 Monitoreo

### Ver logs:

```bash
# Todos los servicios
docker-compose -f docker-compose.prod.yml logs -f

# Solo backend
docker-compose -f docker-compose.prod.yml logs -f backend

# Últimas 50 líneas
docker-compose -f docker-compose.prod.yml logs --tail 50
```

### Ver contenedores de usuarios:

```bash
docker ps | grep penguinpath-user
```

### Estado de servicios:

```bash
docker-compose -f docker-compose.prod.yml ps
```

---

## 🔄 Actualizar

```bash
cd Sistema-de-aprendizaje-Linux
./deploy-vps.sh
```

---

## 🆘 Troubleshooting

### Servicios no inician:

```bash
docker-compose -f docker-compose.prod.yml logs
```

### Base de datos no conecta:

```bash
docker-compose -f docker-compose.prod.yml exec postgres psql -U postgres
```

### Limpiar contenedores huérfanos:

```bash
docker ps -a | grep penguinpath-user | awk '{print $1}' | xargs docker rm -f
```

### Reiniciar todo:

```bash
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d
```

---

## 💰 Costos Estimados

- **DigitalOcean Droplet 2GB**: $12/mes
- **Dominio (.com)**: $10-15/año
- **Total**: ~$13-14/mes

**Gratis** si usas:
- AWS Free Tier (12 meses)
- Freenom domain (.tk, .ml, etc.)
- **Total primer año**: $0

---

## 📞 Soporte

Si tienes problemas:
1. Revisa logs: `docker-compose -f docker-compose.prod.yml logs`
2. Verifica variables de entorno en `.env.production`
3. Confirma que Docker socket está montado: `ls -la /var/run/docker.sock`
