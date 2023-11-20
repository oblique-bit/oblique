import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CommonModule} from '@angular/common';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {GlobalEventsCodeExamplesComponent} from './global-events-code-examples.component';
import {WINDOW} from '@oblique/oblique';
import {By} from '@angular/platform-browser';

describe(GlobalEventsCodeExamplesComponent.name, () => {
	let component: GlobalEventsCodeExamplesComponent;
	let fixture: ComponentFixture<GlobalEventsCodeExamplesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [GlobalEventsCodeExamplesComponent, CommonModule, IdPipe, CodeExampleComponent],
			providers: [{provide: WINDOW, useValue: window}]
		}).compileComponents();

		fixture = TestBed.createComponent(GlobalEventsCodeExamplesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	test('should create', () => {
		expect(component).toBeTruthy();
	});

	test('that creation works', () => {
		expect(component).toBeTruthy();
	});

	test(`that there are 2 ${CodeExampleComponent.name}s`, () => {
		expect(fixture.debugElement.queryAll(By.directive(CodeExampleComponent)).length).toBe(2);
	});
});
