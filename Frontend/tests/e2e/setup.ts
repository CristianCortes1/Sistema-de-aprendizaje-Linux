import { Builder, WebDriver, Browser } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';
import { ServiceBuilder } from 'selenium-webdriver/chrome';

export class TestSetup {
  private driver: WebDriver | null = null;
  private readonly baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:5173') {
    this.baseUrl = baseUrl;
  }

  async setupDriver(): Promise<WebDriver> {
    const options = new chrome.Options();
    
    // Configuración para entorno headless (sin interfaz gráfica)
    options.addArguments('--headless=new');
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    options.addArguments('--disable-gpu');
    options.addArguments('--disable-software-rasterizer');
    options.addArguments('--disable-setuid-sandbox');
    options.addArguments('--remote-debugging-port=9222');
    options.addArguments('--window-size=1920,1080');
    
    // Configurar chromedriver
    const service = new ServiceBuilder()
      .setPath(require('chromedriver').path);
    
    this.driver = await new Builder()
      .forBrowser(Browser.CHROME)
      .setChromeService(service)
      .setChromeOptions(options)
      .build();

    // Timeout implícito para esperar elementos
    await this.driver.manage().setTimeouts({ implicit: 10000 });

    return this.driver;
  }

  async navigateTo(path: string = '/'): Promise<void> {
    if (!this.driver) {
      throw new Error('Driver not initialized. Call setupDriver() first.');
    }
    const url = `${this.baseUrl}${path}`;
    await this.driver.get(url);
  }

  async teardown(): Promise<void> {
    if (this.driver) {
      await this.driver.quit();
      this.driver = null;
    }
  }

  getDriver(): WebDriver {
    if (!this.driver) {
      throw new Error('Driver not initialized. Call setupDriver() first.');
    }
    return this.driver;
  }

  getBaseUrl(): string {
    return this.baseUrl;
  }

  // Helper para esperar y tomar screenshot en caso de error
  async takeScreenshot(filename: string): Promise<void> {
    if (this.driver) {
      const screenshot = await this.driver.takeScreenshot();
      const fs = await import('fs');
      const path = await import('path');
      const screenshotPath = path.join(__dirname, 'screenshots', `${filename}.png`);
      
      // Crear directorio si no existe
      const dir = path.dirname(screenshotPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(screenshotPath, screenshot, 'base64');
    }
  }

  // Helper para esperar un tiempo específico
  async wait(ms: number): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, ms));
  }
}
