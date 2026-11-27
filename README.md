# 🐧 PenguinPath - Sistema de Aprendizaje Linux

Sistema interactivo de aprendizaje de comandos Linux con gamificación y terminal virtual.

## Requisitos

### Para ejecutar con Docker (recomendado)

- Git.
- Docker Desktop en Windows/macOS, o Docker Engine en Linux.
- Docker Compose v2 (`docker compose version`).
- Docker debe estar iniciado y configurado para usar contenedores Linux. En Windows, Docker Desktop con WSL 2 es la opción recomendada.
- Conexión a Internet la primera vez, para descargar imágenes y dependencias.

Node.js y pnpm no son necesarios para el inicio con Docker: las imágenes instalan las dependencias del proyecto. Son necesarios si vas a ejecutar comandos de Node/pnpm directamente en tu equipo.

### Para desarrollo o pruebas fuera de Docker

- Node.js 20.19 o superior de la rama 20, o Node.js 22.12 o superior.
- npm (incluido con Node.js) y pnpm. Puedes instalar pnpm con:

  ```bash
  npm install -g pnpm
  ```

- PostgreSQL 16 si también ejecutarás el backend fuera de Docker.

## Inicio local con Docker

Ejecuta estos pasos desde una terminal en la raíz del repositorio.

### 1. Clonar el proyecto

```bash
git clone https://github.com/CristianCortes1/Sistema-de-aprendizaje-Linux.git
cd Sistema-de-aprendizaje-Linux
```

### 2. Crear el archivo `.env`

Crea `.env` en la raíz del repositorio, al mismo nivel que `docker-compose.dev.yml`:

```env
JWT_SECRET=pon_aqui_un_valor_aleatorio_largo
SENDGRID_API_KEY=
```

Puedes generar un valor aleatorio para `JWT_SECRET` con Node.js:

```bash
node -e "console.log(require('node:crypto').randomBytes(64).toString('hex'))"
```

Copia el resultado después de `JWT_SECRET=`. Si quieres que la aplicación envíe correos de confirmación, coloca una API key válida de SendGrid en `SENDGRID_API_KEY`. Sin un proveedor de correo configurado, la aplicación puede iniciar, pero no podrás recibir los enlaces de confirmación. El remitente utilizado por el código también debe estar verificado en SendGrid.

El `.env` de la raíz se usa para la interpolación de Docker Compose. No copies `Backend/.env.example` para este modo: sus valores de base de datos están pensados para una conexión local fuera de Docker.

### 3. Construir la imagen Ubuntu del terminal

La aplicación crea contenedores Linux para su terminal interactiva. Esa imagen personalizada no se construye automáticamente junto con Compose; créala una vez:

```bash
docker build -f Backend/Dockerfile.ubuntu-user -t penguinpath-ubuntu:latest Backend
```

### 4. Construir e iniciar los servicios

```bash
docker compose -f docker-compose.dev.yml up -d --build
```

La primera construcción puede tardar varios minutos. El backend espera a que PostgreSQL esté listo, sincroniza el esquema usando `prisma db push` y después inicia NestJS.

### 5. Confirmar que arrancaron

```bash
docker compose -f docker-compose.dev.yml ps
docker compose -f docker-compose.dev.yml logs -f backend
```

Para salir de los logs sin detener los servicios, pulsa `Ctrl+C`.

### 6. Abrir la aplicación

- Frontend: <http://localhost:5173>
- Backend: <http://localhost:3000>
- Documentación Swagger: <http://localhost:3000/api>

No se crea automáticamente una cuenta de la aplicación. Regístrate con usuario y contraseña; Google OAuth no está configurado en este entorno. Para activar la cuenta y recibir el correo de confirmación necesitas configurar correctamente SendGrid. Sin correo, las cuentas nuevas quedan inactivas hasta confirmar la dirección.

PostgreSQL solo está disponible dentro de la red de Docker y no publica el puerto 5432 en el equipo anfitrión. Para entrar a la base, usa el comando indicado en la sección de comandos Docker.

### (Opcional) Crear un usuario y un administrador de prueba

Si prefieres tener cuentas listas para iniciar sesión, entra a PostgreSQL desde la raíz del proyecto:

```bash
docker compose -f docker-compose.dev.yml exec postgres psql -U postgres -d penguinpath
```

En el prompt de `psql` (`penguinpath=#`), ejecuta:

```sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;

INSERT INTO "Usuarios"
    ("username", "correo", "contraseña", "rol", "activo", "createdAt", "updatedAt")
VALUES
    ('admin', 'admin@test.com',
     crypt('AdminLocal-2026!', gen_salt('bf', 10)), 'admin', TRUE, NOW(), NOW()),
    ('usuario', 'usuario@test.com',
     crypt('UsuarioLocal-2026!', gen_salt('bf', 10)), 'usuario', TRUE, NOW(), NOW());
```

Inicia sesión con el nombre de usuario `admin` y la contraseña `AdminLocal-2026!`, o con `usuario` y `UsuarioLocal-2026!`. Estas son credenciales públicas de prueba: úsalas únicamente en la base local y no las reutilices en un servidor ni con datos reales. Sal de `psql` con `\q`.

## 📁 Estructura del Proyecto

```
Sistema-de-aprendizaje-Linux/
├── Backend/                 # API NestJS
│   ├── src/                  # Código fuente
│   ├── prisma/               # Schema de Prisma
│   ├── Dockerfile            # Imagen del backend
│   └── Dockerfile.ubuntu-user # Imagen de la terminal Linux
├── Frontend/                 # Aplicación Vue.js
│   ├── src/                  # Código fuente
│   ├── Dockerfile
│   └── nginx.dev.conf        # Nginx HTTP para desarrollo local
├── Documentacion/            # Documentación del proyecto
├── docker-compose.dev.yml # Desarrollo local
└── docker-compose.yml     # Configuración con HTTPS/certificados
```

## 🐳 Comandos Docker Útiles

Los comandos usan Docker Compose v2. Si tu instalación solo reconoce `docker-compose`, reemplaza `docker compose` por `docker-compose`.

### Ver estado y logs

```bash
docker compose -f docker-compose.dev.yml ps
docker compose -f docker-compose.dev.yml logs -f
```

Para ver un servicio específico:

```bash
docker compose -f docker-compose.dev.yml logs -f backend
docker compose -f docker-compose.dev.yml logs -f frontend
docker compose -f docker-compose.dev.yml logs -f postgres
```

### Reiniciar servicios

```bash
docker compose -f docker-compose.dev.yml restart
docker compose -f docker-compose.dev.yml restart backend
```

### Detener servicios

```bash
# Detener sin borrar la base de datos
docker compose -f docker-compose.dev.yml down

# Detener y borrar el volumen de PostgreSQL (BORRA todos los datos locales)
docker compose -f docker-compose.dev.yml down -v
```

### Acceder a PostgreSQL

```bash
docker compose -f docker-compose.dev.yml exec postgres psql -U postgres -d penguinpath
```

Dentro de `psql`, usa `\dt` para listar tablas, `\d "Usuarios"` para ver una tabla y `\q` para salir. El puerto PostgreSQL no está publicado en el equipo anfitrión.

### Construir o reconstruir

```bash
# Reconstruir todos los servicios
docker compose -f docker-compose.dev.yml up -d --build

# Reconstruir solamente el backend
docker compose -f docker-compose.dev.yml up -d --build backend

# Reconstruir la imagen Ubuntu del terminal
docker build -f Backend/Dockerfile.ubuntu-user -t penguinpath-ubuntu:latest Backend
```

## 📚 Documentación

