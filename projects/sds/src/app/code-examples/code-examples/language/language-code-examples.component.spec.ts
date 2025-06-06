import {type ComponentFixture, TestBed} from '@angular/core/testing';
import {CommonModule} from '@angular/common';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {LanguageCodeExamplesComponent} from './language-code-examples.component';
import {By} from '@angular/platform-browser';
import {LanguageExampleDefaultPreviewComponent} from './previews/default/language-example-default-preview.component';

describe(LanguageCodeExamplesComponent.name, () => {
	let component: LanguageCodeExamplesComponent;
	let fixture: ComponentFixture<LanguageCodeExamplesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [LanguageCodeExamplesComponent, CommonModule, IdPipe, CodeExampleComponent]
		}).compileComponents();

		fixture = TestBed.createComponent(LanguageCodeExamplesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	test('should create', () => {
		expect(component).toBeTruthy();
	});

	test(`that there are 1 ${CodeExampleComponent.name}s`, () => {
		expect(fixture.debugElement.queryAll(By.directive(CodeExampleComponent)).length).toBe(1);
	});

	test(`that there is 1 ${LanguageExampleDefaultPreviewComponent.name}`, () => {
		expect(fixture.debugElement.queryAll(By.directive(LanguageExampleDefaultPreviewComponent)).length).toBe(1);
	});
});
