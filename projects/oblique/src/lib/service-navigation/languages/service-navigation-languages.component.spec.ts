import {HarnessLoader, TestElement} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {EventEmitter} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ObMockTranslatePipe} from '../../_mocks/mock-translate.pipe';
import {ObServiceNavigationLanguagesHarness} from './service-navigation-languages.harness';
import {ObServiceNavigationLanguagesComponent} from './service-navigation-languages.component';
import {firstValueFrom} from 'rxjs';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatOptionHarness} from '@angular/material/core/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {MatSelectHarness} from '@angular/material/select/testing';

describe('ObServiceNavigationLanguagesComponent', () => {
	let component: ObServiceNavigationLanguagesComponent;
	let fixture: ComponentFixture<ObServiceNavigationLanguagesComponent>;
	let harness: ObServiceNavigationLanguagesHarness;
	let loader: HarnessLoader;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ObServiceNavigationLanguagesComponent],
			imports: [ObMockTranslatePipe, MatFormFieldModule, MatSelectModule, NoopAnimationsModule]
		}).compileComponents();

		fixture = TestBed.createComponent(ObServiceNavigationLanguagesComponent);
		component = fixture.componentInstance;
		harness = await TestbedHarnessEnvironment.harnessForFixture(fixture, ObServiceNavigationLanguagesHarness);
		loader = TestbedHarnessEnvironment.loader(fixture);
	});

	test('that creation works', () => {
		expect(component).toBeTruthy();
	});

	test.each<{chevronBefore: 'chevron-down' | 'chevron-up'; chevronAfter: 'chevron-down' | 'chevron-up'}>([
		{chevronBefore: 'chevron-down', chevronAfter: 'chevron-up'},
		{chevronBefore: 'chevron-up', chevronAfter: 'chevron-down'}
	])(
		`that chevron is changed from: $chevronBefore, to: $chevronAfter after calling ${ObServiceNavigationLanguagesComponent.prototype.changeChevron.name}`,
		({chevronBefore, chevronAfter}) => {
			component.chevron = chevronBefore;
			component.changeChevron();
			expect(component.chevron).toBe(chevronAfter);
		}
	);

	test('that it has "ob-service-navigation-languages" class', async () => {
		const host = await harness.host();
		expect(await host.hasClass('ob-service-navigation-languages')).toBe(true);
	});

	describe('languageChange', () => {
		test('that it is an EventEmitter', () => {
			expect(component.languageChange instanceof EventEmitter).toBe(true);
		});

		test('that it emits', async () => {
			const promise = firstValueFrom(component.languageChange);
			component.changeLanguage('de');
			await expect(promise).resolves.toBe('de');
		});
	});

	describe('languages', () => {
		let buttons: TestElement[];
		let select: MatSelectHarness;
		let selectOptions: MatOptionHarness[];

		beforeEach(async () => {
			buttons = await harness.getLanguageButtons();
			select = await harness.getSelect(loader);
			selectOptions = await select.getOptions();
		});

		test('that it is initialized to an empty array', () => {
			expect(component.languages).toEqual([]);
		});

		test('that it has 0 buttons', () => {
			expect(buttons.length).toBe(0);
		});

		test('that it has 0 select options', () => {
			expect(selectOptions.length).toBe(0);
		});

		describe('With some languages', () => {
			beforeEach(() => {
				component.languages = [
					{code: 'de', label: 'Deutsch'},
					{code: 'fr', label: 'Français'},
					{code: 'it', label: 'Italiano'},
					{code: 'en', label: 'English'}
				];
				fixture.detectChanges();
			});

			beforeEach(async () => {
				select = await harness.getSelect(loader);
				await select.open();
				selectOptions = await select.getOptions();
			});

			test('that it has 4 options', () => {
				expect(selectOptions.length).toBe(4);
			});

			describe.each(['', 'de', 'fr', 'it', 'en'])('with "%s" as language', language => {
				beforeEach(() => {
					if (language) {
						component.language = language;
					}
					fixture.detectChanges();
				});

				describe.each([
					{index: 0, id: 'ob-language-de-option', label: 'Deutsch', active: language === 'de', text: 'DE', lang: 'de'},
					{index: 1, id: 'ob-language-fr-option', label: 'Français', active: language === 'fr', text: 'FR', lang: 'fr'},
					{index: 2, id: 'ob-language-it-option', label: 'Italiano', active: language === 'it', text: 'IT', lang: 'it'},
					{index: 3, id: 'ob-language-en-option', label: 'English', active: language === 'en', text: 'EN', lang: 'en'}
				])('select option index: $index', ({index, id, label, active, text, lang}) => {
					let selectOption: MatOptionHarness;
					let selectOptionTestElement: TestElement;
					beforeEach(async () => {
						select = await harness.getSelect(loader);
						await select.open();
						selectOptions = await select.getOptions();
						selectOption = selectOptions[index];
						selectOptionTestElement = await selectOption.host();
					});

					test.each([{className: 'ob-active', value: active}])('that it has "$className" class: $value', async ({className, value}) => {
						expect(await selectOptionTestElement.hasClass(className)).toBe(value);
					});

					test.each([
						{attribute: 'id', value: id},
						{attribute: 'aria-label', value: label},
						{attribute: 'aria-current', value: active ? 'true' : null},
						{attribute: 'lang', value: lang}
					])('that it has "$value" as "$attribute" attribute', async ({attribute, value}) => {
						expect(await selectOptionTestElement.getAttribute(attribute)).toBe(value);
					});

					test(`that it has $text as text`, async () => {
						expect(await selectOptionTestElement.text()).toEqual(text);
					});
				});
			});
		});
	});
});
