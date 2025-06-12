import {type ComponentFixture, TestBed} from '@angular/core/testing';
import {CommonModule} from '@angular/common';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {SpacingCodeExamplesComponent} from './spacing-code-examples.component';
import {SpacingExampleSpacingPreviewComponent} from './previews/spacing/spacing-example-spacing-preview.component';
import {By} from '@angular/platform-browser';

describe(SpacingCodeExamplesComponent.name, () => {
	let component: SpacingCodeExamplesComponent;
	let fixture: ComponentFixture<SpacingCodeExamplesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [SpacingCodeExamplesComponent, CommonModule, IdPipe, CodeExampleComponent]
		}).compileComponents();

		fixture = TestBed.createComponent(SpacingCodeExamplesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	test('that creation works', () => {
		expect(component).toBeTruthy();
	});

	test(`that there are 1 ${CodeExampleComponent.name}s`, () => {
		expect(fixture.debugElement.queryAll(By.directive(CodeExampleComponent)).length).toBe(1);
	});

	test(`that there is 1 ${SpacingExampleSpacingPreviewComponent.name}s`, () => {
		expect(fixture.debugElement.queryAll(By.directive(SpacingExampleSpacingPreviewComponent)).length).toBe(1);
	});
});
