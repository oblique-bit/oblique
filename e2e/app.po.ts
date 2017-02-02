import { browser, element, by } from 'protractor';

export class Oblique2ReactivePage {
  navigateTo() {
    return browser.get('/');
  }

  getHeaderText() {
    return element(by.css('.application-brand-app-title a')).getText();
  }
}
