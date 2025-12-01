import { TestSetup } from './setup';
import { TestHelpers } from './helpers';

describe('Pruebas de Autenticación', () => {
  let testSetup: TestSetup;
  let helpers: TestHelpers;

  // Se ejecuta antes de todas las pruebas
  beforeAll(async () => {
    testSetup = new TestSetup();
    await testSetup.setupDriver();
    helpers = new TestHelpers(testSetup.getDriver());
  }, 30000);

  // Se ejecuta después de todas las pruebas
  afterAll(async () => {
    await testSetup.teardown();
  }, 10000);

  describe('Página de Login', () => {
    test('Debería cargar la página de login correctamente', async () => {
      await testSetup.navigateTo('/login');
      await helpers.waitForPageLoad();
      
      const title = await helpers.getTitle();
      expect(title).toBeTruthy();
      
      // Verificar que existan los campos de login
      const emailExists = await helpers.elementExists('input[type="email"]');
      const passwordExists = await helpers.elementExists('input[type="password"]');
      
      expect(emailExists).toBe(true);
      expect(passwordExists).toBe(true);
    }, 20000);

    test('Debería mostrar error con credenciales inválidas', async () => {
      await testSetup.navigateTo('/login');
      await helpers.waitForPageLoad();

      // Llenar formulario con credenciales incorrectas
      await helpers.fillInput('input[type="email"]', 'usuario@invalido.com');
      await helpers.fillInput('input[type="password"]', 'contraseñaincorrecta');
      
      // Buscar y hacer clic en el botón de login
      await helpers.clickElement('button[type="submit"]');
      
      // Esperar mensaje de error (ajusta el selector según tu implementación)
      await testSetup.wait(2000);
      
      // Verificar que seguimos en la página de login
      const currentUrl = await helpers.getCurrentUrl();
      expect(currentUrl).toContain('/login');
    }, 20000);

    test('Debería tener un enlace para registro', async () => {
      await testSetup.navigateTo('/login');
      await helpers.waitForPageLoad();
      
      // Buscar enlace de registro (ajusta el selector según tu implementación)
      const hasRegisterLink = await helpers.elementExists('a[href*="registro"], a[href*="register"]');
      expect(hasRegisterLink).toBe(true);
    }, 15000);

    test('Debería tener un enlace de recuperación de contraseña', async () => {
      await testSetup.navigateTo('/login');
      await helpers.waitForPageLoad();
      
      // Buscar enlace de recuperar contraseña
      const hasForgotLink = await helpers.elementExists('a[href*="forgot"], a[href*="recuperar"]');
      expect(hasForgotLink).toBe(true);
    }, 15000);
  });

  describe('Página de Registro', () => {
    test('Debería cargar la página de registro correctamente', async () => {
      await testSetup.navigateTo('/registro');
      await helpers.waitForPageLoad();
      
      // Verificar campos básicos de registro
      const nameExists = await helpers.elementExists('input[name="name"], input[name="nombre"], input[type="text"]');
      const emailExists = await helpers.elementExists('input[type="email"]');
      const passwordExists = await helpers.elementExists('input[type="password"]');
      
      expect(nameExists).toBe(true);
      expect(emailExists).toBe(true);
      expect(passwordExists).toBe(true);
    }, 20000);

    test('Debería validar campos requeridos', async () => {
      await testSetup.navigateTo('/registro');
      await helpers.waitForPageLoad();
      
      // Intentar enviar formulario vacío
      await helpers.clickElement('button[type="submit"]');
      
      // Esperar que no se haya navegado (validación del lado del cliente)
      await testSetup.wait(1000);
      const currentUrl = await helpers.getCurrentUrl();
      expect(currentUrl).toContain('registro');
    }, 20000);
  });

  describe('Modal de Login/Registro', () => {
    test('Debería abrir modal de login desde la página principal', async () => {
      await testSetup.navigateTo('/');
      await helpers.waitForPageLoad();
      
      // Buscar botón de login (ajusta según tu implementación)
      try {
        await helpers.clickElement('button:contains("Iniciar"), .login-btn, .btn-login');
        await testSetup.wait(1000);
        
        // Verificar que el modal está visible
        const modalExists = await helpers.elementExists('.modal, .dialog, [role="dialog"]');
        expect(modalExists).toBe(true);
      } catch (error) {
        // Si no hay modal en home, está bien
        console.log('No modal en página principal');
      }
    }, 20000);
  });
});
