import {CodeExampleComponent} from '../../code-example/code-example.component';
import {type ComponentFixture, TestBed} from '@angular/core/testing';
import {CommonModule} from '@angular/common';
import {IdPipe} from '../../../shared/id/id.pipe';
import {WINDOW} from '@oblique/oblique';
import {By} from '@angular/platform-browser';
import {Popover12CodeExamplesComponent} from './popover12-code-examples.component';
import {Popover12ExampleEventsPreviewComponent} from './previews/events/popover12-example-events-preview.component';
import {Popover12ExampleOtherOptionsPreviewComponent} from './previews/other-options/popover12-example-other-options-preview.component';
import {Popover12ExampleDefaultPreviewComponent} from './previews/default/popover12-example-default-preview.component';

describe(Popover12CodeExamplesComponent.name, () => {
	let component: Popover12CodeExamplesComponent;
	let fixture: ComponentFixture<Popover12CodeExamplesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [Popover12CodeExamplesComponent, CommonModule, IdPipe, CodeExampleComponent],
			providers: [{provide: WINDOW, useValue: window}],
		}).compileComponents();

		fixture = TestBed.createComponent(Popover12CodeExamplesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	test('that creation works', () => {
		expect(component).toBeTruthy();
	});

	test(`that there are 3 ${CodeExampleComponent.name}s`, () => {
		expect(fixture.debugElement.queryAll(By.directive(CodeExampleComponent)).length).toBe(3);
	});

	test(`that there is 1 ${Popover12ExampleDefaultPreviewComponent.name}`, () => {
		expect(fixture.debugElement.queryAll(By.directive(Popover12ExampleDefaultPreviewComponent)).length).toBe(1);
	});

	test(`that there is 1 ${Popover12ExampleOtherOptionsPreviewComponent.name}`, () => {
		expect(fixture.debugElement.queryAll(By.directive(Popover12ExampleOtherOptionsPreviewComponent)).length).toBe(1);
	});

	test(`that there is 1 ${Popover12ExampleEventsPreviewComponent.name}`, () => {
		expect(fixture.debugElement.queryAll(By.directive(Popover12ExampleEventsPreviewComponent)).length).toBe(1);
	});
});
