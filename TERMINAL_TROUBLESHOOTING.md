# 🐧 Guía de Solución: Terminal No Inicia

## Problema
La terminal interactiva no se conecta o muestra errores al intentar iniciar.

## Causa Más Probable
La imagen Docker `penguinpath-ubuntu:latest` no existe en el servidor VPS.

## ✅ Solución Rápida

### En tu VPS (via SSH):

```bash
# 1. Conectarse al VPS
ssh -i ~/.ssh/PenguinPath.pem ubuntu@3.14.29.219

# 2. Ir al directorio del proyecto
cd ~/Sistema-de-aprendizaje-Linux

# 3. Ejecutar el script de solución
sudo bash fix-terminal.sh
```

El script automáticamente:
- ✅ Construye la imagen `penguinpath-ubuntu:latest`
- ✅ Configura los permisos de Docker
- ✅ Reinicia el backend
- ✅ Verifica que todo esté funcionando

---

## 🔍 Diagnóstico Manual (Opcional)

Si quieres verificar el problema primero:

```bash
cd ~/Sistema-de-aprendizaje-Linux
bash diagnose-terminal.sh
```

---

## 🛠️ Solución Manual Paso a Paso

### 1. Construir la imagen de Ubuntu personalizada

```bash
cd ~/Sistema-de-aprendizaje-Linux/Backend
docker build -f Dockerfile.ubuntu-user -t penguinpath-ubuntu:latest .
```

### 2. Verificar que la imagen se creó

```bash
docker images | grep penguinpath-ubuntu
```

Deberías ver algo como:
```
penguinpath-ubuntu   latest   abc123def456   2 minutes ago   200MB
```

### 3. Reiniciar el backend

```bash
cd ~/Sistema-de-aprendizaje-Linux
docker compose -f docker-compose.prod.yml restart backend
```

### 4. Verificar logs

```bash
docker compose -f docker-compose.prod.yml logs -f backend
```

Busca líneas como:
- `✅ Docker image penguinpath-ubuntu:latest already exists`
- `🐳 Created new container penguinpath-user-...`

---

## 🧪 Probar la Terminal

1. Abre tu aplicación en el navegador
2. Ve a la sección de Terminal
3. Deberías ver:
   ```
   🐧 Creating your personal Linux environment...
   ✓ Connected to your Linux environment
   🐧 Welcome to PenguinPath! Type your commands below.
   ```

---

## 📊 Comandos Útiles para Monitoreo

### Ver contenedores de usuarios activos
```bash
docker ps --filter "name=penguinpath-user"
```

### Ver logs del backend en tiempo real
```bash
docker compose -f docker-compose.prod.yml logs -f backend
```

### Ver todos los logs relacionados con Docker/Terminal
```bash
docker logs penguinpath-backend-prod 2>&1 | grep -i "docker\|terminal\|container"
```

### Verificar acceso a Docker socket desde el backend
```bash
docker exec penguinpath-backend-prod ls -la /var/run/docker.sock
```

---

## ❌ Problemas Comunes

### Error: "Image penguinpath-ubuntu:latest not found"
**Solución**: Ejecuta `fix-terminal.sh` o construye la imagen manualmente (paso 1 arriba)

### Error: "Cannot connect to Docker daemon"
**Solución**: 
```bash
sudo chmod 666 /var/run/docker.sock
docker compose -f docker-compose.prod.yml restart backend
```

### Error: "Permission denied"
**Solución**: Asegúrate de que el contenedor backend corre como root (ya configurado en docker-compose.prod.yml)

### La terminal se conecta pero no responde
**Solución**: Verifica que la imagen tiene bash instalado:
```bash
docker run -it --rm penguinpath-ubuntu:latest bash -c "echo 'Test OK'"
```

---

## 🔄 Reconstruir Todo (Último Recurso)

Si nada funciona, reconstruye todo desde cero:

```bash
cd ~/Sistema-de-aprendizaje-Linux

# Detener todo
docker compose -f docker-compose.prod.yml down

# Limpiar contenedores de usuarios
docker ps -a | grep penguinpath-user | awk '{print $1}' | xargs -r docker rm -f

# Reconstruir imagen de Ubuntu
cd Backend
docker build -f Dockerfile.ubuntu-user -t penguinpath-ubuntu:latest .
cd ..

# Reconstruir y reiniciar servicios
docker compose -f docker-compose.prod.yml up -d --build

# Ver logs
docker compose -f docker-compose.prod.yml logs -f backend
```

---

## 📞 Verificación Final

Después de aplicar la solución, verifica:

1. ✅ La imagen existe: `docker images | grep penguinpath-ubuntu`
2. ✅ El backend está corriendo: `docker ps | grep backend`
3. ✅ No hay errores en logs: `docker logs penguinpath-backend-prod --tail 50`
4. ✅ La terminal se conecta desde el navegador
5. ✅ Puedes ejecutar comandos (ej: `ls`, `pwd`, `echo "hello"`)

---

## 💡 Notas Adicionales

- Los contenedores de usuarios persisten por 15 minutos después de desconectarse
- Cada usuario tiene su propio contenedor aislado
- Los contenedores tienen límites de recursos (512MB RAM, 50% CPU)
- Sin acceso a red externa por seguridad (NetworkMode: 'none')
