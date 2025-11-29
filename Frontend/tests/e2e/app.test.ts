import { TestSetup } from './setup';
import { TestHelpers } from './helpers';

/**
 * Pruebas E2E para la aplicación Sistema de Aprendizaje Linux
 * 
 * IMPORTANTE: Para ejecutar estas pruebas, la aplicación debe estar corriendo en localhost:5173
 * Ejecuta: pnpm dev en otra terminal antes de correr estas pruebas
 */
describe('Sistema de Aprendizaje Linux - E2E', () => {
  let testSetup: TestSetup;
  let helpers: TestHelpers;

  beforeAll(async () => {
    testSetup = new TestSetup('http://localhost:5173');
    await testSetup.setupDriver();
    helpers = new TestHelpers(testSetup.getDriver());
  }, 30000);

  afterAll(async () => {
    await testSetup.teardown();
  }, 10000);

  describe('Navegación Pública', () => {
    test('Debería cargar la página de inicio', async () => {
      await testSetup.navigateTo('/');
      await helpers.waitForPageLoad();
      
      const title = await helpers.getTitle();
      console.log('Título de la página:', title);
      
      const currentUrl = await helpers.getCurrentUrl();
      expect(currentUrl).toBe('http://localhost:5173/');
    }, 20000);

    test('Debería cargar la página de login', async () => {
      await testSetup.navigateTo('/login');
      await helpers.waitForPageLoad();
      
      const currentUrl = await helpers.getCurrentUrl();
      expect(currentUrl).toContain('/login');
      
      // Verificar que existen los campos de login
      const emailExists = await helpers.elementExists('input[type="email"], input[name="email"]');
      const passwordExists = await helpers.elementExists('input[type="password"], input[name="password"]');
      
      expect(emailExists).toBe(true);
      expect(passwordExists).toBe(true);
    }, 20000);

    test('Debería cargar la página de registro', async () => {
      await testSetup.navigateTo('/registro');
      await helpers.waitForPageLoad();
      
      const currentUrl = await helpers.getCurrentUrl();
      expect(currentUrl).toContain('/registro');
    }, 20000);

    test('Debería cargar la página de política de privacidad', async () => {
      await testSetup.navigateTo('/privacy-policy');
      await helpers.waitForPageLoad();
      
      const currentUrl = await helpers.getCurrentUrl();
      expect(currentUrl).toContain('/privacy-policy');
    }, 20000);

    test('Debería cargar la página de términos y condiciones', async () => {
      await testSetup.navigateTo('/terms');
      await helpers.waitForPageLoad();
      
      const currentUrl = await helpers.getCurrentUrl();
      expect(currentUrl).toContain('/terms');
    }, 20000);
  });

  describe('Protección de Rutas', () => {
    test('Debería redirigir a home al intentar acceder a dashboard sin autenticación', async () => {
      await testSetup.navigateTo('/dashboard');
      await helpers.waitForPageLoad();
      await testSetup.wait(1000);
      
      const currentUrl = await helpers.getCurrentUrl();
      // Debería redirigir a home
      expect(currentUrl).toBe('http://localhost:5173/');
    }, 20000);

    test('Debería redirigir a home al intentar acceder a biblioteca sin autenticación', async () => {
      await testSetup.navigateTo('/biblioteca');
      await helpers.waitForPageLoad();
      await testSetup.wait(1000);
      
      const currentUrl = await helpers.getCurrentUrl();
      expect(currentUrl).toBe('http://localhost:5173/');
    }, 20000);

    test('Debería redirigir a home al intentar acceder a ranking sin autenticación', async () => {
      await testSetup.navigateTo('/ranking');
      await helpers.waitForPageLoad();
      await testSetup.wait(1000);
      
      const currentUrl = await helpers.getCurrentUrl();
      expect(currentUrl).toBe('http://localhost:5173/');
    }, 20000);

    test('Debería redirigir a home al intentar acceder a admin sin autenticación', async () => {
      await testSetup.navigateTo('/admin');
      await helpers.waitForPageLoad();
      await testSetup.wait(1000);
      
      const currentUrl = await helpers.getCurrentUrl();
      expect(currentUrl).toBe('http://localhost:5173/');
    }, 20000);
  });

  describe('Formulario de Login', () => {
    beforeEach(async () => {
      await testSetup.navigateTo('/login');
      await helpers.waitForPageLoad();
    });

    test('Debería mostrar error con credenciales inválidas', async () => {
      // Buscar campos del formulario
      await helpers.fillInput('input[type="email"], input[name="email"]', 'usuario@invalido.com');
      await helpers.fillInput('input[type="password"], input[name="password"]', 'passwordincorrecto');
      
      // Hacer clic en el botón de login
      await helpers.clickElement('button[type="submit"]');
      
      // Esperar un momento para la respuesta del servidor
      await testSetup.wait(2000);
      
      // Debería seguir en login o mostrar mensaje de error
      const currentUrl = await helpers.getCurrentUrl();
      expect(currentUrl).toContain('/login');
    }, 25000);

    test('Debería validar campos vacíos', async () => {
      // Intentar hacer submit sin llenar campos
      await helpers.clickElement('button[type="submit"]');
      
      await testSetup.wait(500);
      
      // Debería seguir en login
      const currentUrl = await helpers.getCurrentUrl();
      expect(currentUrl).toContain('/login');
    }, 20000);

    test('Debería tener enlace a recuperación de contraseña', async () => {
      const hasForgotLink = await helpers.elementExists('a[href*="forgot"]');
      expect(hasForgotLink).toBe(true);
    }, 15000);
  });

  describe('Formulario de Registro', () => {
    beforeEach(async () => {
      await testSetup.navigateTo('/registro');
      await helpers.waitForPageLoad();
    });

    test('Debería tener todos los campos requeridos', async () => {
      const hasNameField = await helpers.elementExists('input[name="name"], input[name="nombre"], input[name="username"]');
      const hasEmailField = await helpers.elementExists('input[type="email"], input[name="email"]');
      const hasPasswordField = await helpers.elementExists('input[type="password"], input[name="password"]');
      
      expect(hasNameField || hasEmailField).toBe(true);
      expect(hasEmailField).toBe(true);
      expect(hasPasswordField).toBe(true);
    }, 20000);

    test('Debería validar formato de email', async () => {
      await helpers.fillInput('input[type="email"], input[name="email"]', 'emailinvalido');
      await helpers.clickElement('button[type="submit"]');
      
      await testSetup.wait(500);
      
      // Debería seguir en registro
      const currentUrl = await helpers.getCurrentUrl();
      expect(currentUrl).toContain('/registro');
    }, 20000);
  });

  describe('Navegación Responsive', () => {
    test('Debería funcionar en vista móvil', async () => {
      const driver = testSetup.getDriver();
      await driver.manage().window().setRect({ width: 375, height: 667 });
      
      await testSetup.navigateTo('/');
      await helpers.waitForPageLoad();
      
      const currentUrl = await helpers.getCurrentUrl();
      expect(currentUrl).toBe('http://localhost:5173/');
      
      // Verificar que la página cargó correctamente
      const bodyExists = await helpers.elementExists('body');
      expect(bodyExists).toBe(true);
    }, 20000);

    test('Debería funcionar en vista tablet', async () => {
      const driver = testSetup.getDriver();
      await driver.manage().window().setRect({ width: 768, height: 1024 });
      
      await testSetup.navigateTo('/login');
      await helpers.waitForPageLoad();
      
      const currentUrl = await helpers.getCurrentUrl();
      expect(currentUrl).toContain('/login');
    }, 20000);

    test('Debería funcionar en vista desktop', async () => {
      const driver = testSetup.getDriver();
      await driver.manage().window().setRect({ width: 1920, height: 1080 });
      
      await testSetup.navigateTo('/');
      await helpers.waitForPageLoad();
      
      const currentUrl = await helpers.getCurrentUrl();
      expect(currentUrl).toBe('http://localhost:5173/');
    }, 20000);
  });
});
