import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CommonModule} from '@angular/common';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {SelectableCodeExamplesComponent} from './selectable-code-examples.component';
import {By} from '@angular/platform-browser';
import {ObSelectableGroupDirective, WINDOW} from '@oblique/oblique';

describe(SelectableCodeExamplesComponent.name, () => {
	let component: SelectableCodeExamplesComponent;
	let fixture: ComponentFixture<SelectableCodeExamplesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [SelectableCodeExamplesComponent, CommonModule, IdPipe, CodeExampleComponent],
			providers: [{provide: WINDOW, useValue: window}]
		}).compileComponents();

		fixture = TestBed.createComponent(SelectableCodeExamplesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	test('that creation works', () => {
		expect(component).toBeTruthy();
	});

	test(`that there are 5 ${CodeExampleComponent.name}s`, () => {
		expect(fixture.debugElement.queryAll(By.directive(CodeExampleComponent)).length).toBe(5);
	});

	test(`that there are 5 ${ObSelectableGroupDirective.name}s`, () => {
		expect(fixture.debugElement.queryAll(By.directive(ObSelectableGroupDirective)).length).toBe(5);
	});
});