### Backend
- [Backend README](./Backend/README.md) - Guía completa del backend
- [API Documentation](./Backend/API_DOCUMENTATION.md) - Referencia de la API
- [Swagger UI](http://localhost:3000/api) - Documentación interactiva
- [Quick Start](./Backend/QUICK_START.md) - Inicio rápido

### Frontend
- [Frontend README](./Frontend/README.md) - Guía del frontend

### Proyecto
- [Documentación](./Documentacion/) - Diagramas y arquitectura

## 🛠️ Tecnologías

### Backend
- **Framework**: NestJS 11
- **Base de datos**: PostgreSQL 16
- **ORM**: Prisma 6
- **Autenticación**: JWT + Passport
- **WebSockets**: Socket.io
- **Contenedores**: Docker + Dockerode

### Frontend
- **Framework**: Vue.js 3
- **Build**: Vite
- **Estilos**: CSS/SCSS
- **HTTP**: Axios

### DevOps
- **Containerización**: Docker
- **Orquestación**: Docker Compose
- **Servidor**: Nginx (producción)

## 🔧 Desarrollo

El Compose de desarrollo construye una imagen del backend y una imagen estática del frontend; no monta el código fuente para hot reload. Después de cambiar código, reconstruye el servicio correspondiente:

```bash
docker compose -f docker-compose.dev.yml up -d --build backend
docker compose -f docker-compose.dev.yml up -d --build frontend
```

Para ejecutar comandos de desarrollo o pruebas directamente en el equipo, instala Node.js y pnpm y luego las dependencias en la carpeta correspondiente:

```bash
cd Backend
pnpm install
pnpm test
```

```bash
cd Frontend
pnpm install
pnpm run type-check
```

Ejecutar el backend fuera de Docker requiere una instancia local de PostgreSQL y un `DATABASE_URL` válido en `Backend/.env`. Para el terminal virtual también se necesita Docker Engine y la imagen `penguinpath-ubuntu:latest`.

## 🧪 Testing

Los contenedores de Compose están preparados para ejecutar la aplicación, no incluyen todas las dependencias de desarrollo. Ejecuta las pruebas desde el equipo anfitrión después de instalar las dependencias:

```bash
cd Backend
pnpm test
pnpm run test:e2e
```

El frontend ofrece pruebas E2E con `pnpm run test:e2e:basic` desde `Frontend`; requieren que el navegador y el servidor estén disponibles.

## Despliegue

Esta guía cubre el entorno local de `docker-compose.dev.yml`. La configuración de [docker-compose.yml](./docker-compose.yml) usa HTTPS y requiere certificados válidos de Let's Encrypt montados en el equipo. No la uses para el primer inicio local.

## Variables de entorno

Para Docker, crea `.env` en la raíz del repositorio. Compose usa `JWT_SECRET` y `SENDGRID_API_KEY`; la conexión a PostgreSQL ya está configurada dentro de `docker-compose.dev.yml` y no debe usar `localhost` desde el contenedor backend.

La configuración actual del módulo JWT contiene una clave local fija; cambiar `JWT_SECRET` en `.env` no cambia esa clave hasta que el código la lea desde la variable de entorno.

Para recibir correos de registro y restablecimiento de contraseña, configura `SENDGRID_API_KEY` con una clave válida y verifica el remitente que utiliza el servicio de correo. Además, para que el enlace del correo apunte al frontend local, agrega `FRONTEND_URL: http://localhost:5173` a `environment` del servicio `backend` en `docker-compose.dev.yml`.

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/amazing-feature`)
3. Commit tus cambios (`git commit -m 'Add amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la licencia MIT.

## 👥 Equipo

- **Equipo PenguinPath**
- Website: http://penguinpath.duckdns.org

## 🆘 Solución de Problemas

### El backend no se conecta a PostgreSQL

```bash
docker compose -f docker-compose.dev.yml ps
docker compose -f docker-compose.dev.yml logs postgres backend
```

Si aparece `P1000` después de cambiar la contraseña de PostgreSQL, el volumen puede conservar las credenciales de una inicialización anterior. Si puedes borrar los datos locales, recrea el volumen:

```bash
docker compose -f docker-compose.dev.yml down -v
docker compose -f docker-compose.dev.yml up -d --build
```

`down -v` elimina la base de datos local.

### Prisma indica que falta una columna (`P2022`)

El entrypoint del backend ejecuta `prisma db push` al iniciar. Comprueba que estás usando la rama y el schema esperados y reconstruye el backend:

```bash
docker compose -f docker-compose.dev.yml up -d --build backend
docker compose -f docker-compose.dev.yml logs -f backend
```

### El terminal dice que no existe `penguinpath-ubuntu:latest`

Construye la imagen personalizada desde la raíz del proyecto:

```bash
docker build -f Backend/Dockerfile.ubuntu-user -t penguinpath-ubuntu:latest Backend
```

### Nginx no encuentra un certificado HTTPS

Para desarrollo local, inicia `docker-compose.dev.yml`, que monta `Frontend/nginx.dev.conf` y sirve por HTTP. La configuración de `docker-compose.yml` requiere certificados de producción.

### No llega el correo de confirmación

Comprueba que `SENDGRID_API_KEY` esté en el `.env` de la raíz, que la clave sea válida y que el remitente esté verificado en SendGrid. Revisa también que `FRONTEND_URL: http://localhost:5173` esté en el entorno del servicio `backend` en `docker-compose.dev.yml`.

### Advertencia sobre `version` en Compose

El aviso de que `version` está obsoleto no impide que Docker Compose inicie los servicios.

### Los cambios de código no se reflejan

```bash
docker compose -f docker-compose.dev.yml up -d --build
```

---

**¿Necesitas ayuda?** Consulta la [documentación completa](./Documentacion/) o contacta al equipo.
