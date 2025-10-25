# ⚡ Inicio Rápido - PenguinPath

## 🚀 En 30 Segundos

```bash
# 1. Clonar (si aún no lo has hecho)
git clone <repository-url>
cd Sistema-de-aprendizaje-Linux

# 2. Iniciar con Docker
docker-compose -f docker-compose.dev.yml up -d

# 3. Esperar a que todo esté listo (~30 segundos)
docker-compose -f docker-compose.dev.yml logs -f backend
```

Cuando veas este mensaje, ¡estás listo!:
```
🚀 Aplicación corriendo en: http://localhost:3000
📚 Documentación Swagger en: http://localhost:3000/api
```

## 🌐 URLs Disponibles

| Servicio | URL | Descripción |
|----------|-----|-------------|
| Frontend | http://localhost:5173 | Aplicación Vue.js |
| Backend | http://localhost:3000 | API REST |
| **Swagger** | **http://localhost:3000/api** | **📚 Documentación Interactiva** |
| PostgreSQL | localhost:5432 | Base de datos |

## 🎯 Primeros Pasos

### 1. Explora la API con Swagger

Abre: **http://localhost:3000/api**

Aquí puedes:
- ✅ Ver todos los endpoints
- ✅ Probar peticiones
- ✅ Ver ejemplos
- ✅ Autenticarte

### 2. Registra un Usuario

En Swagger UI:
1. Expande **auth** → `POST /auth/register`
2. Haz clic en "Try it out"
3. Modifica el JSON:
   ```json
   {
     "username": "miusuario",
     "correo": "mi@email.com",
     "password": "MiPassword123!"
   }
   ```
4. Haz clic en "Execute"

### 3. Haz Login

1. Ve a `POST /auth/login`
2. Ingresa tus credenciales
3. Copia el `access_token` de la respuesta

### 4. Autorízate en Swagger

1. Haz clic en el botón **Authorize** 🔓 (arriba a la derecha)
2. Ingresa: `Bearer tu-token-aqui`
3. ¡Ahora puedes usar todos los endpoints protegidos!

## 🛠️ Comandos Útiles

### Ver el estado
```bash
docker-compose -f docker-compose.dev.yml ps
```

### Ver logs en tiempo real
```bash
# Todos los servicios
docker-compose -f docker-compose.dev.yml logs -f

# Solo backend
docker-compose -f docker-compose.dev.yml logs -f backend
```

### Reiniciar un servicio
```bash
docker-compose -f docker-compose.dev.yml restart backend
```

### Detener todo
```bash
docker-compose -f docker-compose.dev.yml down
```

### Reinicio completo (borra la base de datos)
```bash
docker-compose -f docker-compose.dev.yml down -v
docker-compose -f docker-compose.dev.yml up -d
```

## 🐛 Solución de Problemas

### El backend no inicia

```bash
# Ver los logs
docker-compose -f docker-compose.dev.yml logs backend

# Reiniciar
docker-compose -f docker-compose.dev.yml restart backend
```

### Error de conexión a la base de datos

```bash
# Verificar que PostgreSQL esté corriendo
docker-compose -f docker-compose.dev.yml ps

# Ver logs de PostgreSQL
docker-compose -f docker-compose.dev.yml logs postgres
```

### Problemas con permisos

```bash
# En Windows, asegúrate de que Docker Desktop está corriendo
# En Linux, puede necesitar sudo

# Reinicio completo
docker-compose -f docker-compose.dev.yml down -v
docker-compose -f docker-compose.dev.yml up -d
```

### Los cambios no se reflejan

```bash
# Reconstruir la imagen
docker-compose -f docker-compose.dev.yml up -d --build backend
```

## 📚 Más Información

- [README Principal](./README.md) - Documentación completa
- [Backend README](./Backend/README.md) - Detalles del backend
- [API Documentation](./Backend/API_DOCUMENTATION.md) - Referencia de la API
- [Swagger UI](http://localhost:3000/api) - Documentación interactiva

## ✅ Checklist de Instalación

- [ ] Docker Desktop instalado y corriendo
- [ ] Proyecto clonado
- [ ] `docker-compose -f docker-compose.dev.yml up -d` ejecutado
- [ ] http://localhost:3000/api funciona
- [ ] Usuario registrado en Swagger
- [ ] Login exitoso
- [ ] Token JWT obtenido

¡Si todos los ítems están marcados, estás listo para desarrollar! 🎉

## 🎮 Siguiente Nivel

Ahora que tienes todo funcionando:

1. **Explora los endpoints** en Swagger
2. **Lee la documentación** completa
3. **Crea tus primeras lecciones** usando la API
4. **Prueba la terminal virtual** en el frontend
5. **Revisa el código** del backend/frontend

---

**¿Necesitas ayuda?** Abre un issue en GitHub o consulta la [documentación completa](./README.md).
