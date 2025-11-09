# 📐 Documento de Arquitectura de Software (SAD)
## Sistema de Aprendizaje Linux

**Versión:** 2.0.0  
**Estado:** Aprobado  
**Fecha de creación:** 2025-10-23  
**Última actualización:** 2025-10-25  
**Propietario:** Equipo de Desarrollo  
**Revisores:** [Nombres]  

---

## 📋 Tabla de contenidos
1. [Introducción](#introducción)
2. [Visión general de la arquitectura](#visión-general-de-la-arquitectura)
3. [Contexto del sistema](#contexto-del-sistema)
4. [Metas y restricciones arquitectónicas](#metas-y-restricciones-arquitectónicas)
5. [Vistas arquitectónicas](#vistas-arquitectónicas)
6. [Patrones y estilos arquitectónicos](#patrones-y-estilos-arquitectónicos)
7. [Decisiones arquitectónicas clave](#decisiones-arquitectónicas-clave)
8. [Tecnologías y herramientas](#tecnologías-y-herramientas)
9. [Seguridad](#seguridad)
10. [Despliegue y escalabilidad](#despliegue-y-escalabilidad)
11. [Monitoreo y observabilidad](#monitoreo-y-observabilidad)
12. [Consideraciones de desarrollo](#consideraciones-de-desarrollo)
13. [Glosario](#glosario)

---

## 1. Introducción

### 1.1 Propósito
Este documento define la arquitectura de software del **Sistema de Aprendizaje Linux**, un plataforma educativa interactiva para enseñanza de Linux con laboratorios prácticos en sandbox.

### 1.2 Audiencia
- Arquitectos de software
- Desarrolladores backend/frontend
- DevOps engineers
- Product managers
- Stakeholders técnicos

### 1.3 Alcance
Cubre la arquitectura de:
- Frontend (Vue.js)
- Backend (Nest.js + NestJS API)
- Base de datos (PostgreSQL)
- Infraestructura (AWS EC2 + Docker)
- Laboratorios en contenedores (Docker + Linux)
- Notificaciones (SMTP)
- Integración externa (OAuth, Git)

---

## 2. Visión general de la arquitectura

### 2.1 Diagrama de alto nivel

```
┌─────────────────────────────────────────────────────────────┐
│                     AWS EC2 Instance                         │
│                  (Ubuntu / Docker Engine)                    │
├──────────────────┬──────────────────┬──────────────────┤
│                  │                  │                  │
│  Vue.js FE       │  Nest.js Backend │  PostgreSQL      │
│  Container       │  Container       │  Container       │
│  (Port 3000)     │  (Port 3001)     │  (Port 5432)     │
│                  │                  │                  │
└──────────────────┴──────────────────┴──────────────────┘
         │                │                    │
         └────────────────┼────────────────────┘
                  Docker Network
                 (Penguin-Path-network)
                
┌─────────────────────────────────────────┐
│  Docker Volume: Penguin_db              │
│  (Persistencia de datos PostgreSQL)     │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  Laboratorios Linux (Contenedores)      │
│  - Distribuciones: Ubuntu, Arch, CentOS│
│  - Aislado por usuario                  │
│  - Limite: CPU, RAM, tiempo             │
└─────────────────────────────────────────┘
```

### 2.2 Características principales
- **Escalabilidad horizontal**: Múltiples instancias de backend
- **Aislamiento de laboratorios**: Cada lab en contenedor independiente
- **Persistencia de datos**: PostgreSQL con volúmenes Docker
- **API RESTful**: Nest.js con patrones de microservicios
- **Frontend reactivo**: Vue.js con componentes reutilizables
- **Seguridad de contenedores**: Limites de recursos y usuarios sin privilegios

---

## 3. Contexto del sistema

### 3.1 Actores principales
- **Estudiantes**: Acceden a cursos, resuelven ejercicios
- **Instructores**: Crean cursos, revisan envíos
- **Administradores**: Gestionan usuarios, recursos
- **Sistemas externos**: GitHub (OAuth), SMTP (correo)

### 3.2 Interfaces externas
- **HTTP/S**: Navegador web (80, 443)
- **OAuth**: Integración GitHub/Google
- **SMTP**: Envío de notificaciones
- **Docker Hub**: Imágenes base
- **Git**: Clonación de repositorios de cursos

### 3.3 Dependencias externas
- AWS (infraestructura cloud)
- Docker (containerización)
- PostgreSQL (base de datos)
- Node.js (runtime backend)

---

## 4. Metas y restricciones arquitectónicas

### 4.1 Metas
| Meta | Descripción |
|------|-------------|
| **Disponibilidad** | 99.5% uptime en producción |
| **Rendimiento** | Respuesta < 200ms en API, labs inician < 5s |
| **Escalabilidad** | Soportar 1000+ usuarios concurrentes |
| **Seguridad** | Aislamiento de labs, autenticación 2FA |
| **Mantenibilidad** | Código modular, bien documentado, tests automatizados |
| **Usabilidad** | UI intuitiva, accesible (WCAG 2.1 AA) |

### 4.2 Restricciones
| Restricción | Detalle |
|-------------|--------|
| **Infraestructura** | AWS EC2 (t3.large mínimo) |
| **Base de datos** | PostgreSQL 16+ |
| **Contenedores** | Docker 24.0+, max 20 labs/nodo |
| **Navegadores** | Chrome 90+, Firefox 88+, Safari 14+ |
| **Cumplimiento** | GDPR, COPPA (datos menores) |
| **Presupuesto** | < $500 USD/mes AWS |

---

## 5. Vistas arquitectónicas

### 5.1 Vista de componentes

```
Frontend (Vue.js)
├── Pages
│   ├── Login
│   ├── Dashboard
│   ├── Courses
│   ├── Labs
│   └── Admin Panel
├── Components
│   ├── Header / Footer
│   ├── Card
│   ├── Terminal
│   └── ProgressBar
└── Services
    └── API Client (Axios)

Backend (Nest.js)
├── Modules
│   ├── Auth (JWT, 2FA)
│   ├── Users (CRUD, perfiles)
│   ├── Courses (gestión contenidos)
│   ├── Labs (orquestación Docker)
│   ├── Exercises (validación tests)
│   ├── Progress (seguimiento)
│   └── Admin (gestión sistema)
├── Services
│   ├── Docker Client
│   ├── File Storage
│   ├── Email Service
│   └── OAuth Provider
└── Middleware
    ├── Auth Guard
    ├── Logging
    └── Error Handling

Database (PostgreSQL)
├── Tables
│   ├── users
│   ├── courses
│   ├── lessons
│   ├── exercises
│   ├── submissions
│   ├── progress
│   └── logs
└── Indexes & Views
```

### 5.2 Vista de despliegue

```
┌─────────────────────────────────────────────────────────┐
│              AWS Región (us-east-1)                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────────────────────────────────────────┐ │
│  │         EC2 Instance (Ubuntu 22.04 LTS)         │ │
│  │         Tipo: t3.large, 8GB RAM, 100GB SSD      │ │
│  │                                                  │ │
│  │  ┌──────────────────────────────────────────┐  │ │
│  │  │      Docker Engine + Docker Compose      │  │ │
│  │  │                                          │  │ │
│  │  │  ┌─────────┐ ┌─────────┐ ┌──────────┐ │  │ │
│  │  │  │Vue.js   │ │Nest.js  │ │PostgreSQL│ │  │ │
│  │  │  │Port3000 │ │Port3001 │ │Port5432  │ │  │ │
│  │  │  └─────────┘ └─────────┘ └──────────┘ │  │ │
│  │  │                                        │  │ │
│  │  │  ┌──────────────────────────────────┐ │  │ │
│  │  │  │    Docker Volume: Penguin_db    │ │  │ │
│  │  │  │  (PostgreSQL Data Persistence)  │ │  │ │
│  │  │  └──────────────────────────────────┘ │  │ │
│  │  │                                        │  │ │
│  │  │  ┌──────────────────────────────────┐ │  │ │
│  │  │  │  Labs Containers (Dynamic)       │ │  │ │
│  │  │  │  - Ubuntu, Arch, CentOS, etc.   │ │  │ │
│  │  │  └──────────────────────────────────┘ │  │ │
│  │  │                                        │  │ │
│  │  └──────────────────────────────────────┘  │ │
│  └──────────────────────────────────────────────┘ │
│                                                   │
│  Networking:                                      │
│  - Ingress: HTTP(80), HTTPS(443) → NLB           │
│  - Docker Network: Penguin-Path-network          │
│                                                   │
└─────────────────────────────────────────────────┘

External Services:
├── GitHub OAuth (API v3)
├── SMTP Server (SES / SendGrid)
└── CloudWatch (Logs & Metrics)
```

### 5.3 Vista de flujo de datos (Inicio de sesión + Lab)

```
1. LOGIN FLOW
User → [Vue Login] → POST /auth/login → [Nest Auth] 
  → Validate Credentials → Query users table 
  → JWT Generate → Response {token, user}
  → localStorage.setItem('token') → Dashboard

2. LAB LAUNCH FLOW
User → [Click Launch Lab] → POST /labs/start/{id}
  → [Nest Labs Service] → Docker Client
  → Create Container (Ubuntu latest, limits)
  → Assign Port, Network → Query labs table (insert)
  → Response {containerId, port, wsEndpoint}
  → [Vue Terminal Component] → WebSocket connect
  → User can execute commands → Lab Sandbox

3. EXERCISE SUBMISSION FLOW
User → [Submit Solution] → POST /exercises/{id}/submit
  → File upload → Store in /uploads/labs/{userId}
  → Trigger Tests (unittest, bash script)
  → Capture output → Compare with expected
  → Grade {passed: bool, score, feedback}
  → Update progress table → Display result
```

---

## 6. Patrones y estilos arquitectónicos

### 6.1 Patrón MVC-Like (Backend)
- **Model**: Entities (User, Course, Exercise)
- **View**: JSON API responses
- **Controller**: NestJS Controllers + Resolvers

### 6.2 Patrón de Microservicios (ligero)
- Módulos independientes (Auth, Labs, Courses)
- Servicios especializados (DockerService, EmailService)
- Comunicación por eventos (RabbitMQ opcional futuro)

### 6.3 API RESTful
- Recursos: `/users`, `/courses`, `/labs`, `/exercises`
- Verbos HTTP: GET, POST, PUT, DELETE
- Versionado: `/api/v1/` (futuro multiversion)

### 6.4 Containerización (Docker)
- Cada componente en contenedor separado
- Orquestación con Docker Compose
- Labs dinámicos creados bajo demanda

### 6.5 Seguridad en capas
- Autenticación JWT + Refresh tokens
- Autorización basada en roles (RBAC)
- HTTPS/TLS obligatorio en prod
- Inyección de SQL prevenida (ORM Prisma/TypeORM)

---

## 7. Decisiones arquitectónicas clave

### ADR-001: Backend Nest.js en lugar de Express
**Decisión:** Usar Nest.js sobre Express  
**Razones:**
- TypeScript nativo
- Inyección de dependencias (IoC)
- Estructura modular escalable
- CLI potente

### ADR-002: PostgreSQL en lugar de MySQL
**Decisión:** PostgreSQL como BD principal  
**Razones:**
- Mejor manejo de tipos complejos (JSON, arrays)
- JSONB para datos anidados (configuración labs)
- Window functions para analytics
- PostGIS si necesitamos geolocalización

### ADR-003: Docker para Labs
**Decisión:** Contenedores Docker isolados por lab  
**Razones:**
- Sandbox seguro y reproducible
- Fácil escalabilidad
- Limpieza automática
- Multi-distro sin overhead

### ADR-004: AWS EC2 vs. Managed Services
**Decisión:** EC2 + Docker Compose (no ECS/K8s por ahora)  
**Razones:**
- Simplicidad inicial
- Costos controlados
- Escalabilidad manual hasta 100k usuarios
- Migración a K8s viable en futuro

### ADR-005: JWT sin sesiones
**Decisión:** Stateless con JWT + Refresh tokens  
**Razones:**
- Escalabilidad sin estado en servidor
- Compatible con múltiples servidores
- Menor carga en BD
- Refresh token para revocación

---

## 8. Tecnologías y herramientas

### 8.1 Stack backend
| Tecnología | Versión | Propósito |
|------------|---------|----------|
| **Node.js** | 20 LTS | Runtime |
| **Nest.js** | 10.x | Framework web |
| **TypeScript** | 5.x | Tipado estático |
| **PostgreSQL** | 16 | BD relacional |
| **Prisma** | 5.x | ORM |
| **Docker** | 24.0 | Containerización |
| **Docker Compose** | 2.x | Orquestación local |
| **JWT (jsonwebtoken)** | 9.x | Autenticación |
| **bcryptjs** | 2.4 | Hash contraseñas |
| **Passport.js** | 0.7 | OAuth (GitHub/Google) |
| **Bull** | 4.x | Job queue (opcional) |
| **Winston** | 3.x | Logging |
| **Joi** | 17.x | Validación |

### 8.2 Stack frontend
| Tecnología | Versión | Propósito |
|------------|---------|----------|
| **Vue.js** | 3.x | Framework UI |
| **TypeScript** | 5.x | Tipado estático |
| **Vite** | 5.x | Build tool |
| **Axios** | 1.x | HTTP client |
| **Pinia** | 2.x | State management |
| **Vue Router** | 4.x | Routing |
| **Tailwind CSS** | 3.x | Styling |
| **xterm.js** | 5.x | Terminal emulador |
| **WebSocket** | nativo | Real-time labs |

### 8.3 Infraestructura
| Herramienta | Propósito |
|-------------|----------|
| **AWS EC2** | Compute |
| **AWS RDS** (futuro) | Managed PostgreSQL |
| **AWS S3** | Almacenamiento de archivos |
| **AWS CloudWatch** | Logs & Monitoring |
| **AWS Route 53** | DNS |
| **Docker Hub** | Registry de imágenes |
| **GitHub Actions** | CI/CD |
| **Let's Encrypt** | SSL/TLS |

### 8.4 Desarrollo
| Herramienta | Propósito |
|-------------|----------|
| **Git** | VCS |
| **GitHub** | Repository + CI/CD |
| **VS Code** | IDE |
| **Docker Desktop** | Dev environment |
| **Postman / Insomnia** | API testing |
| **Jest** | Unit testing |
| **Cypress / Playwright** | E2E testing |
| **ESLint / Prettier** | Code quality |

---

## 9. Seguridad

### 9.1 Autenticación
- JWT con expiry 15 minutos
- Refresh token con expiry 7 días (httpOnly cookie)
- 2FA opcional con TOTP (Google Authenticator)
- OAuth 2.0 con GitHub/Google

### 9.2 Autorización
- RBAC: Admin, Instructor, Student
- Middleware de guardias en rutas
- Validación de propiedad de recursos

### 9.3 Datos
- Contraseñas: bcrypt con salt 12
- Conexión DB: SSL/TLS
- Volumen Docker: cifrado en reposo (AWS EBS encryption)

### 9.4 Labs
- Contenedores sin sudo
- Límites: CPU 50%, RAM 512MB, Tiempo 1 hora máx
- Red: aislada (no acceso a host)
- Archivos: tmpfs para temporal, volumen para persistencia

### 9.5 API
- HTTPS obligatorio (redirect 80→443)
- CORS configurado por dominio
- Rate limiting: 100 req/min por IP
- Input validation (Joi) en todas las rutas
- SQL injection: ORM Prisma + queries parametrizadas

### 9.6 Auditoría
- Logs de login, cambios de curso, creación de labs
- Tabla `audit_logs` con usuario, acción, timestamp
- Alertas: múltiples fallos de login, acceso admin no autorizado

---

## 10. Despliegue y escalabilidad

### 10.1 Entorno de desarrollo
```bash
# Docker Compose local
docker-compose -f docker-compose.dev.yml up

# Contenedores
- Frontend: http://localhost:3000
- Backend: http://localhost:3001
- PostgreSQL: localhost:5432
```

### 10.2 Entorno de staging/producción
```yaml
# Infraestructura AWS
- EC2: t3.large (8GB RAM, 4 vCPU, 100GB SSD)
- Security Group: 80, 443 abiertos; 5432 solo interno
- Elastic IP: IP pública estática
- CloudWatch: monitoring 24/7
```

### 10.3 CI/CD (GitHub Actions)
```
Push → GitHub Actions
  ├─ Tests (Jest, Cypress)
  ├─ Lint & Format
  ├─ Build Docker images
  ├─ Push to Docker Hub
  └─ Deploy EC2 (SSH + script)
```

### 10.4 Escalabilidad horizontal
1. **Frontend**: Réplicas en contenedor, balanceador NGINX
2. **Backend**: Múltiples instancias Nest.js, load balancer
3. **DB**: Conexión pooling (PgBouncer), réplicas read-only
4. **Labs**: Orchestrador de contenedores (Kubernetes futuro)

### 10.5 Monitoreo de recursos
- **CPU**: Alert > 80%
- **RAM**: Alert > 85%
- **Disk**: Alert > 90%
- **BD conexiones**: Max 100 (ajustar según carga)
- **Labs simultáneos**: Max 20 por nodo

---

## 11. Monitoreo y observabilidad

### 11.1 Logs
- **Backend**: Winston (ficheros + CloudWatch)
- **DB**: PostgreSQL slow query log
- **Docker**: docker logs + ELK (futuro)
- **Retención**: 30 días

### 11.2 Métricas
- **API**: latencia, error rate, throughput
- **DB**: queries/sec, conexiones activas
- **Contenedores**: CPU, memoria, I/O
- **Business**: usuarios activos, labs completados

### 11.3 Alertas
- Email si error rate > 5% en 5 min
- SMS si uptime < 99%
- Dashboard Grafana con alertas integradas

### 11.4 Health checks
```
GET /health → {status: 'ok', db: 'connected', docker: 'ok'}
GET /metrics → Prometheus format
```

---

## 12. Consideraciones de desarrollo

### 12.1 Estructura de carpetas backend (Nest.js)
```
src/
├── auth/           (login, JWT, 2FA)
├── users/          (CRUD usuarios)
├── courses/        (gestión cursos)
├── labs/           (Docker orchestration)
├── exercises/      (tests, validación)
├── progress/       (seguimiento estudiante)
├── admin/          (gestión sistema)
├── common/
│   ├── guards/     (JWT, roles)
│   ├── filters/    (exception handling)
│   ├── decorators/ (custom decorators)
│   └── middleware/ (logging, CORS)
├── services/
│   ├── docker.service.ts
│   ├── email.service.ts
│   ├── file-storage.service.ts
│   └── oauth.service.ts
├── database/
│   ├── prisma/
│   └── migrations/
└── main.ts
```

### 12.2 Estructura de carpetas frontend (Vue.js)
```
src/
├── views/          (páginas)
├── components/     (reutilizables)
├── services/       (API, auth)
├── stores/         (Pinia state)
├── router/         (rutas)
├── styles/         (Tailwind config)
├── utils/          (helpers)
├── types/          (TypeScript interfaces)
└── App.vue
```

### 12.3 Naming conventions
- **Variables**: camelCase
- **Funciones**: camelCase
- **Clases**: PascalCase
- **Constantes**: UPPER_SNAKE_CASE
- **Commits**: `feat: descrip`, `fix: descrip`, `docs: descrip`

### 12.4 Testing
- **Unit tests**: >80% coverage backend
- **Integration tests**: API + DB
- **E2E tests**: Flujos críticos (login, labs, submit)
- **Performance**: Load test con k6 o JMeter

---

## 13. Glosario

| Término | Definición |
|---------|-----------|
| **SAD** | Software Architecture Document |
| **JWT** | JSON Web Token (autenticación stateless) |
| **RBAC** | Role-Based Access Control (autorización) |
| **2FA** | Two-Factor Authentication |
| **ORM** | Object-Relational Mapping (Prisma, TypeORM) |
| **CORS** | Cross-Origin Resource Sharing |
| **HTTPS/TLS** | Seguridad en tránsito |
| **Sandbox** | Entorno aislado y seguro |
| **Contenedor** | Instancia Docker con SO mínimo |
| **Load Balancer** | Distribuye tráfico entre servidores |
| **Rate Limiting** | Límite de peticiones por usuario/IP |
| **Logging** | Registro de eventos del sistema |
| **SLA** | Service Level Agreement (disponibilidad garantizada) |

---

## 📝 Historial de cambios

| Versión | Fecha       | Autor     | Cambios clave                                      | Aprobado por |
|--------:|-------------|-----------|---------------------------------------------------|--------------|
| 2.0.0   | 2025-10-25  | Equipo    | Actualización a Nest.js, PostgreSQL, AWS          | [Revisor]    |
| 1.0.0   | 2025-09-20  | Equipo    | Versión inicial con Spring Boot y MySQL           | [Revisor]    |

---

**Documento confidencial - Solo para equipo de desarrollo**