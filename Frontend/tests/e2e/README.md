# Pruebas E2E con Selenium

Este directorio contiene pruebas end-to-end (E2E) automatizadas usando Selenium WebDriver.

## 📋 Prerrequisitos

- Node.js >= 20.x
- pnpm
- Chrome/Chromium instalado

## 🚀 Ejecutar las Pruebas

### Ejecutar todas las pruebas
```bash
pnpm test:e2e
```

### Ejecutar pruebas en modo watch
```bash
pnpm test:e2e:watch
```

### Ejecutar solo la prueba básica
```bash
pnpm test:e2e:basic
```

### Ejecutar un archivo específico
```bash
pnpm test:e2e tests/e2e/auth.test.ts
```

## 📁 Estructura

```
tests/e2e/
├── setup.ts           # Configuración del driver de Selenium
├── helpers.ts         # Funciones helper para las pruebas
├── basic.test.ts      # Prueba básica de configuración
├── auth.test.ts       # Pruebas de autenticación
├── navigation.test.ts # Pruebas de navegación
└── screenshots/       # Screenshots capturados en errores
```

## 🔧 Configuración

### setup.ts
Configura el WebDriver de Chrome en modo headless para CI/CD.

Para ver el navegador durante las pruebas (modo debugging), edita `setup.ts` y comenta:
```typescript
// options.addArguments('--headless');
```

### helpers.ts
Proporciona funciones útiles para:
- Esperar elementos
- Hacer clic en elementos
- Llenar formularios
- Verificar texto
- Navegar
- Y más...

## 📝 Escribir Nuevas Pruebas

Ejemplo básico:

```typescript
import { TestSetup } from './setup';
import { TestHelpers } from './helpers';

describe('Mi Componente', () => {
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

  test('Debería hacer algo', async () => {
    await testSetup.navigateTo('/mi-ruta');
    await helpers.waitForPageLoad();
    
    await helpers.fillInput('input#email', 'test@test.com');
    await helpers.clickElement('button[type="submit"]');
    
    const texto = await helpers.getText('.mensaje');
    expect(texto).toBe('Éxito');
  }, 20000);
});
```

## 🐛 Debugging

### Tomar Screenshots
```typescript
await testSetup.takeScreenshot('nombre-del-error');
```

### Ver el navegador
Comenta la línea de headless en `setup.ts`

### Agregar tiempos de espera
```typescript
await testSetup.wait(3000); // Espera 3 segundos
```

### Logs del navegador
```typescript
const logs = await driver.manage().logs().get('browser');
console.log(logs);
```

## 📊 Selectores Útiles

### Por CSS
```typescript
await helpers.clickElement('.mi-clase');
await helpers.clickElement('#mi-id');
await helpers.clickElement('button[type="submit"]');
```

### Verificar existencia
```typescript
const existe = await helpers.elementExists('.mi-clase');
expect(existe).toBe(true);
```

## 🎯 Mejores Prácticas

1. **Timeouts**: Siempre configura timeouts apropiados (especialmente en `beforeAll`)
2. **Limpieza**: Usa `afterAll` para cerrar el navegador
3. **Esperas**: Usa `waitForElement` en lugar de `sleep` cuando sea posible
4. **Selectores**: Prefiere IDs y clases específicas sobre selectores complejos
5. **Screenshots**: Toma screenshots en los `catch` para debugging
6. **Independencia**: Cada test debe ser independiente de los demás

## 🔄 CI/CD

Las pruebas están configuradas para funcionar en modo headless, ideal para:
- GitHub Actions
- GitLab CI
- Jenkins
- Cualquier sistema de CI/CD

Ejemplo de GitHub Actions:
```yaml
- name: Run E2E Tests
  run: pnpm test:e2e
```

## 🆘 Problemas Comunes

### Chrome no encontrado
```bash
sudo apt-get install chromium-browser chromium-chromedriver
```

### Timeouts
Aumenta los timeouts en `jest.config.json`:
```json
"testTimeout": 60000
```

### Puerto ocupado
Cambia el puerto en `setup.ts`:
```typescript
constructor(baseUrl: string = 'http://localhost:3000')
```
