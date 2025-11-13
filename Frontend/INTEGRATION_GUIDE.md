# Guía de Integración del Frontend con API Segura

## 📦 Servicios Disponibles

Se han creado servicios centralizados para interactuar con el backend de forma segura y consistente:

### ApiService (Servicio Base)

Servicio centralizado que maneja:
- ✅ Autenticación automática con JWT
- ✅ Manejo de errores HTTP
- ✅ Redirección automática en caso de sesión expirada (401)
- ✅ Mensajes de error amigables
- ✅ Rate limiting (429)

### Servicios Específicos

1. **AuthService** - Autenticación y gestión de usuarios
2. **UserService** - CRUD de usuarios
3. **LessonService** - CRUD de lecciones
4. **ProgressService** - Gestión de progreso
5. **CommandService** - CRUD de comandos

## 🔧 Uso de los Servicios

### 1. AuthService

```typescript
import AuthService from '@/services/AuthService'

// Login
try {
  const response = await AuthService.login(username, password)
  AuthService.setToken(response.access_token)
  localStorage.setItem('user', JSON.stringify(response.user))
  // Redirigir al dashboard
} catch (error) {
  console.error('Error en login:', error.message)
}

// Registro
try {
  await AuthService.register(username, email, password)
  alert('Registro exitoso. Revisa tu correo.')
} catch (error) {
  console.error('Error en registro:', error.message)
}

// Confirmar email
try {
  await AuthService.confirmEmail(token)
  alert('Email confirmado correctamente')
} catch (error) {
  console.error('Error confirmando email:', error.message)
}

// Recuperar contraseña
try {
  await AuthService.forgotPassword(email)
  alert('Se ha enviado un enlace a tu correo')
} catch (error) {
  console.error('Error:', error.message)
}

// Restablecer contraseña
try {
  await AuthService.resetPassword(token, newPassword)
  alert('Contraseña restablecida correctamente')
} catch (error) {
  console.error('Error:', error.message)
}

// Cambiar contraseña (requiere autenticación)
try {
  await AuthService.changePassword(email, currentPassword, newPassword)
  alert('Contraseña actualizada correctamente')
} catch (error) {
  console.error('Error:', error.message)
}

// Logout
AuthService.logout()
router.push('/login')
```

### 2. UserService

```typescript
import UserService from '@/services/UserService'

// Obtener todos los usuarios (solo admin)
try {
  const users = await UserService.getAll()
  console.log('Usuarios:', users)
} catch (error) {
  console.error('Error:', error.message)
  // Si es 403, el usuario no tiene permisos
}

// Obtener usuario por ID
try {
  const user = await UserService.getById(userId)
  console.log('Usuario:', user)
} catch (error) {
  console.error('Error:', error.message)
}

// Obtener ranking (público)
try {
  const ranking = await UserService.getRanking()
  console.log('Ranking:', ranking)
} catch (error) {
  console.error('Error:', error.message)
}

// Crear usuario (solo admin)
try {
  const newUser = await UserService.create({
    username: 'nuevo_usuario',
    email: 'usuario@ejemplo.com',
    rol: 'user',
    activo: true
  })
  console.log('Usuario creado:', newUser)
} catch (error) {
  console.error('Error:', error.message)
}

// Actualizar usuario
try {
  await UserService.update(userId, {
    username: 'usuario_actualizado',
    avatar: 'https://...'
  })
  alert('Usuario actualizado correctamente')
} catch (error) {
  console.error('Error:', error.message)
}

// Eliminar usuario (solo admin)
try {
  await UserService.delete(userId)
  alert('Usuario eliminado correctamente')
} catch (error) {
  console.error('Error:', error.message)
}
```

### 3. LessonService

```typescript
import LessonService from '@/services/LessonService'

// Obtener todas las lecciones (público)
try {
  const lessons = await LessonService.getAll()
  console.log('Lecciones:', lessons)
} catch (error) {
  console.error('Error:', error.message)
}

// Obtener lección por ID (público)
try {
  const lesson = await LessonService.getById(lessonId)
  console.log('Lección:', lesson)
} catch (error) {
  console.error('Error:', error.message)
}

// Obtener lecciones disponibles para usuario (autenticado)
try {
  const userId = AuthService.getUserId()
  const lessons = await LessonService.getAvailableForUser(Number(userId))
  console.log('Lecciones disponibles:', lessons)
} catch (error) {
  console.error('Error:', error.message)
}

// Crear lección (solo admin)
try {
  const newLesson = await LessonService.create({
    titulo: 'Nueva Lección',
    retos: [
      {
        tipo: 'reto',
        descripcion: 'Descripción del reto',
        Retroalimentacion: 'Feedback',
        comandos: [
          { comando: 'ls', descripcion: 'Listar archivos' }
        ]
      }
    ]
  })
  console.log('Lección creada:', newLesson)
} catch (error) {
  console.error('Error:', error.message)
}

// Actualizar lección (solo admin)
try {
  await LessonService.update(lessonId, {
    titulo: 'Lección Actualizada'
  })
  alert('Lección actualizada correctamente')
} catch (error) {
  console.error('Error:', error.message)
}

// Eliminar lección (solo admin)
try {
  await LessonService.delete(lessonId)
  alert('Lección eliminada correctamente')
} catch (error) {
  console.error('Error:', error.message)
}
```

### 4. ProgressService

