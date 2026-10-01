import {type ComponentFixture, TestBed} from '@angular/core/testing';
import {ObButtonDirective, provideObliqueTestingConfiguration} from '@oblique/oblique';

import {By} from '@angular/platform-browser';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {CommonModule} from '@angular/common';
import {IdPipe} from '../../../shared/id/id.pipe';
import {TranslationsCodeExamplesComponent} from './translations-code-examples.component';

describe(TranslationsCodeExamplesComponent.name, () => {
	let component: TranslationsCodeExamplesComponent;
	let fixture: ComponentFixture<TranslationsCodeExamplesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [TranslationsCodeExamplesComponent, CommonModule, IdPipe, CodeExampleComponent],
			providers: [provideObliqueTestingConfiguration()],
		}).compileComponents();

		fixture = TestBed.createComponent(TranslationsCodeExamplesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	test('that creation works', () => {
		expect(component).toBeTruthy();
	});

	test(`that there are 4 ${CodeExampleComponent.name}s`, () => {
		expect(fixture.debugElement.queryAll(By.directive(CodeExampleComponent)).length).toBe(4);
	});

	test(`that there are 2 ${ObButtonDirective.name}s`, () => {
		expect(fixture.debugElement.queryAll(By.directive(ObButtonDirective)).length).toBe(2);
	});

	test(`that there are 2 links to stackblitz`, () => {
		expect(fixture.debugElement.queryAll(By.css('a[href*="stackblitz"]')).length).toBe(2);
	});

	test('that the preview demo translations match the runtime i18n file', () => {
		// eslint-disable-next-line @typescript-eslint/no-require-imports
		const previewTranslations = require('./previews/html-in-translations/en.json');
		// eslint-disable-next-line @typescript-eslint/no-require-imports
		const runtimeTranslations = require('../../../../assets/i18n/en.json');
		for (const [key, value] of Object.entries(previewTranslations)) {
			expect(runtimeTranslations[key]).toBe(value);
		}
	});
});
