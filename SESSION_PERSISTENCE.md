# 🔄 Sistema de Persistencia de Sesiones

## 📝 Descripción

El sistema ahora mantiene las sesiones de terminal de cada usuario incluso cuando recargan la página o pierden temporalmente la conexión.

---

## ✨ Características Principales

### 1️⃣ Persistencia por Usuario
- **Antes**: Un contenedor por cada conexión WebSocket (se perdía al recargar)
- **Ahora**: Un contenedor por userId (persiste entre recargas)

### 2️⃣ Timeout de Inactividad
- Las sesiones **NO se eliminan inmediatamente** al desconectar
- Se mantienen activas por **15 minutos** después de la última actividad
- Se eliminan automáticamente después de 15 minutos de inactividad

### 3️⃣ Múltiples Pestañas
- Un usuario puede abrir múltiples pestañas
- Todas comparten el **mismo contenedor**
- El contenedor solo se elimina cuando todas las pestañas se desconectan Y pasan 15 minutos

---

## 🔧 Cómo Funciona

### Identificación de Sesiones

```typescript
// Frontend envía el userId en la autenticación
const socket = io('http://localhost:3000', {
    auth: {
        userId: userId  // Extraído del JWT
    }
})
```

### Mapeo de Contenedores

```typescript
// Backend mantiene dos mapas:
sessions: Map<userId, ContainerSession>    // userId -> Contenedor
socketToUser: Map<socketId, userId>        // socketId -> userId
```

### Reconexión Automática

Cuando un usuario se reconecta:

1. **Backend verifica** si ya existe un contenedor para ese userId
2. Si existe:
   - ✅ Reutiliza el contenedor existente
   - ✅ Restaura el stream de salida
   - ✅ Muestra mensaje: "♻️ Reconnected to your existing Linux environment"
3. Si no existe:
   - 🐳 Crea un nuevo contenedor
   - 🎉 Muestra mensaje de bienvenida

---

## ⏱️ Gestión de Inactividad

### Actualización de Actividad

La `lastActivity` se actualiza en cada:
- ✍️ Escritura de comando (`input`)
- 📐 Redimensionamiento de terminal (`resize`)
- 👀 Lectura de sesión (`getSession`)

### Proceso de Limpieza

```typescript
// Ejecuta cada 5 minutos
setInterval(() => {
    cleanupInactiveSessions(15)  // 15 minutos
}, 5 * 60 * 1000)
```

**Criterios de limpieza:**
1. No hay sockets conectados (`connectedSockets.size === 0`)
2. Han pasado ≥15 minutos desde `lastActivity`

---

## 🧪 Casos de Uso

### Escenario 1: Recarga de Página

```
Usuario ejecuta: ls -la
Usuario recarga la página (F5)
  ↓
✅ El contenedor permanece vivo
✅ El historial de comandos se conserva
✅ El directorio actual se mantiene
```

### Escenario 2: Múltiples Pestañas

```
Pestaña 1: Usuario ejecuta: cd /etc
Pestaña 2: Usuario abre nueva pestaña
  ↓
✅ Ambas pestañas comparten el mismo contenedor
✅ Pestaña 2 ve: /etc como directorio actual
```

### Escenario 3: Inactividad

```
Usuario ejecuta comandos
Usuario cierra la pestaña
  ↓
⏰ Contenedor marcado para limpieza
⏳ Espera 15 minutos
  ↓
Si el usuario NO regresa:
  🗑️ Contenedor eliminado después de 15 min

Si el usuario regresa antes de 15 min:
  ♻️ Contenedor restaurado
  ✅ Sesión intacta
```

---

## 📊 Logs del Sistema

### Creación de Contenedor Nuevo

```
🖥️ Client connected: abc123 User: user-123
🐳 Created new container penguinpath-user-user-123 for user user-123
```

### Reutilización de Contenedor

```
🖥️ Client connected: xyz789 User: user-123
♻️  Reusing existing container for user user-123
```

### Desconexión

```
🔌 Socket xyz789 disconnected from user user-123. Remaining connections: 1
⏰ Container for user user-123 marked for cleanup after 15 minutes of inactivity
```

### Limpieza Automática

```
🧹 Cleaned up 3 inactive session(s) older than 15 minutes
🗑️  Destroyed container for user user-123 after inactivity
```

---

## 🛠️ Configuración

### Cambiar el Timeout de Inactividad

En `docker.service.ts`:

