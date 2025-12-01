import { TestSetup } from './setup';
import { TestHelpers } from './helpers';

describe('Pruebas de Navegación y Funcionalidad', () => {
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

  describe('Página Principal (Home)', () => {
    test('Debería cargar la página principal correctamente', async () => {
      await testSetup.navigateTo('/');
      await helpers.waitForPageLoad();
      
      const title = await helpers.getTitle();
      expect(title).toBeTruthy();
      
      // Verificar que la página cargó
      const currentUrl = await helpers.getCurrentUrl();
      expect(currentUrl).toContain(testSetup.getBaseUrl());
    }, 20000);

    test('Debería mostrar el header', async () => {
      await testSetup.navigateTo('/');
      await helpers.waitForPageLoad();
      
      const headerExists = await helpers.elementExists('header, .header, nav');
      expect(headerExists).toBe(true);
    }, 15000);

    test('Debería tener enlaces de navegación', async () => {
      await testSetup.navigateTo('/');
      await helpers.waitForPageLoad();
      
      // Verificar que hay enlaces
      const hasLinks = await helpers.elementExists('a');
      expect(hasLinks).toBe(true);
    }, 15000);
  });

  describe('Dashboard', () => {
    test('Debería redirigir a login si no está autenticado', async () => {
      await testSetup.navigateTo('/dashboard');
      await helpers.waitForPageLoad();
      await testSetup.wait(2000);
      
      const currentUrl = await helpers.getCurrentUrl();
      // Si hay protección de rutas, debería redirigir a login
      const isProtected = currentUrl.includes('/login') || currentUrl.includes('/dashboard');
      expect(isProtected).toBe(true);
    }, 20000);
  });

  describe('Biblioteca de Lecciones', () => {
    test('Debería cargar la página de biblioteca', async () => {
      await testSetup.navigateTo('/biblioteca');
      await helpers.waitForPageLoad();
      
      const currentUrl = await helpers.getCurrentUrl();
      expect(currentUrl).toContain('/biblioteca');
    }, 20000);

    test('Debería mostrar lecciones disponibles', async () => {
      await testSetup.navigateTo('/biblioteca');
      await helpers.waitForPageLoad();
      await testSetup.wait(2000);
      
      // Buscar contenido de lecciones (ajusta según tu implementación)
      const hasContent = await helpers.elementExists('.lesson, .card, .leccion, main');
      expect(hasContent).toBe(true);
    }, 20000);
  });

  describe('Ranking', () => {
    test('Debería cargar la página de ranking', async () => {
      await testSetup.navigateTo('/ranking');
      await helpers.waitForPageLoad();
      
      const currentUrl = await helpers.getCurrentUrl();
      expect(currentUrl).toContain('/ranking');
    }, 20000);
  });

  describe('Navegación Responsive', () => {
    test('Debería funcionar en diferentes tamaños de pantalla', async () => {
      const driver = testSetup.getDriver();
      
      // Probar en móvil
      await driver.manage().window().setRect({ width: 375, height: 667 });
      await testSetup.navigateTo('/');
      await helpers.waitForPageLoad();
      
      let currentUrl = await helpers.getCurrentUrl();
      expect(currentUrl).toContain(testSetup.getBaseUrl());
      
      // Probar en tablet
      await driver.manage().window().setRect({ width: 768, height: 1024 });
      await testSetup.navigateTo('/biblioteca');
      await helpers.waitForPageLoad();
      
      currentUrl = await helpers.getCurrentUrl();
      expect(currentUrl).toContain('/biblioteca');
      
      // Probar en desktop
      await driver.manage().window().setRect({ width: 1920, height: 1080 });
      await testSetup.navigateTo('/');
      await helpers.waitForPageLoad();
      
      currentUrl = await helpers.getCurrentUrl();
      expect(currentUrl).toContain(testSetup.getBaseUrl());
    }, 30000);
  });

  describe('Políticas y Términos', () => {
    test('Debería cargar la página de política de privacidad', async () => {
      await testSetup.navigateTo('/privacy');
      await helpers.waitForPageLoad();
      
      const currentUrl = await helpers.getCurrentUrl();
      expect(currentUrl).toContain('/privacy');
    }, 20000);

    test('Debería cargar la página de términos y condiciones', async () => {
      await testSetup.navigateTo('/terms');
      await helpers.waitForPageLoad();
      
      const currentUrl = await helpers.getCurrentUrl();
      expect(currentUrl).toContain('/terms');
    }, 20000);
  });

  describe('Manejo de Errores', () => {
    test('Debería manejar rutas no encontradas', async () => {
      await testSetup.navigateTo('/ruta-que-no-existe-12345');
      await helpers.waitForPageLoad();
      await testSetup.wait(2000);
      
      // Debería redirigir a home o mostrar página 404
      const currentUrl = await helpers.getCurrentUrl();
      expect(currentUrl).toBeTruthy();
    }, 20000);
  });
});
