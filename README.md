flowchart LR
  subgraph FE [Frontend (Vue.js)]
    A[SPA Vue.js] -->|HTTP/REST / GraphQL| API
    A -->|Assets| CDN
  end

  subgraph BE [Backend (Node/TypeScript)]
    API[API Gateway / Express/Nest] --> AuthService
    API --> CoursesService
    API --> LessonsService
    API --> FileService
    API --> NotificationService
  end

  subgraph DB [Persistencia]
    Postgres[(Postgres)]
    Redis[(Redis Cache / Session)]
  end

  subgraph Storage [File Storage]
    S3[(S3 / MinIO)]
  end

  subgraph Infra [Infra / CI-CD]
    CI[GitHub Actions]
    Docker[Docker / docker-compose]
    Platform[Railway / Render / Heroku]
    CDN[Netlify / Vercel / Cloudflare]
  end

  API --> Postgres
  API --> Redis
  FileService --> S3
  A --> CDN
  FE --> CI
  BE --> CI
  CI --> Docker
  Docker --> Platform
