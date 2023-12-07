import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CommonModule} from '@angular/common';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {TypographyCodeExamplesComponent} from './typography-code-examples.component';
import {By} from '@angular/platform-browser';
import {TypographyExampleTypographyPreviewComponent} from './previews/typography/typography-example-typography-preview.component';

describe(TypographyCodeExamplesComponent.name, () => {
	let component: TypographyCodeExamplesComponent;
	let fixture: ComponentFixture<TypographyCodeExamplesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [TypographyCodeExamplesComponent, CommonModule, IdPipe, CodeExampleComponent]
		}).compileComponents();

		fixture = TestBed.createComponent(TypographyCodeExamplesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	test('that creation works', () => {
		expect(component).toBeTruthy();
	});

	test(`that there is 1 ${CodeExampleComponent.name}`, () => {
		expect(fixture.debugElement.queryAll(By.directive(CodeExampleComponent)).length).toBe(1);
	});

	test(`that there is 1 ${TypographyExampleTypographyPreviewComponent.name}`, () => {
		expect(fixture.debugElement.queryAll(By.directive(TypographyExampleTypographyPreviewComponent)).length).toBe(1);
	});
});
