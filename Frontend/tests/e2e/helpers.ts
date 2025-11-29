import { WebDriver, By, until, WebElement } from 'selenium-webdriver';

export class TestHelpers {
  constructor(private driver: WebDriver) {}

  // Esperar a que un elemento sea visible
  async waitForElement(selector: string, timeout: number = 10000): Promise<WebElement> {
    const element = await this.driver.wait(
      until.elementLocated(By.css(selector)),
      timeout,
      `Element not found: ${selector}`
    );
    await this.driver.wait(
      until.elementIsVisible(element),
      timeout,
      `Element not visible: ${selector}`
    );
    return element;
  }

  // Esperar a que un elemento sea clickeable y hacer clic
  async clickElement(selector: string): Promise<void> {
    const element = await this.waitForElement(selector);
    await this.driver.wait(
      until.elementIsEnabled(element),
      5000,
      `Element not enabled: ${selector}`
    );
    await element.click();
  }

  // Escribir texto en un input
  async fillInput(selector: string, text: string, clearFirst: boolean = true): Promise<void> {
    const element = await this.waitForElement(selector);
    if (clearFirst) {
      await element.clear();
    }
    await element.sendKeys(text);
  }

  // Obtener texto de un elemento
  async getText(selector: string): Promise<string> {
    const element = await this.waitForElement(selector);
    return await element.getText();
  }

  // Verificar si un elemento existe
  async elementExists(selector: string): Promise<boolean> {
    try {
      await this.driver.findElement(By.css(selector));
      return true;
    } catch {
      return false;
    }
  }

  // Esperar a que desaparezca un elemento
  async waitForElementToDisappear(selector: string, timeout: number = 10000): Promise<void> {
    await this.driver.wait(async () => {
      const elements = await this.driver.findElements(By.css(selector));
      return elements.length === 0;
    }, timeout, `Element still present: ${selector}`);
  }

  // Esperar a que aparezca texto
  async waitForText(selector: string, text: string, timeout: number = 10000): Promise<void> {
    await this.driver.wait(async () => {
      try {
        const element = await this.driver.findElement(By.css(selector));
        const elementText = await element.getText();
        return elementText.includes(text);
      } catch {
        return false;
      }
    }, timeout, `Text "${text}" not found in ${selector}`);
  }

  // Obtener atributo de un elemento
  async getAttribute(selector: string, attribute: string): Promise<string | null> {
    const element = await this.waitForElement(selector);
    return await element.getAttribute(attribute);
  }

  // Ejecutar JavaScript en la página
  async executeScript<T>(script: string, ...args: any[]): Promise<T> {
    return await this.driver.executeScript(script, ...args) as T;
  }

  // Scroll hacia un elemento
  async scrollToElement(selector: string): Promise<void> {
    const element = await this.waitForElement(selector);
    await this.driver.executeScript('arguments[0].scrollIntoView(true);', element);
  }

  // Obtener URL actual
  async getCurrentUrl(): Promise<string> {
    return await this.driver.getCurrentUrl();
  }

  // Obtener título de la página
  async getTitle(): Promise<string> {
    return await this.driver.getTitle();
  }

  // Esperar navegación (cambio de URL)
  async waitForUrlChange(expectedUrl: string, timeout: number = 10000): Promise<void> {
    await this.driver.wait(async () => {
      const currentUrl = await this.getCurrentUrl();
      return currentUrl.includes(expectedUrl);
    }, timeout, `URL did not change to include: ${expectedUrl}`);
  }

  // Esperar a que la página esté completamente cargada
  async waitForPageLoad(): Promise<void> {
    await this.driver.wait(async () => {
      const readyState = await this.executeScript<string>('return document.readyState');
      return readyState === 'complete';
    }, 30000);
  }
}
