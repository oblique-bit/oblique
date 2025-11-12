import {type ComponentFixture, TestBed} from '@angular/core/testing';
import {CommonModule} from '@angular/common';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {By} from '@angular/platform-browser';
import {TypographyExampleInlineElementsPreviewComponent} from './previews/inline-elements/typography-example-inline-elements-preview.component';
import {TypographyCodeExamplesComponent} from './typography-code-examples.component';
import {TypographyExampleHeadingsPreviewComponent} from './previews/headings/typography-example-headings-preview.component';
import {TypographyExampleMixinsPreviewComponent} from './previews/mixins/typography-example-mixins-preview.component';
import {TypographyExampleListsPreviewComponent} from './previews/lists/typography-example-lists-preview.component';

describe(TypographyCodeExamplesComponent.name, () => {
	let component: TypographyCodeExamplesComponent;
	let fixture: ComponentFixture<TypographyCodeExamplesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [TypographyCodeExamplesComponent, CommonModule, IdPipe, CodeExampleComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(TypographyCodeExamplesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	test('that creation works', () => {
		expect(component).toBeTruthy();
	});

	test(`that there is 4 ${CodeExampleComponent.name}`, () => {
		expect(fixture.debugElement.queryAll(By.directive(CodeExampleComponent)).length).toBe(5);
	});

	test(`that there is 1 ${TypographyExampleInlineElementsPreviewComponent.name}`, () => {
		expect(fixture.debugElement.queryAll(By.directive(TypographyExampleInlineElementsPreviewComponent)).length).toBe(1);
	});

	test(`that there is 1 ${TypographyExampleHeadingsPreviewComponent.name}`, () => {
		expect(fixture.debugElement.queryAll(By.directive(TypographyExampleHeadingsPreviewComponent)).length).toBe(1);
	});

	test(`that there is 1 ${TypographyExampleMixinsPreviewComponent.name}`, () => {
		expect(fixture.debugElement.queryAll(By.directive(TypographyExampleMixinsPreviewComponent)).length).toBe(1);
	});

	test(`that there is 1 ${TypographyExampleListsPreviewComponent.name}`, () => {
		expect(fixture.debugElement.queryAll(By.directive(TypographyExampleListsPreviewComponent)).length).toBe(1);
	});
});
