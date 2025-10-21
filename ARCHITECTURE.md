# 🏗️ Arquitectura del Sistema - PenguinPath

## 📊 Diagrama de Red

```
                    Internet
                       ↓
              ┌────────────────┐
              │   Port 80/443  │
              │  (Público)     │
              └────────┬───────┘
                       ↓
              ┌────────────────────┐
              │   Nginx Frontend   │
              │  (penguinpath-     │
              │   frontend-prod)   │
              └────────┬───────────┘
                       │
         ┌─────────────┼─────────────┐
         ↓             ↓             ↓
    Static Files   /api/       /socket.io/
    (HTML/CSS/JS)     │             │
                      │             │
              ┌───────┴─────────────┴──┐
              │   Backend NestJS       │
              │   Port 3000 (INTERNO)  │
              │  (penguinpath-backend) │
              └───────┬────────────────┘
                      ↓
              ┌───────────────┐
              │  PostgreSQL   │
              │  Port 5432    │
              │  (INTERNO)    │
              └───────────────┘
```

## 🔒 Seguridad de Red

### Puertos Expuestos Públicamente:
- **80** - Frontend (HTTP)
- **443** - Frontend (HTTPS) - Opcional con SSL

### Puertos Internos (Solo red Docker):
- **3000** - Backend API (solo accesible desde frontend)
- **5432** - PostgreSQL (solo accesible desde backend)

### Ventajas:
✅ **Backend protegido** - No accesible directamente desde internet
✅ **Un solo punto de entrada** - Todo pasa por Nginx
✅ **Fácil configuración SSL** - Solo en el frontend
✅ **CORS simplificado** - Todo bajo el mismo dominio
✅ **Mejor performance** - Nginx cachea assets estáticos

## 🔄 Flujo de Requests

### 1. Request HTTP API (GET /users)
```
Usuario → http://3.14.29.219/api/users
         ↓
Nginx (frontend:80) → proxy_pass → backend:3000/users
         ↓
Backend procesa
         ↓
PostgreSQL query
         ↓
Respuesta JSON → Nginx → Usuario
```

### 2. Request WebSocket (Terminal)
```
Usuario → ws://3.14.29.219/socket.io
         ↓
Nginx (frontend:80) → proxy_pass → backend:3000/socket.io
         ↓
Backend crea contenedor Docker
         ↓
Stream bidireccional WebSocket
```

### 3. Assets Estáticos
```
Usuario → http://3.14.29.219/assets/logo.png
         ↓
Nginx sirve directamente desde /usr/share/nginx/html
         ↓
Cache-Control: 1 year
```

## 📝 Configuración Nginx

### Reverse Proxy para API REST:
```nginx
location /api/ {
    proxy_pass http://backend:3000/;
    # Headers para mantener contexto
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}
```

### Reverse Proxy para WebSocket:
```nginx
location /socket.io/ {
    proxy_pass http://backend:3000/socket.io/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_read_timeout 86400;  # 24h para conexiones largas
}
```

## 🚀 Despliegue

### Desarrollo Local:
```bash
docker-compose up
# Frontend: http://localhost:5173
# Backend: http://localhost:3000 (expuesto para debugging)
```

### Producción:
```bash
docker-compose -f docker-compose.prod.yml up -d
# Solo Frontend expuesto: http://3.14.29.219
# Backend en red interna, no accesible directamente
```

## 🔧 Variables de Entorno

### Frontend (`VITE_API_URL`):
- **Desarrollo:** `http://localhost:3000` (backend directo)
- **Producción:** `/api` (Nginx reverse proxy)

### Backend:
- **DATABASE_URL:** Conexión a PostgreSQL (red interna)
- **DOCKER_HOST:** `unix:///var/run/docker.sock`
- **AWS_SES_*:** Configuración de emails
- **JWT_SECRET:** Firma de tokens

## 📊 Monitoreo

### Health Checks:
- Frontend: `http://3.14.29.219/health`
- Backend (interno): `http://backend:3000/health`
- PostgreSQL: Docker healthcheck automático

### Logs:
```bash
# Ver logs del frontend (Nginx)
docker logs penguinpath-frontend-prod -f

# Ver logs del backend
docker logs penguinpath-backend-prod -f

# Ver logs de base de datos
docker logs penguinpath-db-prod -f
```

## 🛡️ Mejoras Futuras de Seguridad

- [ ] Rate limiting en Nginx
- [ ] SSL/TLS con Let's Encrypt
- [ ] Firewall rules (UFW/iptables)
- [ ] Fail2ban para intentos de login
- [ ] WAF (Web Application Firewall)
- [ ] VPN para acceso admin

## 📚 Referencias

- [Nginx Reverse Proxy](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/)
- [Docker Networking](https://docs.docker.com/network/)
- [NestJS Behind Proxy](https://docs.nestjs.com/faq/http-adapter#proxy)
