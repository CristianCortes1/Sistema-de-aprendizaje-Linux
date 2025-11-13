# Mejoras de Seguridad Implementadas

## 📋 Resumen

Se han implementado múltiples capas de seguridad en el backend para proteger endpoints sensibles y prevenir vulnerabilidades comunes.

## 🔐 Medidas Implementadas

### 1. Autenticación y Autorización Global

#### Guards Implementados:
- **JwtAuthGuard**: Protege todos los endpoints por defecto, requiriendo autenticación JWT
- **RolesGuard**: Controla el acceso basado en roles de usuario (admin/user)
- **ThrottlerGuard**: Limita peticiones para prevenir ataques de fuerza bruta

#### Decoradores Creados:
- `@Public()`: Marca endpoints que no requieren autenticación
- `@Roles('admin')`: Restringe endpoints solo para administradores
- `@GetUser()`: Extrae el usuario autenticado del request

### 2. Protección de Endpoints

#### Endpoints Públicos (sin autenticación):
```typescript
// Auth
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/confirm-email
POST   /api/auth/forgot-password
POST   /api/auth/reset-password

// Contenido de lectura (lecciones, retos, comandos)
GET    /api/lessons
GET    /api/lessons/:id
GET    /api/challenges
GET    /api/challenges/:id
GET    /api/commands
GET    /api/commands/:id
GET    /api/users/ranking
```

#### Endpoints Protegidos (requieren autenticación):
```typescript
// Usuario autenticado puede:
- Ver su propio perfil: GET /api/users/:id
- Actualizar su propio perfil: PATCH /api/users/:id
- Crear su propio progreso: POST /api/progress
- Cambiar su contraseña: POST /api/auth/change-password
```

#### Endpoints Solo Admin:
```typescript
// Solo administradores pueden:
POST   /api/users
GET    /api/users
DELETE /api/users/:id
GET    /api/progress
PATCH  /api/progress/:id
DELETE /api/progress/:id

// CRUD de contenido
POST   /api/lessons
PATCH  /api/lessons/:id
DELETE /api/lessons/:id
POST   /api/challenges
PATCH  /api/challenges/:id
DELETE /api/challenges/:id
POST   /api/commands
PATCH  /api/commands/:id
DELETE /api/commands/:id
```

### 3. Rate Limiting (Throttling)

- **Límite**: 20 peticiones por minuto por IP
- **Previene**: Ataques de fuerza bruta, DDoS
- **Configuración**: `ThrottlerModule` en `app.module.ts`

### 4. Headers de Seguridad (Helmet)

Helmet configura automáticamente varios headers HTTP de seguridad:
- `X-DNS-Prefetch-Control`
- `X-Frame-Options`
- `Strict-Transport-Security`
- `X-Download-Options`
- `X-Content-Type-Options`
- `X-XSS-Protection`

### 5. CORS Configurado

- Origins permitidos: Frontend específico + localhost
- Métodos permitidos: GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS
- Headers permitidos: Content-Type, Authorization
- Credentials: Habilitado

### 6. Validación y Sanitización

**ValidationPipe Global** configurado con:
- `whitelist: true` - Elimina propiedades no definidas en DTOs
- `forbidNonWhitelisted: true` - Rechaza payloads con propiedades desconocidas
- `transform: true` - Convierte tipos automáticamente
- Previene inyección de datos no esperados

### 7. JWT Mejorado

- Token incluye: `username`, `id_Usuario`, `rol`
- Expiración: 1 día
- Estrategia Passport implementada
- Validación automática en cada request

## 🚨 Vulnerabilidades Corregidas

