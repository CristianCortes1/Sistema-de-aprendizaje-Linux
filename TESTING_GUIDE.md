# 🧪 Guía de Pruebas - PenguinPath

## 🎯 Cómo probar tu aplicación dockerizada

### 1️⃣ Verificar que todos los servicios estén corriendo

```bash
docker-compose -f docker-compose.dev.yml ps
```

Deberías ver 3 contenedores:
- ✅ `penguinpath-db` - PostgreSQL (healthy)
- ✅ `penguinpath-backend` - NestJS API + WebSocket
- ✅ `penguinpath-frontend` - Vue.js + Nginx

---

### 2️⃣ Acceder a la aplicación

Abre tu navegador y ve a:
```
http://localhost:5173
```

**Si ves caché viejo (error de SSH):**
- Presiona **Ctrl + F5** (Windows) para forzar recarga
- O abre una ventana de incógnito

---

### 3️⃣ Probar la terminal

1. **Regístrate** o **inicia sesión** en la aplicación
2. Ve a una lección que tenga terminal
3. Deberías ver:
   ```
   🐧 Creating your personal Linux environment...
   ✓ Connected to your Linux environment
   🐧 Welcome to PenguinPath! Type your commands below.
   
   penguinpath:~$
   ```

4. **Prueba comandos básicos:**
   ```bash
   whoami       # Deberías ver: student
   pwd          # Directorio actual
   ls           # Listar archivos
   cd /         # Cambiar al root
   ls -la       # Listar con detalles
   echo "Hello PenguinPath!"
   ```

---

### 4️⃣ Verificar que se crean contenedores por usuario

Cada vez que un usuario se conecta a la terminal, se crea **O REUTILIZA** un contenedor Docker único por userId.

**⚠️ NUEVA CARACTERÍSTICA: Las sesiones persisten por 15 minutos después de desconectar!**

**Ver contenedores de usuarios activos:**
```bash
docker ps | grep penguinpath-user
```

Cada contenedor tiene:
- Límite de memoria: **512MB**
- Límite de CPU: **50%**
- Límite de procesos: **100**
- Usuario no-root: `student`
- **Persistencia: 15 minutos** después de inactividad

**Ver todos los contenedores (incluidos los detenidos):**
```bash
docker ps -a | grep penguinpath-user
```

**🧪 PRUEBA DE PERSISTENCIA:**
```bash
# 1. Conéctate a la terminal y ejecuta:
cd /etc
ls

# 2. Recarga la página (F5)

# 3. ✅ Deberías seguir en /etc!
# 4. El contenedor se reutilizó en lugar de crear uno nuevo
```

---

### 5️⃣ Probar múltiples pestañas (NUEVO)

```bash
# 1. En la primera pestaña, ejecuta:
cd /home/student
touch mi_archivo.txt

# 2. Abre una segunda pestaña del mismo navegador
#    (ambas con el mismo usuario logueado)

# 3. Ve a la misma lección con terminal

# 4. ✅ La segunda pestaña también estará en /home/student
# 5. ✅ Verás mi_archivo.txt
# 6. Las dos pestañas comparten el mismo contenedor
```

---

### 6️⃣ Ver logs del backend

```bash
docker-compose -f docker-compose.dev.yml logs -f backend
```

Deberías ver mensajes como:
```
🖥️ Client connected: xyz123
🐳 Created container penguinpath-user-xyz123 for socket xyz123
```

Cuando un usuario se desconecta:
```
❌ Client disconnected: xyz123
🗑️ Destroyed container penguinpath-user-xyz123 for socket xyz123
```

---

### 6️⃣ Ver logs del frontend

```bash
docker-compose -f docker-compose.dev.yml logs -f frontend
```

---

### 7️⃣ Limpiar contenedores huérfanos

Si quedan contenedores de usuarios sin limpiar:

```bash
# Ver todos los contenedores de usuarios
docker ps -a | grep penguinpath-user

# Detener todos los contenedores de usuarios
docker stop $(docker ps -a -q --filter "name=penguinpath-user")

# Eliminar todos los contenedores de usuarios
docker rm $(docker ps -a -q --filter "name=penguinpath-user")
```

---

## 🔍 Troubleshooting

### Problema: "Error al conectar con el backend"