```typescript
// Cambiar de 15 a 30 minutos
private readonly INACTIVITY_TIMEOUT = 30 * 60 * 1000

// Cambiar frecuencia de limpieza (cada 10 minutos)
setInterval(() => {
    this.cleanupInactiveSessions(30)
}, 10 * 60 * 1000)
```

### Deshabilitar Persistencia (volver al comportamiento anterior)

Si quieres que cada conexión tenga su propio contenedor:

En `docker.service.ts`, línea ~95:

```typescript
// Comentar esta sección:
/*
const existingSession = this.sessions.get(effectiveUserId);
if (existingSession) {
    // ... código de reutilización
}
*/
```

---

## 🔍 Comandos de Diagnóstico

### Ver sesiones activas

```bash
# Desde el código (crear endpoint REST)
dockerService.getActiveSessions()
```

Retorna:
```json
[
  {
    "userId": "user-123",
    "createdAt": "2025-10-20T20:00:00.000Z",
    "lastActivity": "2025-10-20T20:14:00.000Z",
    "connectedSockets": 2,
    "inactiveMinutes": 5.5
  }
]
```

### Ver contenedores de usuarios

```bash
docker ps | grep penguinpath-user
```

### Ver todos los contenedores (incluidos inactivos)

```bash
docker ps -a --filter "label=penguinpath.user"
```

### Logs de un contenedor específico

```bash
docker logs penguinpath-user-USER_ID
```

---

## ⚠️ Limitaciones

### Railway / PaaS

❌ Este sistema **NO funcionará** en Railway u otros PaaS
- Requiere acceso a `/var/run/docker.sock`
- Necesita crear contenedores desde dentro de un contenedor (Docker-in-Docker)

✅ **Funciona en:**
- Docker Desktop (desarrollo local)
- VPS con Docker instalado (DigitalOcean, Linode, AWS EC2)
- Servidores dedicados

### Recursos

Cada contenedor consume:
- **512 MB de RAM**
- **50% de CPU**
- **100 procesos máximo**

Con 100 usuarios concurrentes:
- RAM necesaria: ~50 GB
- CPU: Variable según uso

---

## 📈 Ventajas del Sistema

### Para el Usuario
✅ No pierde su progreso al recargar
✅ Puede abrir múltiples pestañas
✅ Experiencia fluida y sin interrupciones
✅ Directorio y comandos persisten

### Para el Sistema
✅ Menos creaciones/destrucciones de contenedores
✅ Reutilización eficiente de recursos
✅ Limpieza automática de sesiones abandonadas
✅ Múltiples conexiones al mismo contenedor

---

## 🧹 Limpieza Manual

### Limpiar todas las sesiones inactivas

```bash
# Entrar al contenedor del backend
docker exec -it penguinpath-backend sh

# En el código, llamar al método
# (requiere agregar un endpoint REST)
```

### Eliminar todos los contenedores de usuarios

```bash
docker stop $(docker ps -q --filter "name=penguinpath-user")
docker rm $(docker ps -aq --filter "name=penguinpath-user")
```

---

## 🚀 Próximas Mejoras Sugeridas

1. **Endpoint REST** para ver sesiones activas
2. **Dashboard de administración** para gestionar sesiones
3. **Notificaciones** cuando una sesión está por expirar
4. **Persistencia en disco** (volúmenes) para guardar archivos del usuario
5. **Límite de sesiones** por usuario (máx 3 contenedores simultáneos)
6. **Estadísticas** de uso de recursos por sesión

---

## 📚 Archivos Modificados

### Backend
- ✅ `src/terminal/docker.service.ts` - Lógica de persistencia
- ✅ `src/terminal/terminal.gateway.ts` - Manejo de reconexiones

### Frontend
- ✅ `src/services/AuthService.ts` - Extracción de userId del JWT
- ✅ `src/components/Leccion.vue` - Envío de userId en auth

---

## ✅ Checklist de Pruebas

- [ ] Ejecutar comando en terminal
- [ ] Recargar página (F5)
- [ ] Verificar que el comando persiste
- [ ] Abrir segunda pestaña
- [ ] Verificar que ambas comparten el mismo directorio
- [ ] Cerrar todas las pestañas
- [ ] Esperar 15 minutos
- [ ] Verificar que el contenedor se eliminó
- [ ] Reconectar antes de 15 minutos
- [ ] Verificar que la sesión se restauró

---

¡Disfruta del nuevo sistema de persistencia! 🎉