| Vulnerabilidad | Estado Anterior | Estado Actual |
|----------------|----------------|---------------|
| Acceso sin autenticación a `/api/users` | ❌ Vulnerable | ✅ Protegido |
| Acceso sin autenticación a `/api/progress` | ❌ Vulnerable | ✅ Protegido |
| CRUD de lecciones sin autorización | ❌ Vulnerable | ✅ Solo admin |
| CRUD de retos sin autorización | ❌ Vulnerable | ✅ Solo admin |
| CRUD de comandos sin autorización | ❌ Vulnerable | ✅ Solo admin |
| Usuarios modificando datos de otros | ❌ Vulnerable | ✅ Protegido |
| Sin rate limiting | ❌ Vulnerable | ✅ Protegido |
| Headers de seguridad faltantes | ❌ Vulnerable | ✅ Configurado |
| Validación de entrada débil | ❌ Vulnerable | ✅ Reforzada |

## 📝 Archivos Modificados

### Nuevos archivos creados:
```
Backend/src/auth/guards/jwt-auth.guard.ts
Backend/src/auth/guards/roles.guard.ts
Backend/src/auth/decorators/public.decorator.ts
Backend/src/auth/decorators/roles.decorator.ts
Backend/src/auth/decorators/get-user.decorator.ts
Backend/src/auth/strategies/jwt.strategy.ts
```

### Archivos modificados:
```
Backend/src/app.module.ts           - Guards globales + ThrottlerModule
Backend/src/main.ts                 - Helmet + CORS mejorado
Backend/src/auth/auth.module.ts     - JwtStrategy provider
Backend/src/auth/auth.service.ts    - JWT con rol incluido
Backend/src/auth/auth.controller.ts - Decorador @Public()
Backend/src/users/users.controller.ts - Protección con roles
Backend/src/lessons/lessons.controller.ts - Solo admin puede modificar
Backend/src/challenges/challenges.controller.ts - Solo admin puede modificar
Backend/src/commands/commands.controller.ts - Solo admin puede modificar
Backend/src/progress/progress.controller.ts - Protección por usuario
Backend/package.json                - @nestjs/throttler + helmet
```

## 🧪 Pruebas Recomendadas

### 1. Probar acceso sin token:
```bash
curl http://localhost:3000/api/users
# Debe devolver 401 Unauthorized
```

### 2. Probar acceso con token válido:
```bash
curl -H "Authorization: Bearer <token>" http://localhost:3000/api/users
# Admin: 200 OK con datos
# User: 403 Forbidden
```

### 3. Probar rate limiting:
```bash
# Hacer más de 20 peticiones en 60 segundos
for i in {1..25}; do curl http://localhost:3000/api/lessons; done
# Las últimas deben devolver 429 Too Many Requests
```

### 4. Verificar endpoints públicos:
```bash
curl http://localhost:3000/api/auth/login -X POST -H "Content-Type: application/json" -d '{"username":"test","password":"test"}'
# Debe funcionar sin token
```

## 🔄 Próximos Pasos Recomendados

1. **Mover secrets a variables de entorno**
   - JWT_SECRET actualmente hardcodeado
   - Usar `.env` para configuración sensible

2. **Implementar refresh tokens**
   - Tokens de corta duración (15 min)
   - Refresh token de larga duración (7 días)

3. **Logging de seguridad**
   - Registrar intentos fallidos de login
   - Alertas de actividad sospechosa

4. **Tests de seguridad**
   - Tests E2E para autenticación
   - Tests de autorización por roles

5. **HTTPS obligatorio en producción**
   - Configurar certificados SSL/TLS
   - Redirigir HTTP a HTTPS

## ✅ Checklist de Seguridad

- [x] Autenticación JWT implementada
- [x] Autorización basada en roles
- [x] Guards globales configurados
- [x] Rate limiting activo
- [x] Helmet configurado
- [x] CORS restringido
- [x] Validación de entrada robusta
- [x] Endpoints sensibles protegidos
- [x] Separación de permisos admin/user
- [ ] Secrets en variables de entorno
- [ ] Tests de seguridad
- [ ] Logs de auditoría
- [ ] HTTPS en producción
