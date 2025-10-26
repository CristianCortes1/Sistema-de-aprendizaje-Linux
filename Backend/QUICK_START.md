# 🚀 Guía de Inicio Rápido - Documentación Swagger

## ⚡ En 3 Pasos (Con Docker)

### 1️⃣ Iniciar el Entorno con Docker Compose

```bash
# Desde la raíz del proyecto
docker-compose -f docker-compose.dev.yml up -d

# Ver los logs
docker-compose -f docker-compose.dev.yml logs -f backend
```

**Alternativa sin Docker:**
```bash
cd Backend
pnpm install
pnpm run start:dev
```

### 2️⃣ Abrir Swagger UI

Navega a: **http://localhost:3000/api**

El servidor puede tardar unos segundos en iniciarse mientras:
- ✅ PostgreSQL se inicia
- ✅ Se ejecutan las migraciones de Prisma
- ✅ El backend se conecta a la base de datos

### 3️⃣ Explorar y Probar

¡Listo! Ahora puedes:
- Ver todos los endpoints
- Probar las peticiones
- Ver ejemplos de código

## 🔑 Cómo Autenticarte

### Paso 1: Registrar un Usuario

1. Expande la sección **auth** en Swagger
2. Haz clic en `POST /auth/register`
3. Haz clic en "Try it out"
4. Modifica el ejemplo:
   ```json
   {
     "username": "tuusuario",
     "correo": "tuemail@example.com",
     "password": "tuPassword123!"
   }
   ```
5. Haz clic en "Execute"

### Paso 2: Confirmar Email (Desarrollo)

En desarrollo, el token se imprime en la consola del servidor. 

### Paso 3: Hacer Login

1. Ve a `POST /auth/login`
2. "Try it out"
3. Ingresa tus credenciales:
   ```json
   {
     "username": "tuusuario",
     "password": "tuPassword123!"
   }
   ```
4. Copia el `access_token` de la respuesta

### Paso 4: Usar el Token

1. Haz clic en el botón **Authorize** 🔓 (arriba a la derecha)
2. Ingresa: `Bearer tu-token-aqui`
3. Haz clic en "Authorize"
4. ¡Ahora puedes acceder a endpoints protegidos!

## 📖 Explorando Endpoints

### Por Tags/Categorías

Los endpoints están organizados en:
- 🔐 **auth** - Autenticación
- 👥 **users** - Usuarios
- 📚 **lessons** - Lecciones
- 🎯 **challenges** - Retos
- 💻 **commands** - Comandos
- 📊 **progress** - Progreso
- 🎮 **items** - Items

### Información de Cada Endpoint

Para cada endpoint verás:
- ✅ Descripción
- ✅ Parámetros requeridos
- ✅ Esquema de datos
- ✅ Ejemplos de request/response
- ✅ Códigos de estado posibles

## 🧪 Probando Endpoints

### Ejemplo: Obtener Ranking

1. Busca `GET /users/ranking`
2. Haz clic en "Try it out"
3. Haz clic en "Execute"
4. ¡Ver la respuesta!

### Ejemplo: Crear Lección

1. Busca `POST /lessons`
2. "Try it out"
3. Asegúrate de estar autenticado
4. Modifica el JSON:
   ```json
   {
     "titulo": "Mi Primera Lección",
     "retos": [
       {
         "descripcion": "Lista archivos",
         "Retroalimentacion": "Bien hecho!",
         "comandos": [
           { "comando": "ls" }
         ]
       }
     ]
   }
   ```
5. "Execute"

## � Comandos Docker Útiles

### Ver el estado de los contenedores
```bash
docker-compose -f docker-compose.dev.yml ps
```

### Ver logs del backend
```bash
docker-compose -f docker-compose.dev.yml logs -f backend
```

### Reiniciar el backend
```bash
docker-compose -f docker-compose.dev.yml restart backend
```

### Detener todo
```bash
docker-compose -f docker-compose.dev.yml down
```

### Detener y eliminar volúmenes (reinicio completo)
```bash
docker-compose -f docker-compose.dev.yml down -v
```

### Acceder a la base de datos
```bash
docker exec -it penguinpath-db psql -U postgres -d penguinpath
```

## �💡 Tips Útiles

### 1. Schemas

Haz clic en "Schemas" al final de la página para ver todos los modelos de datos.

### 2. Descargar OpenAPI

Puedes descargar la especificación OpenAPI desde:
- JSON: `http://localhost:3000/api-json`
- YAML: (disponible mediante extensiones)

### 3. Curl Commands

Swagger genera automáticamente comandos curl. Haz clic en "Execute" y verás el comando curl generado.

### 4. Importar a Postman

Alternativamente, usa el archivo `postman-collection.json` incluido.

## 🔍 Buscando Información

### En Swagger UI

1. Usa Ctrl+F para buscar
2. O navega por los tags
3. O expande todo con los botones de arriba

### En la Documentación

- **API_DOCUMENTATION.md** - Referencia completa
- **README.md** - Guía del desarrollador
- **SWAGGER_DOCUMENTATION.md** - Este documento

## ❓ Preguntas Frecuentes

### ¿Cómo sé qué campos son obligatorios?

En el esquema JSON, los campos con `*` son requeridos.

### ¿Puedo modificar los ejemplos?

¡Sí! Haz clic en "Try it out" y modifica el JSON como quieras.

### ¿Cómo veo las validaciones?

Expande el schema del DTO para ver:
- Tipos de datos
- Longitud mínima/máxima
- Formato esperado
- Valores por defecto

### ¿Funciona en producción?

Sí, pero considera:
- Deshabilitar Swagger en producción si es privado
- O protegerlo con autenticación adicional

## 🎯 Próximos Pasos

1. ✅ Familiarízate con todos los endpoints
2. ✅ Prueba crear una lección completa
3. ✅ Experimenta con el sistema de progreso
4. ✅ Revisa los códigos de error posibles

## 📚 Recursos Adicionales

- [Documentación de NestJS](https://docs.nestjs.com)
- [Swagger/OpenAPI Spec](https://swagger.io/specification/)
- [Postman Learning Center](https://learning.postman.com/)

---

**¿Problemas?** Revisa la consola del servidor o contacta al equipo de desarrollo.
