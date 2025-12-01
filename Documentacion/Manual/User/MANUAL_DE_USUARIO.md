# Manual de Usuario — Sistema de Aprendizaje Linux (PenguinPath)

- Versión del manual: 1.0.0
- Fecha: 2025-11-13
- Versión de la app: 1.3.0 (Nest.js + PostgreSQL + AWS)
- Estado: Borrador
- Propietario: Equipo de Desarrollo
- Revisores: David Santiago Chacon Herrera

---

## Índice
1. Introducción
2. Público objetivo
3. Requisitos
4. Inicio rápido (5–10 minutos)
5. Acceso e instalación
6. Interfaz principal
7. Tareas principales (guías paso a paso)
8. Laboratorios y sandbox (uso seguro)
9. Gestión de cuenta
10. Soporte, FAQ y troubleshooting
11. Buenas prácticas y seguridad
12. Glosario
13. Registro de cambios

---

## 1. Introducción
Bienvenido a PenguinPath, la plataforma interactiva para aprender comandos y administración de Linux mediante ejercicios prácticos en terminales practicas.

Este manual guía a los usuarios (estudiantes, instructores y administradores) para realizar las tareas más comunes de forma clara y rápida.

---

## 2. Público objetivo
- Estudiantes (usuarios que realizan cursos y labs)
- Instructores (crean y gestionan contenido)
- Administradores (mantienen el sistema)
- Profesionales(que quieran )

---

## 3. Requisitos
- Navegador recomendado: Chrome ≥ 90 o Firefox ≥ 88
- Conexión a internet estable
- Cuenta de usuario en la plataforma
- Para administradores: acceso SSH/Console a EC2 si hace falta mantenimiento

---

## 4. Inicio rápido (5–10 minutos)
Objetivo: Crear una cuenta, acceder a un curso y lanzar un laboratorio.

1. Regístrate: en la página principal haz clic en "Registrarse" → completa nombre, email y contraseña → verifica tu correo.
2. Inicia sesión: haz clic en "Iniciar sesión" e ingresa tus credenciales.
3. Busca un curso: en la barra de búsqueda escribe "Introducción a Linux" o filtra por categoría.
4. Inscríbete en el curso: botón "Inscribirme" en la página del curso.
5. Abre la lección 1 y haz clic en "Lanzar lab" → espera 3–10s para que el sandbox se cree.
6. Conéctate al terminal integrado (WebSocket) y realiza el primer ejercicio.

Resultado esperado: verás el terminal en pantalla y podrás ejecutar comandos dentro del sandbox.

---

## 5. Acceso e instalación
### 5.1 Registro e inicio de sesión
- Página: `https://tu-dominio/login` y `https://tu-dominio/register`
- Recuperar contraseña: "¿Olvidaste tu contraseña?" → sigue el correo de recuperación.
- Autenticación 2FA (opcional): Actívala en Ajustes → Seguridad → Habilitar 2FA (TOTP).

### 5.2 Instalación (solo para desarrolladores)
Para desarrollar localmente usa Docker Compose (ver `README.md`):

```powershell
# En PowerShell (Windows)
cd \path\to\Sistema-de-aprendizaje-Linux
docker-compose -f docker-compose.dev.yml up -d
```

- Frontend: http://localhost:3000
- Backend: http://localhost:3001
- PostgreSQL: localhost:5432

---

## 6. Interfaz principal
Breve descripción de elementos clave:
- Encabezado: logo, menú, avatar usuario
- Barra lateral: Cursos, Mis labs, Progreso, Administración
- Área central: Contenido de la lección / editor / terminal
- Estado del lab: Conectado / En cola / Finalizado

(Agregar capturas: `images/01_dashboard.png`, `images/02_leccion.png`)

---

## 7. Tareas principales (guías paso a paso)
Cada tarea tiene: Objetivo, Pasos, Resultado esperado y Errores comunes.

### 7.1 Crear cuenta / Iniciar sesión
Objetivo: Crear una cuenta personal.
Pasos:
1. Ir a `/register`.
2. Completar formulario y aceptar términos.
3. Verificar email con el enlace recibido.

Errores comunes:
- No llega el correo: revisa SPAM y espera 2–5 minutos. Si persiste, contactar soporte.

---

### 7.2 Buscar e inscribirse en un curso
Objetivo: Encontrar contenido por categoría o palabra clave.
Pasos:
1. Usa la barra de búsqueda o filtros (distro, nivel, duración).
2. Haz clic en curso → "Inscribirme".
Resultado: curso agregado a "Mis cursos".

---

### 7.3 Iniciar y reanudar una lección
Objetivo: Abrir una lección y seguir desde donde la dejaste.
Pasos:
1. En "Mis cursos" selecciona el curso.
2. Abre la lección y haz clic en "Iniciar".
3. Para pausar, cierra sesión; al volver, el progreso se conserva.

---

