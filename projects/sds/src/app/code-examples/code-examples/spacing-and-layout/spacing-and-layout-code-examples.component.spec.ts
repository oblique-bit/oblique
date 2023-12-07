import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CommonModule} from '@angular/common';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {SpacingAndLayoutCodeExamplesComponent} from './spacing-and-layout-code-examples.component';
import {SpacingAndLayoutExampleSpacingPreviewComponent} from './previews/spacing/spacing-and-layout-example-spacing-preview.component';
import {SpacingAndLayoutExampleLayoutPreviewComponent} from './previews/layout/spacing-and-layout-example-layout-preview.component';
import {By} from '@angular/platform-browser';

describe(SpacingAndLayoutCodeExamplesComponent.name, () => {
	let component: SpacingAndLayoutCodeExamplesComponent;
	let fixture: ComponentFixture<SpacingAndLayoutCodeExamplesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [SpacingAndLayoutCodeExamplesComponent, CommonModule, IdPipe, CodeExampleComponent]
		}).compileComponents();

		fixture = TestBed.createComponent(SpacingAndLayoutCodeExamplesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	test('that creation works', () => {
		expect(component).toBeTruthy();
	});

	test(`that there are 2 ${CodeExampleComponent.name}s`, () => {
		expect(fixture.debugElement.queryAll(By.directive(CodeExampleComponent)).length).toBe(2);
	});

	test(`that there is 1 ${SpacingAndLayoutExampleSpacingPreviewComponent.name}s`, () => {
		expect(fixture.debugElement.queryAll(By.directive(SpacingAndLayoutExampleSpacingPreviewComponent)).length).toBe(1);
	});

	test(`that there is 1 ${SpacingAndLayoutExampleLayoutPreviewComponent.name}s`, () => {
		expect(fixture.debugElement.queryAll(By.directive(SpacingAndLayoutExampleLayoutPreviewComponent)).length).toBe(1);
	});
});