```typescript
import ProgressService from '@/services/ProgressService'

// Crear progreso (autenticado)
try {
  const progress = await ProgressService.create({
    userId: Number(userId),
    lessonId: Number(lessonId),
    progress: 75
  })
  console.log('Progreso guardado:', progress)
} catch (error) {
  console.error('Error:', error.message)
}

// Obtener progreso por usuario y lección
try {
  const progress = await ProgressService.getByUserAndLesson(userId, lessonId)
  console.log('Progreso:', progress)
} catch (error) {
  console.error('Error:', error.message)
}

// Obtener todo el progreso (solo admin)
try {
  const allProgress = await ProgressService.getAll()
  console.log('Todo el progreso:', allProgress)
} catch (error) {
  console.error('Error:', error.message)
}
```

### 5. CommandService

```typescript
import CommandService from '@/services/CommandService'

// Obtener todos los comandos (público)
try {
  const commands = await CommandService.getAll()
  console.log('Comandos:', commands)
} catch (error) {
  console.error('Error:', error.message)
}

// Crear comando (solo admin)
try {
  const newCommand = await CommandService.create({
    comando: 'ls -la',
    descripcion: 'Listar archivos con detalles',
    retoId: 1
  })
  console.log('Comando creado:', newCommand)
} catch (error) {
  console.error('Error:', error.message)
}
```

## 🚨 Manejo de Errores

Todos los servicios lanzan errores con mensajes descriptivos. Siempre usa try-catch:

```typescript
try {
  const data = await SomeService.someMethod()
  // Procesar datos exitosos
} catch (error: any) {
  console.error('Error:', error)
  alert(error.message) // Mostrar mensaje al usuario
  
  // O usar un sistema de notificaciones más elegante
  // showToast(error.message, 'error')
}
```

### Errores Comunes

| Error | Código | Significado | Acción |
|-------|--------|-------------|--------|
| "Sesión expirada..." | 401 | Token inválido o expirado | Redirige a login automáticamente |
| "No tienes permisos..." | 403 | Sin autorización | Mostrar mensaje al usuario |
| "Demasiadas peticiones..." | 429 | Rate limit excedido | Esperar y reintentar |
| "Error de conexión..." | - | Error de red | Verificar conexión |

## 📝 Migración de Código Existente

### Antes (fetch directo):

```typescript
const response = await fetch(`${API_URL}/users/${userId}`, {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
})

if (!response.ok) {
  throw new Error('Error al cargar usuario')
}

const user = await response.json()
```

### Después (con servicios):

```typescript
const user = await UserService.getById(userId)
```

## 🔐 Tokens y Autenticación

### El token se maneja automáticamente:

```typescript
// ❌ NO hacer esto:
fetch(url, {
  headers: {
    'Authorization': `Bearer ${AuthService.getToken()}`
  }
})

// ✅ Hacer esto:
UserService.getById(userId)
// El ApiService agrega el token automáticamente
```

### Endpoints públicos vs privados:

```typescript
// Público (no requiere token)
LessonService.getAll() // requiresAuth: false por defecto

// Privado (requiere token) 
UserService.getById(userId) // requiresAuth: true por defecto
```

## 📱 Ejemplo Completo: Componente Login

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AuthService from '@/services/AuthService'

const router = useRouter()
const username = ref('')
const password = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

const handleLogin = async () => {
  if (!username.value || !password.value) {
    errorMessage.value = 'Por favor completa todos los campos'
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    const response = await AuthService.login(username.value, password.value)
    
    // Guardar token y usuario
    AuthService.setToken(response.access_token)
    localStorage.setItem('user', JSON.stringify(response.user))
    
    // Redirigir según el rol
    if (response.user.rol === 'admin') {
      router.push('/admin')
    } else {
      router.push('/dashboard')
    }
  } catch (error: any) {
    errorMessage.value = error.message || 'Error al iniciar sesión'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="login-form">
    <input 
      v-model="username" 
      placeholder="Usuario o email"
      @keyup.enter="handleLogin"
    />
    <input 
      v-model="password" 
      type="password" 
      placeholder="Contraseña"
      @keyup.enter="handleLogin"
    />
    
    <div v-if="errorMessage" class="error">
      {{ errorMessage }}
    </div>
    
    <button 
      @click="handleLogin" 
      :disabled="isLoading"
    >
      {{ isLoading ? 'Iniciando sesión...' : 'Iniciar sesión' }}
    </button>
  </div>
</template>
```

## ✅ Checklist de Migración

- [ ] Reemplazar todos los `fetch()` por servicios
- [ ] Eliminar imports de `API_URL` innecesarios
- [ ] Manejar errores con try-catch
- [ ] Mostrar mensajes de error al usuario
- [ ] Verificar que el token se guarde después del login
- [ ] Verificar que el token se limpie al hacer logout
- [ ] Probar endpoints públicos sin autenticación
- [ ] Probar endpoints privados con autenticación
- [ ] Probar que redirija a login cuando el token expire

## 🎯 Beneficios de esta Arquitectura

1. **Código más limpio**: Menos código repetitivo
2. **Manejo centralizado de errores**: Consistente en toda la app
3. **Autenticación automática**: No olvidar agregar tokens
4. **Fácil de mantener**: Cambios en un solo lugar
5. **TypeScript friendly**: Mejor autocompletado
6. **Seguro**: Manejo adecuado de sesiones expiradas

## 📚 Recursos Adicionales

- Ver `Backend/SECURITY.md` para documentación del backend
- Ver `Backend/API_SECURITY_GUIDE.md` para ejemplos de API
- Documentación Swagger: `http://localhost:3000/api`