### 7.4 Lanzar un laboratorio (Lab)
Objetivo: Iniciar un sandbox para practicar.
Pasos:
1. Dentro de la lección haz clic en "Lanzar lab".
2. Espera el mensaje: "Lab listo" y el puerto/endpoint.
3. Usa el terminal integrado o conéctate por WebSocket.

Precauciones: los labs tienen límites de CPU/RAM/tiempo. Guarda tu trabajo.

Errores comunes:
- Lab en cola: espera o intenta reiniciar el lab.
- Timeout: verifica recursos del servidor o contacta a admins.

---

### 7.5 Enviar soluciones / Validación automática
Objetivo: Enviar tu solución y obtener feedback.
Pasos:
1. En la sección de ejercicios haz clic en "Enviar".
2. Adjunta archivos o pega comandos según las instrucciones.
3. El sistema ejecutará los tests y mostrará resultados.

Resultado: puntuación, salida de tests y feedback.

Errores comunes:
- Formato incorrecto: revisa especificación de entrada.

---

### 7.6 Ver progreso y certificados
Objetivo: Consultar avance y obtener certificado.
Pasos:
1. Ir a "Mi progreso".
2. Ver porcentaje y lecciones completadas.
3. Al completar una ruta, clic en "Obtener certificado" (PDF descargable).

---

### 7.7 Descargar materiales
Objetivo: Obtener PDFs, scripts y recursos.
Pasos:
1. En la lección, sección "Recursos" → Descargar.
2. Archivos disponibles: guías, cheatsheets, scripts de ejemplo.

---

### 7.8 Reportar un problema en contenido
Objetivo: Notificar errores en una lección o ejercicio.
Pasos:
1. En la lección, clic en "Reportar".
2. Describe el problema y adjunta evidencia (logs, screenshots).

Follow-up: El equipo de contenido revisará y responderá.

---

## 8. Laboratorios y sandbox (uso seguro)
- Los labs se ejecutan en contenedores aislados, sin privilegios root.
- No hay acceso a la red del host ni a otros contenedores.
- Evita ejecutar comandos que requieran privilegios especiales o que afecten recursos globales.
- Si necesitas instalar paquetes persistentes, consulta la política del curso (algunos labs no permiten persistencia).

---

## 9. Gestión de cuenta
### 9.1 Perfil
- Editar nombre, foto, biografía.
- Preferencias: idioma, notificaciones, tema (oscuro/claro).

### 9.2 Seguridad
- Cambiar contraseña
- Habilitar 2FA (TOTP)
- Regenerar tokens API (si aplica)

### 9.3 Eliminar cuenta
- Solicitud en Ajustes → Eliminar cuenta (requiere confirmación por email).
- Aviso: esta acción es irreversible.

---

## 10. Soporte, FAQ y troubleshooting
### 10.1 FAQ rápidas
- ¿Por qué mi lab no arranca? → Revisa cuota, intenta reiniciar; si persiste contacta soporte.
- No recibo correo de verificación → Revisa SPAM y confirma dominio aceptado.

### 10.2 Errores comunes y soluciones
- Error: "Permission denied" en lab → No uses sudo; algunos comandos no funcionan en sandbox.
- Error: "Upload failed" → Tamaño máximo superado; comprime el archivo.

### 10.3 Contacto de soporte
- Soporte via email: soporte@tu-dominio.com
- Chat interno: link en portal (si está habilitado)
- Tiempo de respuesta: 24–48 horas (SLA básico)

---

## 11. Buenas prácticas y seguridad
- No compartas credenciales.
- Usa 2FA si trabajas con datos sensibles.
- Guarda tus scripts localmente si necesitas reutilizarlos.
- Cierra labs cuando termines para liberar recursos.

---

## 12. Glosario
- Lab / Sandbox: contenedor aislado donde se ejecutan comandos.
- Lección: unidad de contenido con teoría + ejercicios.
- Curso: colección de lecciones.
- Submission: envío de solución a un ejercicio.

---

## 13. Registro de cambios
| Versión | Fecha | Autor | Cambios |
|--------:|-------:|-------|--------|
| 1.0.0 | 2025-11-13 | Equipo | Borrador inicial del manual |

---

## Anexos y referencias
- Documento de Arquitectura (SAD): `Documentacion/SAD.md`
- README de repositorio: `README.md`
- Control de versiones de documentos: `Documentacion/CONTROL_DE_VERSIONES.md`

---

## Siguientes pasos sugeridos
1. Generar capturas para secciones clave (`images/01_dashboard.png`, `images/02_launch_lab.png`, `images/03_submit.png`).
2. Rellenar ejemplos concretos de comandos para labs (ej: `ls -la`, `grep`, `systemctl status`) según cada lección.
3. Compartir con el equipo para revisar y aprobar, luego añadir entrada en `CONTROL_DE_VERSIONES.md` y exportar snapshot PDF/Word.

---

*Plantilla generada automáticamente. Por favor revisa y solicita cambios específicos (tono, más detalle técnico, añadir capturas o videos).*
