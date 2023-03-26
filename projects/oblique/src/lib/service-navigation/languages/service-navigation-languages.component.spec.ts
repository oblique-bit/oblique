import {TestElement} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {EventEmitter} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ObMockTranslatePipe} from '../../_mocks/mock-translate.pipe';
import {ObServiceNavigationLanguagesHarness} from './service-navigation-languages.harness';
import {ObServiceNavigationLanguagesComponent} from './service-navigation-languages.component';
import {firstValueFrom} from 'rxjs';

describe('ObServiceNavigationLanguagesComponent', () => {
	let component: ObServiceNavigationLanguagesComponent;
	let fixture: ComponentFixture<ObServiceNavigationLanguagesComponent>;
	let harness: ObServiceNavigationLanguagesHarness;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ObServiceNavigationLanguagesComponent, ObMockTranslatePipe]
		}).compileComponents();

		fixture = TestBed.createComponent(ObServiceNavigationLanguagesComponent);
		component = fixture.componentInstance;
		harness = await TestbedHarnessEnvironment.harnessForFixture(fixture, ObServiceNavigationLanguagesHarness);
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should have "ob-service-navigation-languages" class', async () => {
		const host = await harness.host();
		expect(await host.hasClass('ob-service-navigation-languages')).toBe(true);
	});

	describe('languageChange', () => {
		it('should be an EventEmitter', () => {
			expect(component.languageChange instanceof EventEmitter).toBe(true);
		});

		it('should emit', () => {
			const promise = firstValueFrom(component.languageChange);
			component.changeLanguage('de');
			expect(promise).resolves.toBe('de');
		});
	});

	describe('languages', () => {
		let buttons: TestElement[];

		beforeEach(async () => {
			buttons = await harness.getLanguageButtons();
		});

		it('should be initialized to an empty array', () => {
			expect(component.languages).toEqual([]);
		});

		it('should have 0 buttons', () => {
			expect(buttons.length).toBe(0);
		});

		describe('With some languages', () => {
			beforeEach(async () => {
				component.languages = [
					{code: 'de', label: 'Deutsch'},
					{code: 'fr', label: 'Français'},
					{code: 'it', label: 'Italiano'},
					{code: 'en', label: 'English'}
				];
				fixture.detectChanges();
				buttons = await harness.getLanguageButtons();
			});

			it('should have 4 buttons', () => {
				expect(buttons.length).toBe(4);
			});

			describe.each(['', 'de', 'fr', 'it', 'en'])('with "%s" as language', language => {
				beforeEach(() => {
					if (language) {
						component.language = language;
					}
					fixture.detectChanges();
				});

				describe.each([
					{index: 0, id: 'ob-language-de-toggle', label: 'Deutsch', active: language === 'de', text: 'DE', lang: 'de'},
					{index: 1, id: 'ob-language-fr-toggle', label: 'Français', active: language === 'fr', text: 'FR', lang: 'fr'},
					{index: 2, id: 'ob-language-it-toggle', label: 'Italiano', active: language === 'it', text: 'IT', lang: 'it'},
					{index: 3, id: 'ob-language-en-toggle', label: 'English', active: language === 'en', text: 'EN', lang: 'en'}
				])('button index $index', ({index, id, label, active, text, lang}) => {
					let button: TestElement;
					beforeEach(() => {
						button = buttons[index];
					});

					it.each([
						{className: 'ob-language-toggle', value: true},
						{className: 'ob-active', value: active}
					])('should have "$className" class: $value', async ({className, value}) => {
						expect(await button.hasClass(className)).toBe(value);
					});

					it.each([
						{attribute: 'type', value: 'button'},
						{attribute: 'id', value: id},
						{attribute: 'aria-label', value: label},
						{attribute: 'aria-current', value: active ? 'true' : null}
					])('should have "$value" as "$attribute" attribute', async ({attribute, value}) => {
						expect(await button.getAttribute(attribute)).toBe(value);
					});

					it(`should have "${text}" as text`, async () => {
						expect(await button.text()).toEqual(text);
					});

					describe('on click', () => {
						beforeEach(() => {
							jest.spyOn(component, 'changeLanguage');
							button.click();
						});

						it('should call changeLanguage once', () => {
							expect(component.changeLanguage).toHaveBeenCalledTimes(1);
						});

						it(`should call changeLanguage with "${lang}"`, () => {
							expect(component.changeLanguage).toHaveBeenCalledWith(lang);
						});
					});
				});
			});
		});
	});
});
