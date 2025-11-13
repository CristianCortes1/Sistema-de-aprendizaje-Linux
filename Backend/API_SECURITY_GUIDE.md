# Guía de Uso de API con Seguridad

## 🔐 Autenticación

### 1. Registro de Usuario

**Endpoint:** `POST /api/auth/register`  
**Acceso:** Público (sin token)

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "nuevo_usuario",
    "correo": "usuario@ejemplo.com",
    "password": "MiPassword123!"
  }'
```

**Respuesta exitosa:**
```json
{
  "message": "Usuario registrado. Por favor, revisa tu correo para confirmar tu cuenta.",
  "userId": 1
}
```

### 2. Iniciar Sesión

**Endpoint:** `POST /api/auth/login`  
**Acceso:** Público (sin token)

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "nuevo_usuario",
    "password": "MiPassword123!"
  }'
```

**Respuesta exitosa:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id_Usuario": 1,
    "username": "nuevo_usuario",
    "correo": "usuario@ejemplo.com",
    "rol": "user",
    "activo": true,
    "experiencia": 0,
    "monedas": 0,
    "racha": 1
  }
}
```

### 3. Usar el Token

Guarda el `access_token` y úsalo en todas las peticiones protegidas:

```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/users/1
```

## 📚 Ejemplos de Uso

### Ver Ranking (Público)

```bash
# No requiere token
curl http://localhost:3000/api/users/ranking
```

### Ver Lecciones (Público)

```bash
# No requiere token
curl http://localhost:3000/api/lessons
```

### Ver Mi Perfil (Autenticado)

```bash
# Requiere token - Usuario puede ver su propio perfil
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/users/1
```

### Actualizar Mi Perfil (Autenticado)

```bash
# Requiere token - Usuario puede actualizar su propio perfil
curl -X PATCH http://localhost:3000/api/users/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "avatar": "https://ejemplo.com/nuevo-avatar.png"
  }'
```

### Registrar Progreso (Autenticado)

```bash
# Requiere token - Usuario registra su progreso
curl -X POST http://localhost:3000/api/progress \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "lessonId": 1,
    "progress": 75
  }'
```

### Listar Usuarios (Solo Admin)

```bash
# Requiere token de admin
curl -H "Authorization: Bearer $ADMIN_TOKEN" \
  http://localhost:3000/api/users
```

**Respuesta si no eres admin:**
```json
{
  "statusCode": 403,
  "message": "Forbidden resource",
  "error": "Forbidden"
}
```

### Crear Lección (Solo Admin)

```bash
# Requiere token de admin
curl -X POST http://localhost:3000/api/lessons \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "Titulo": "Comandos básicos de Linux",
    "retos": []
  }'
```

## 🚫 Errores Comunes

### 401 Unauthorized - No Token o Token Inválido

```json
{
  "statusCode": 401,
  "message": "No autorizado",
  "error": "Unauthorized"
}
```

**Solución:** Verifica que estás enviando el token en el header `Authorization: Bearer <token>`

### 403 Forbidden - Sin Permisos

```json
{
  "statusCode": 403,
  "message": "Forbidden resource",
  "error": "Forbidden"
}
```

**Solución:** Este endpoint requiere permisos de admin o estás intentando acceder a recursos de otro usuario

### 429 Too Many Requests - Rate Limit

```json
{
  "statusCode": 429,
  "message": "ThrottlerException: Too Many Requests"
}
```

**Solución:** Estás haciendo demasiadas peticiones. Espera 60 segundos y reintenta

### 400 Bad Request - Datos Inválidos

```json
{
  "statusCode": 400,
  "message": ["username should not be empty", "email must be an email"],
  "error": "Bad Request"
}
```

**Solución:** Verifica que estás enviando todos los campos requeridos con el formato correcto

## 🔧 Integración con Frontend

### Axios (JavaScript/TypeScript)

```typescript
import axios from 'axios';

// Configurar instancia de axios con interceptor
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

// Interceptor para añadir token automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido - redirigir a login
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Uso
async function getMyProfile() {
  try {
    const response = await api.get('/users/1');
    return response.data;
  } catch (error) {
    console.error('Error al obtener perfil:', error);
  }
}

