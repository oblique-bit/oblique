import {CommonModule} from '@angular/common';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {ObStickyComponent} from '@oblique/oblique';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {StickyCodeExamplesComponent} from './sticky-code-examples.component';

describe(StickyCodeExamplesComponent.name, () => {
	let component: StickyCodeExamplesComponent;
	let fixture: ComponentFixture<StickyCodeExamplesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [StickyCodeExamplesComponent, CommonModule, IdPipe, CodeExampleComponent]
		}).compileComponents();

		fixture = TestBed.createComponent(StickyCodeExamplesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	test('that creation works', () => {
		expect(component).toBeTruthy();
	});

	test(`that there are 2 ${CodeExampleComponent.name}s`, () => {
		expect(fixture.debugElement.queryAll(By.directive(CodeExampleComponent)).length).toBe(2);
	});

	test(`that there are 2 ${ObStickyComponent.name}s`, () => {
		expect(fixture.debugElement.queryAll(By.directive(ObStickyComponent)).length).toBe(3);
	});

	test(`that there is 1 element with headersize="sm"`, () => {
		const stickyElement = fixture.debugElement.query(By.css('[headersize="sm"]'));
		expect(stickyElement).toBeTruthy();
	});

	test(`that there is 1 element with headersize="md"`, () => {
		const stickyElement = fixture.debugElement.query(By.css('[headersize="md"]'));
		expect(stickyElement).toBeTruthy();
	});

	test(`that there is 1 element with headersize="lg"`, () => {
		const stickyElement = fixture.debugElement.query(By.css('[headersize="lg"]'));
		expect(stickyElement).toBeTruthy();
	});
});
