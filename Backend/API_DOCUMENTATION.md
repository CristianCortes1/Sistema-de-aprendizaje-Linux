# 📚 Documentación de la API - PenguinPath

## 🚀 Introducción

Esta es la documentación de la API REST del **Sistema de Aprendizaje Linux - PenguinPath**. La API está construida con NestJS y utiliza Swagger/OpenAPI para documentación interactiva.

## 🌐 URLs

- **Desarrollo**: `http://localhost:3000`
- **Producción**: `http://penguinpath.duckdns.org`
- **Documentación Swagger**: `http://localhost:3000/api`

## 🔑 Autenticación

La API utiliza **JWT (JSON Web Tokens)** para autenticación. 

### Cómo autenticarse:

1. Registra un usuario en `/auth/register`
2. Confirma tu email con el token recibido
3. Inicia sesión en `/auth/login` para obtener tu token JWT
4. Incluye el token en el header `Authorization: Bearer <tu-token>` en las peticiones protegidas

## 📋 Endpoints Principales

### 🔐 Autenticación (`/auth`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/auth/register` | Registrar nuevo usuario |
| POST | `/auth/login` | Iniciar sesión |
| GET | `/auth/confirm-email` | Confirmar email con token |
| GET | `/auth/test-email` | Probar servicio de email |

### 👥 Usuarios (`/users`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/users` | Obtener todos los usuarios |
| GET | `/users/ranking` | Obtener ranking por experiencia |
| GET | `/users/:id` | Obtener usuario por ID |
| POST | `/users` | Crear nuevo usuario |
| PATCH | `/users/:id` | Actualizar usuario |
| DELETE | `/users/:id` | Eliminar usuario |

### 📖 Lecciones (`/lessons`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/lessons` | Obtener todas las lecciones |
| GET | `/lessons/:id` | Obtener lección por ID |
| POST | `/lessons` | Crear nueva lección |
| PATCH | `/lessons/:id` | Actualizar lección |
| DELETE | `/lessons/:id` | Eliminar lección |

### 🎯 Retos (`/challenges`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/challenges` | Obtener todos los retos |
| GET | `/challenges/:id` | Obtener reto por ID |
| POST | `/challenges` | Crear nuevo reto |
| PATCH | `/challenges/:id` | Actualizar reto |
| DELETE | `/challenges/:id` | Eliminar reto |

### 💻 Comandos (`/commands`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/commands` | Obtener todos los comandos |
| GET | `/commands/:id` | Obtener comando por ID |
| POST | `/commands` | Crear nuevo comando |
| PATCH | `/commands/:id` | Actualizar comando |
| DELETE | `/commands/:id` | Eliminar comando |

### 📊 Progreso (`/progress`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/progress` | Obtener todos los progresos |
| GET | `/progress/:id` | Obtener progreso por ID |
| POST | `/progress` | Crear registro de progreso |
| PATCH | `/progress/:id` | Actualizar progreso |
| DELETE | `/progress/:id` | Eliminar progreso |

### 🎮 Items (`/items`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/items` | Obtener todos los items |
| GET | `/items/:id` | Obtener item por ID |
| POST | `/items` | Crear nuevo item |
| PATCH | `/items/:id` | Actualizar item |
| DELETE | `/items/:id` | Eliminar item |

## 📝 Ejemplos de Uso

### Registro de Usuario

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "correo": "johndoe@example.com",
    "password": "Password123!"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "password": "Password123!"
  }'
```

### Crear Lección

```bash
curl -X POST http://localhost:3000/lessons \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <tu-token>" \
  -d '{
    "titulo": "Comandos básicos",
    "retos": [
      {
        "descripcion": "Lista archivos del directorio",
        "Retroalimentacion": "Excelente!",
        "comandos": [
          { "comando": "ls" },
          { "comando": "ls -l" }
        ]
      }
    ]
  }'
```

### Obtener Ranking

```bash
curl -X GET http://localhost:3000/users/ranking
```

## 🔍 Códigos de Estado HTTP

| Código | Descripción |
|--------|-------------|
| 200 | OK - Solicitud exitosa |
| 201 | Created - Recurso creado exitosamente |
| 400 | Bad Request - Datos inválidos |
| 401 | Unauthorized - No autenticado |
| 403 | Forbidden - No autorizado |
| 404 | Not Found - Recurso no encontrado |
| 500 | Internal Server Error - Error del servidor |

## 🛠️ Modelos de Datos

### Usuario (User)

```typescript
{
  id: number;
  username: string;
  email: string;
  avatar?: string;
  rol: string;          // 'user', 'admin', 'moderator'
  activo: boolean;
  experiencia: number;
  monedas: number;
  racha: number;
  createdAt: Date;
  updatedAt: Date;
  ultimoLogin?: Date;
}
```

### Lección (Lesson)

```typescript
{
  id: number;
  titulo: string;
  retos: Reto[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Reto (Challenge)

```typescript
{
  id: number;
  descripcion: string;
  retroalimentacion?: string;
  leccionId: number;
  comandos: Comando[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Comando (Command)

```typescript
{
  id: number;
  comando: string;
  retoId: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### Progreso (Progress)

```typescript
{
  id: number;
  progress: number;     // 0-100
  userId: number;
  lessonId: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### Item

```typescript
{
  id: number;
  nombre: string;
  descripcion?: string;
  precio?: number;
  imagenUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## 🔄 Validaciones

Todas las entradas de datos son validadas usando `class-validator`:

- **username**: mínimo 3 caracteres, string no vacío
- **email**: formato de email válido
- **password**: mínimo 6 caracteres
- **progress**: número entero entre 0 y 100

## 🌟 Características

- ✅ Documentación interactiva con Swagger UI
- ✅ Validación automática de datos
- ✅ Autenticación JWT
- ✅ CORS habilitado
- ✅ Manejo de errores centralizado
- ✅ Transformación automática de tipos

## 📖 Documentación Interactiva

Para explorar y probar todos los endpoints de forma interactiva:

1. Inicia el servidor: `npm run start:dev`
2. Abre tu navegador en: `http://localhost:3000/api`
3. Explora todos los endpoints, modelos y prueba las peticiones directamente desde la interfaz

## 🤝 Soporte

Para reportar problemas o solicitar funcionalidades:
- Email: contact@penguinpath.com
- Website: http://penguinpath.duckdns.org

---

**Versión de la API**: 1.0  
**Última actualización**: Octubre 2025