async function login(username: string, password: string) {
  try {
    const response = await api.post('/auth/login', { username, password });
    localStorage.setItem('access_token', response.data.access_token);
    return response.data.user;
  } catch (error) {
    console.error('Error en login:', error);
  }
}
```

### Fetch (JavaScript)

```javascript
// Login
async function login(username, password) {
  const response = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });
  
  if (!response.ok) {
    throw new Error('Login fallido');
  }
  
  const data = await response.json();
  localStorage.setItem('access_token', data.access_token);
  return data.user;
}

// Petición autenticada
async function fetchProtectedResource() {
  const token = localStorage.getItem('access_token');
  
  const response = await fetch('http://localhost:3000/api/users/1', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (response.status === 401) {
    // Redirigir a login
    window.location.href = '/login';
    return;
  }
  
  return response.json();
}
```

## 🧪 Testing con Postman

### Configurar Environment

1. Crea un environment llamado "PenguinPath Local"
2. Añade variables:
   - `base_url`: `http://localhost:3000/api`
   - `token`: (se llenará automáticamente)
   - `user_id`: (se llenará automáticamente)

### Script de Login Automático

En la pestaña "Tests" de tu petición de login:

```javascript
// Guardar token automáticamente
if (pm.response.code === 200) {
    const jsonData = pm.response.json();
    pm.environment.set("token", jsonData.access_token);
    pm.environment.set("user_id", jsonData.user.id_Usuario);
}
```

### Usar Token en Peticiones

En el tab "Authorization":
- Type: Bearer Token
- Token: `{{token}}`

O manualmente en Headers:
- Key: `Authorization`
- Value: `Bearer {{token}}`

## 🔒 Buenas Prácticas de Seguridad

### Frontend

1. **Nunca guardes datos sensibles en localStorage sin cifrar**
   - Considera usar httpOnly cookies para el token

2. **Implementa refresh token**
   - No uses tokens de larga duración

3. **Valida respuestas del servidor**
   - No confíes ciegamente en los datos recibidos

4. **Limpia tokens al cerrar sesión**
   ```javascript
   function logout() {
     localStorage.removeItem('access_token');
     delete axios.defaults.headers.common['Authorization'];
     window.location.href = '/login';
   }
   ```

### Backend

1. **Nunca expongas el JWT_SECRET**
   - Usa variables de entorno
   - No lo commitees al repositorio

2. **Tokens de corta duración**
   - Actualmente: 1 día
   - Recomendado: 15 minutos con refresh token

3. **Logging de intentos fallidos**
   - Monitorea intentos de acceso no autorizado

4. **HTTPS en producción**
   - Nunca uses HTTP en producción
   - Configura SSL/TLS

## 📊 Matriz de Permisos

| Endpoint | Público | Usuario | Admin |
|----------|---------|---------|-------|
| POST /auth/register | ✅ | ✅ | ✅ |
| POST /auth/login | ✅ | ✅ | ✅ |
| GET /users/ranking | ✅ | ✅ | ✅ |
| GET /users/:id | ❌ | ✅ (propio) | ✅ (todos) |
| GET /users | ❌ | ❌ | ✅ |
| POST /users | ❌ | ❌ | ✅ |
| PATCH /users/:id | ❌ | ✅ (propio) | ✅ (todos) |
| DELETE /users/:id | ❌ | ❌ | ✅ |
| GET /lessons | ✅ | ✅ | ✅ |
| POST /lessons | ❌ | ❌ | ✅ |
| PATCH /lessons/:id | ❌ | ❌ | ✅ |
| DELETE /lessons/:id | ❌ | ❌ | ✅ |
| POST /progress | ❌ | ✅ (propio) | ✅ |
| GET /progress | ❌ | ❌ | ✅ |

## 🆘 Soporte

Si encuentras problemas de seguridad o autenticación:

1. Verifica que el token no haya expirado
2. Confirma que estás usando el rol correcto
3. Revisa los logs del servidor para más detalles
4. Asegúrate de que estás enviando el token en el formato correcto: `Bearer <token>`
