import {CodeExampleComponent} from './../../code-example/code-example.component';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CommonModule} from '@angular/common';
import {IdPipe} from '../../../shared/id/id.pipe';
import {WINDOW} from '@oblique/oblique';
import {By} from '@angular/platform-browser';
import {PopoverCodeExamplesComponent} from './popover-code-examples.component';
import {PopoverExampleOtherOptionsPreviewComponent} from './previews/other-options/popover-example-other-options-preview.component';
import {PopoverExampleDefaultPreviewComponent} from './previews/default/popover-example-default-preview.component';

describe(PopoverCodeExamplesComponent.name, () => {
	let component: PopoverCodeExamplesComponent;
	let fixture: ComponentFixture<PopoverCodeExamplesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [PopoverCodeExamplesComponent, CommonModule, IdPipe, CodeExampleComponent],
			providers: [{provide: WINDOW, useValue: window}]
		}).compileComponents();

		fixture = TestBed.createComponent(PopoverCodeExamplesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	test('that creation works', () => {
		expect(component).toBeTruthy();
	});

	test(`that there are 2 ${CodeExampleComponent.name}s`, () => {
		expect(fixture.debugElement.queryAll(By.directive(CodeExampleComponent)).length).toBe(2);
	});

	test(`that there is 1 ${PopoverExampleDefaultPreviewComponent.name}`, () => {
		expect(fixture.debugElement.queryAll(By.directive(PopoverExampleDefaultPreviewComponent)).length).toBe(1);
	});

	test(`that there is 1 ${PopoverExampleOtherOptionsPreviewComponent.name}`, () => {
		expect(fixture.debugElement.queryAll(By.directive(PopoverExampleOtherOptionsPreviewComponent)).length).toBe(1);
	});
});
