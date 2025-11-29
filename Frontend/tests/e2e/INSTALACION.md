# 🧪 Pruebas Automatizadas con Selenium - Instalación Completada

## ✅ Lo que se instaló

### Dependencias npm
- **selenium-webdriver** `4.38.0` - Framework principal de Selenium
- **chromedriver** `142.0.3` - Driver para controlar Chrome/Chromium
- **@types/selenium-webdriver** - Tipos TypeScript para Selenium
- **jest** `30.2.0` - Framework de testing
- **ts-jest** `29.4.5` - Transformador TypeScript para Jest
- **@types/jest** - Tipos TypeScript para Jest

### Software del sistema
- **chromium-browser** `142.0.7444.175` - Navegador para las pruebas

## 📁 Archivos creados

```
Frontend/
├── tests/e2e/
│   ├── setup.ts              # Configuración de Selenium WebDriver
│   ├── helpers.ts            # Funciones helper para las pruebas
│   ├── basic.test.ts         # Prueba básica de configuración
│   ├── auth.test.ts          # Pruebas de autenticación
│   ├── navigation.test.ts    # Pruebas de navegación
│   ├── app.test.ts           # Pruebas específicas de tu app
│   ├── run-tests.sh          # Script para ejecutar todas las pruebas
│   └── README.md             # Documentación completa
├── jest.config.json          # Configuración de Jest
└── package.json              # Scripts actualizados

.github/workflows/
└── e2e-tests.yml             # Workflow de GitHub Actions
```

## 🚀 Cómo usar las pruebas

### Comandos disponibles

```bash
# Ejecutar todas las pruebas E2E
pnpm test:e2e

# Ejecutar pruebas en modo watch (se reejecutan al hacer cambios)
pnpm test:e2e:watch

# Ejecutar solo la prueba básica
pnpm test:e2e:basic

# Ejecutar solo pruebas de autenticación
pnpm test:e2e:auth

# Ejecutar solo pruebas de navegación
pnpm test:e2e:nav

# Ejecutar pruebas específicas de tu aplicación
pnpm test:e2e:app

# Ejecutar todas las pruebas con el script bash
pnpm test:e2e:all
```

### Resultado actual

```
✅ Configuración básica - 3/3 pruebas pasadas
   ✓ El navegador inicia correctamente
   ✓ Puede navegar a Google
   ✓ Los helpers funcionan correctamente
```

## 📝 Tipos de pruebas creadas

### 1. **basic.test.ts** - Verificación de configuración
- Verifica que Selenium y ChromeDriver funcionan correctamente
- Prueba básica navegando a Google

### 2. **auth.test.ts** - Autenticación
- Carga de páginas de login y registro
- Validación de formularios
- Manejo de credenciales inválidas
- Enlaces de recuperación de contraseña

### 3. **navigation.test.ts** - Navegación general
- Carga de página principal
- Verificación de header
- Pruebas de biblioteca y ranking
- Navegación responsive (móvil, tablet, desktop)
- Páginas de políticas y términos

### 4. **app.test.ts** - Específicas de tu aplicación
- Navegación pública (home, login, registro, privacy, terms)
- Protección de rutas (dashboard, biblioteca, ranking, admin)
- Formularios de login y registro con validaciones
- Navegación responsive completa

## 🔧 Configuración

### Modo Headless
Por defecto, las pruebas corren en modo **headless** (sin ver el navegador).

Para ver el navegador durante las pruebas (debugging), edita `tests/e2e/setup.ts`:

```typescript
// Comenta esta línea:
// options.addArguments('--headless=new');
```

### Cambiar URL base
Por defecto usa `http://localhost:5173`. Para cambiar:

```typescript
// En tus pruebas:
testSetup = new TestSetup('http://localhost:3000');
```

### Timeouts
Los timeouts están configurados en:
- `jest.config.json`: `"testTimeout": 30000` (30 segundos)
- `beforeAll`: `30000` ms
- `afterAll`: `10000` ms
- Tests individuales: `20000` ms típicamente

## 📊 Ejecutar pruebas con tu aplicación

### Paso 1: Iniciar servidor de desarrollo
```bash
cd Frontend
pnpm dev
```

### Paso 2: En otra terminal, ejecutar pruebas
```bash
cd Frontend
pnpm test:e2e:app
```

O usar el script completo:
```bash
cd Frontend
pnpm test:e2e:all
```

## 🔄 Integración continua (CI/CD)

### GitHub Actions
Ya está configurado en `.github/workflows/e2e-tests.yml`

Se ejecutará automáticamente en:
- Push a `main` o `develop`
- Pull requests a `main` o `develop`

### Otras plataformas

**GitLab CI** (.gitlab-ci.yml):
```yaml
e2e-tests:
  stage: test
  script:
    - apt-get update && apt-get install -y chromium-browser
    - cd Frontend
    - pnpm install
    - pnpm test:e2e:basic
```

**Jenkins** (Jenkinsfile):
```groovy
stage('E2E Tests') {
  steps {
    sh 'cd Frontend && pnpm test:e2e:basic'
  }
}
```

## 📸 Screenshots en errores

Los screenshots se guardan automáticamente en `tests/e2e/screenshots/` cuando ocurre un error.

Para tomar un screenshot manualmente:
```typescript
await testSetup.takeScreenshot('nombre-descriptivo');
```

## 🐛 Debugging

### Ver logs detallados
```bash
pnpm test:e2e -- --verbose
```

### Ver qué tests están disponibles
```bash
pnpm test:e2e -- --listTests
```

### Ejecutar un solo test
```bash
pnpm test:e2e -- -t "nombre del test"
```

### Ver handles abiertos
```bash
pnpm test:e2e -- --detectOpenHandles
```

## 🎯 Próximos pasos recomendados

1. **Ejecutar con tu app corriendo**
   ```bash
   # Terminal 1
   pnpm dev
   
   # Terminal 2
   pnpm test:e2e:app
   ```

2. **Crear pruebas para funcionalidades específicas**
   - Pruebas de lecciones
   - Pruebas de terminal interactiva
   - Pruebas de sistema de puntos (XP)

3. **Agregar pruebas de rendimiento**
   - Medir tiempos de carga
   - Verificar optimizaciones

4. **Tests con usuario autenticado**
   - Crear helper para login automático
   - Probar funcionalidades protegidas

## 📚 Recursos adicionales

- [Selenium WebDriver Docs](https://www.selenium.dev/documentation/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Chrome DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/)

## ✨ Ejemplo de test personalizado

```typescript
import { TestSetup } from './setup';
import { TestHelpers } from './helpers';

describe('Mi Nueva Funcionalidad', () => {
  let testSetup: TestSetup;
  let helpers: TestHelpers;

  beforeAll(async () => {
    testSetup = new TestSetup();
    await testSetup.setupDriver();
    helpers = new TestHelpers(testSetup.getDriver());
  }, 30000);

  afterAll(async () => {
    await testSetup.teardown();
  }, 10000);

  test('Debería hacer algo específico', async () => {
    await testSetup.navigateTo('/mi-ruta');
    await helpers.waitForElement('.mi-elemento');
    
    const texto = await helpers.getText('.mi-elemento');
    expect(texto).toContain('Texto esperado');
  }, 20000);
});
```

---

**¡Configuración completada exitosamente! 🎉**

Selenium está listo para usar en tu proyecto.
