import { browser, element, by } from 'protractor';

export class ObliqueReactivePage {
  navigateTo() {
    return browser.get('/');
  }

  getHeaderText() {
    return element(by.css('.application-brand-app-title a')).getText();
  }
}
