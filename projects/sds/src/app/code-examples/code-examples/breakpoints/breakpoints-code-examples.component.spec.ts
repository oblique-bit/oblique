import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CommonModule} from '@angular/common';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {BreakpointsCodeExamplesComponent} from './breakpoints-code-examples.component';
import {BreakpointsExampleUpPreviewComponent} from './previews/breakpoints/up/breakpoints-example-up-preview.component';
import {BreakpointsExampleDownPreviewComponent} from './previews/breakpoints/down/breakpoints-example-down-preview.component';
import {By} from '@angular/platform-browser';

describe(BreakpointsCodeExamplesComponent.name, () => {
	let component: BreakpointsCodeExamplesComponent;
	let fixture: ComponentFixture<BreakpointsCodeExamplesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [BreakpointsCodeExamplesComponent, CommonModule, IdPipe, CodeExampleComponent]
		}).compileComponents();

		fixture = TestBed.createComponent(BreakpointsCodeExamplesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	test('that creation works', () => {
		expect(component).toBeTruthy();
	});

	test(`that there are 1 ${CodeExampleComponent.name}s`, () => {
		expect(fixture.debugElement.queryAll(By.directive(CodeExampleComponent)).length).toBe(2);
	});

	test(`that there is 1 ${BreakpointsExampleUpPreviewComponent.name}s`, () => {
		expect(fixture.debugElement.queryAll(By.directive(BreakpointsExampleUpPreviewComponent)).length).toBe(1);
	});

	test(`that there is 1 ${BreakpointsExampleDownPreviewComponent.name}s`, () => {
		expect(fixture.debugElement.queryAll(By.directive(BreakpointsExampleDownPreviewComponent)).length).toBe(1);
	});
});
