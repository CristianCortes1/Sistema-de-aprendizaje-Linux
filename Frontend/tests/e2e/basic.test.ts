import { TestSetup } from './setup';
import { TestHelpers } from './helpers';

/**
 * Ejemplo de prueba básica para verificar el setup
 * Esta prueba siempre debería pasar
 */
describe('Prueba de Configuración', () => {
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

  test('El navegador debería iniciar correctamente', async () => {
    const driver = testSetup.getDriver();
    expect(driver).toBeTruthy();
  });

  test('Debería poder navegar a Google', async () => {
    const driver = testSetup.getDriver();
    await driver.get('https://www.google.com');
    
    const title = await driver.getTitle();
    expect(title).toContain('Google');
  }, 15000);

  test('Los helpers deberían funcionar correctamente', async () => {
    const driver = testSetup.getDriver();
    await driver.get('https://www.google.com');
    
    // Esperar a que cargue el input de búsqueda
    const searchBoxExists = await helpers.elementExists('textarea[name="q"]');
    expect(searchBoxExists).toBe(true);
  }, 15000);
});
