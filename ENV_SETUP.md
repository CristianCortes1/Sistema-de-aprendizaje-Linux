# 🔧 Configuración de Entornos - PenguinPath

## 📋 Archivos de Entorno

El proyecto tiene tres archivos de configuración:

1. **`.env`** - Desarrollo (actual)
2. **`.env.production`** - Producción (respaldo)
3. **`.env.example`** - Plantilla (Backend/)

## 🚀 Configuración Actual (Desarrollo)

Tu archivo `.env` ahora está configurado para **desarrollo local con Docker**:

```env
# Base de datos
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/penguinpath

# Backend
NODE_ENV=development
JWT_SECRET=dev-secret-key-change-in-production

# Frontend
FRONTEND_URL=http://localhost:5173

# CORS
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
```

## 🔄 Cambiar entre Entornos

### Para Desarrollo Local

```bash
# Ya está configurado en .env
docker-compose -f docker-compose.dev.yml up -d
```

### Para Producción

```bash
# Opción 1: Copiar el archivo de producción
cp .env.production .env

# Opción 2: Usar el archivo directamente
docker-compose -f docker-compose.prod.yml --env-file .env.production up -d
```

## 📝 Diferencias Clave

| Configuración | Desarrollo | Producción |
|---------------|------------|------------|
| NODE_ENV | development | production |
| Base de datos | postgres/postgres | credenciales seguras |
| Frontend URL | localhost:5173 | IP del servidor |
| JWT Secret | dev-secret-key | clave aleatoria segura |
| Email | Opcional | SendGrid configurado |
| CORS | localhost | IP del servidor |

## ⚙️ Cómo Funciona con Docker Compose

### docker-compose.dev.yml

Lee automáticamente el archivo `.env` de la raíz:

```yaml
environment:
  DATABASE_URL: ${DATABASE_URL}
  JWT_SECRET: ${JWT_SECRET}
  # ... otras variables
```

### Iniciar con variables personalizadas

```bash
# Usar .env (por defecto)
docker-compose -f docker-compose.dev.yml up -d

# Usar otro archivo
docker-compose -f docker-compose.dev.yml --env-file .env.custom up -d
```

## 🔒 Seguridad

### ⚠️ IMPORTANTE

Los archivos `.env`, `.env.production` y `.env.local` están en `.gitignore` y **NO se suben a GitHub**.

### Variables Sensibles

Nunca compartas públicamente:
- ✅ JWT_SECRET
- ✅ POSTGRES_PASSWORD
- ✅ SENDGRID_API_KEY
- ✅ ENCRYPTION_KEY
- ✅ SESSION_SECRET

### Generar Claves Seguras

```bash
# En Linux/Mac
openssl rand -base64 32

# En Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# En PowerShell (Windows)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

## 📧 Configuración de Email (Opcional)

### Para desarrollo (opcional)

Puedes comentar las variables de email o dejarlas vacías:

```env
# SENDGRID_API_KEY=
# EMAIL_FROM=
```

### Para producción (requerido)

Descomenta y configura:

```env
SENDGRID_API_KEY=tu-api-key-real
EMAIL_FROM=tu-email@dominio.com
```

## 🧪 Probar la Configuración

### 1. Verificar que las variables se cargan

```bash
docker-compose -f docker-compose.dev.yml config
```

### 2. Ver las variables en el contenedor

```bash
docker exec -it penguinpath-backend env | grep DATABASE_URL
docker exec -it penguinpath-backend env | grep NODE_ENV
```

### 3. Probar la conexión

```bash
# Iniciar los servicios
docker-compose -f docker-compose.dev.yml up -d

# Ver logs
docker-compose -f docker-compose.dev.yml logs -f backend

# Deberías ver:
# ✅ Conexión a PostgreSQL exitosa
# ✅ Aplicación corriendo en http://localhost:3000
```

## 🔄 Cambiar Configuración

### Si cambias el .env

```bash
# Reiniciar los servicios para aplicar cambios
docker-compose -f docker-compose.dev.yml down
docker-compose -f docker-compose.dev.yml up -d
```

### Si cambias credenciales de base de datos

```bash
# Borrar volúmenes y reiniciar
docker-compose -f docker-compose.dev.yml down -v
docker-compose -f docker-compose.dev.yml up -d
```

## 📋 Checklist de Configuración

### Desarrollo
- [x] `.env` configurado con valores de desarrollo
- [x] `NODE_ENV=development`
- [x] Credenciales simples (postgres/postgres)
- [x] CORS permite localhost
- [ ] Email opcional

### Producción
- [x] `.env.production` guardado con credenciales reales
- [x] `NODE_ENV=production`
- [x] Credenciales seguras y aleatorias
- [x] CORS configurado para IP del servidor
- [x] SendGrid configurado

## 🆘 Solución de Problemas

### Error: "no pg_hba.conf entry"

Tu `DATABASE_URL` no coincide con las credenciales de PostgreSQL:

```bash
# Verifica el .env
cat .env | grep DATABASE_URL

# Verifica docker-compose.dev.yml
grep POSTGRES_ docker-compose.dev.yml
```

### Las variables no se aplican

```bash
# Reinicia completamente
docker-compose -f docker-compose.dev.yml down
docker-compose -f docker-compose.dev.yml up -d

# Verifica que se cargaron
docker-compose -f docker-compose.dev.yml config
```

### Email no funciona

En desarrollo, los emails son opcionales. El token de confirmación se imprime en los logs:

```bash
docker-compose -f docker-compose.dev.yml logs -f backend | grep token
```

## 📚 Más Información

- [README Principal](./README.md)
- [Documentación del Backend](./Backend/README.md)
- [Guía de Despliegue](./deploy-vps.sh)

---

**Recuerda:** 
- ✅ `.env` = Desarrollo
- ✅ `.env.production` = Producción (respaldo)
- ✅ Nunca subas archivos `.env` a Git
- ✅ Regenera claves antes de producción
