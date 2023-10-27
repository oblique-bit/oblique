import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {StepperExampleOtherOptionsPreviewComponent} from './previews/other-options/stepper-example-other-options-preview.component';
import {StepperExampleDefaultPreviewComponent} from './previews/default/stepper-example-default-preview.component';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CommonModule} from '@angular/common';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {StepperCodeExamplesComponent} from './stepper-code-examples.component';
import {By} from '@angular/platform-browser';

describe(StepperCodeExamplesComponent.name, () => {
	let component: StepperCodeExamplesComponent;
	let fixture: ComponentFixture<StepperCodeExamplesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [StepperCodeExamplesComponent, CommonModule, IdPipe, CodeExampleComponent, NoopAnimationsModule]
		}).compileComponents();

		fixture = TestBed.createComponent(StepperCodeExamplesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	test('that creation works', () => {
		expect(component).toBeTruthy();
	});

	test(`that there are 2 ${CodeExampleComponent.name}s`, () => {
		expect(fixture.debugElement.queryAll(By.directive(CodeExampleComponent)).length).toBe(2);
	});

	test(`that there is 1 ${StepperExampleDefaultPreviewComponent.name}`, () => {
		expect(fixture.debugElement.queryAll(By.directive(StepperExampleDefaultPreviewComponent)).length).toBe(1);
	});

	test(`that there is 1 ${StepperExampleOtherOptionsPreviewComponent.name}`, () => {
		expect(fixture.debugElement.queryAll(By.directive(StepperExampleOtherOptionsPreviewComponent)).length).toBe(1);
	});
});