**Solución:**
```bash
# Reiniciar todos los servicios
docker-compose -f docker-compose.dev.yml restart

# O reconstruir y reiniciar
docker-compose -f docker-compose.dev.yml up --build -d
```

---

### Problema: "SSH error: Timed out while waiting for handshake"

**Causa:** El navegador tiene caché del código viejo (cuando usabas SSH).

**Solución:**
1. Presiona **Ctrl + F5** en el navegador
2. O abre una ventana de incógnito
3. O limpia el caché del navegador completamente

---

### Problema: El contenedor no responde a comandos

**Diagnóstico:**
```bash
# Ver logs del contenedor de usuario
docker logs penguinpath-user-SOCKETID

# Entrar directamente al contenedor
docker exec -it penguinpath-user-SOCKETID /bin/bash
```

---

### Problema: "Error: connect EACCES /var/run/docker.sock"

**Causa:** El contenedor de backend no tiene permisos para acceder a Docker.

**Solución:**
Verifica que en `docker-compose.dev.yml` el servicio backend tenga:
```yaml
backend:
  user: root  # Importante en desarrollo
  volumes:
    - /var/run/docker.sock:/var/run/docker.sock
```

---

## 📊 Métricas útiles

### Ver uso de recursos de los contenedores
```bash
docker stats
```

### Ver cuántos contenedores de usuario existen
```bash
docker ps -a | grep penguinpath-user | wc -l
```

### Ver el tamaño de las imágenes
```bash
docker images | grep penguinpath
```

---

## 🧹 Comandos de limpieza

### Detener todo
```bash
docker-compose -f docker-compose.dev.yml down
```

### Detener y eliminar volúmenes (⚠️ Borra la base de datos)
```bash
docker-compose -f docker-compose.dev.yml down -v
```

### Reconstruir desde cero
```bash
docker-compose -f docker-compose.dev.yml down -v
docker-compose -f docker-compose.dev.yml up --build -d
```

---

## ✅ Checklist de funcionalidad

### Básico
- [ ] Frontend carga en http://localhost:5173
- [ ] Backend responde en http://localhost:3000
- [ ] Puedo registrarme/iniciar sesión
- [ ] La terminal se conecta correctamente
- [ ] Puedo ejecutar comandos en la terminal
- [ ] Los comandos básicos de Linux funcionan (ls, cd, pwd, etc.)
- [ ] Puedo ver el mensaje de bienvenida personalizado
- [ ] El prompt muestra "penguinpath:~$"

### Persistencia (NUEVO) ✨
- [ ] Al recargar la página (F5), mi sesión persiste
- [ ] El directorio actual se mantiene después de recargar
- [ ] Los archivos creados persisten entre recargas
- [ ] Múltiples pestañas comparten el mismo contenedor
- [ ] Al cerrar todas las pestañas, el contenedor NO se elimina inmediatamente
- [ ] Después de 15 minutos de inactividad, el contenedor se limpia
- [ ] Al reconectar veo el mensaje "Reconnected to your existing environment"

### Contenedores
- [ ] Se crea/reutiliza un contenedor Docker por usuario
- [ ] El contenedor tiene límites de recursos (512MB RAM, 50% CPU)
- [ ] Los logs muestran "Created new" o "Reusing existing"

---

## 🎉 ¡Todo funcionando!

Si completaste el checklist, tu sistema está 100% operativo. Ahora tienes:

✅ Arquitectura completamente dockerizada
✅ Contenedores aislados por usuario
✅ **Persistencia de sesiones (15 min timeout)** ⭐ NUEVO
✅ **Múltiples pestañas soportadas** ⭐ NUEVO
✅ **Reconexión automática** ⭐ NUEVO
✅ Sin SSH - solo Docker API
✅ Backend escalable con NestJS
✅ Frontend moderno con Vue.js
✅ Base de datos PostgreSQL persistente

**Documentación adicional:**
- 📖 `SESSION_PERSISTENCE.md` - Guía completa del sistema de persistencia
- 📋 `SUMMARY_PERSISTENCE.md` - Resumen ejecutivo de cambios

**Próximos pasos sugeridos:**
- Agregar más desafíos y lecciones
- Implementar sistema de validación de comandos
- Dashboard de administración para gestionar sesiones
- Notificaciones de expiración de sesión
- Persistencia en disco con volúmenes
- Configurar CI/CD
- Deployar a un VPS (Railway no soporta Docker-in-Docker)
