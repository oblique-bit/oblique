import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CommonModule} from '@angular/common';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {GridSystemCodeExamplesComponent} from './grid-system-code-examples.component';
import {By} from '@angular/platform-browser';

describe(GridSystemCodeExamplesComponent.name, () => {
	let component: GridSystemCodeExamplesComponent;
	let fixture: ComponentFixture<GridSystemCodeExamplesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [GridSystemCodeExamplesComponent, CommonModule, IdPipe, CodeExampleComponent]
		}).compileComponents();

		fixture = TestBed.createComponent(GridSystemCodeExamplesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	test('that creation works', () => {
		expect(component).toBeTruthy();
	});

	test(`that there are 2 ${CodeExampleComponent.name}s`, () => {
		expect(fixture.debugElement.queryAll(By.directive(CodeExampleComponent)).length).toBe(2);
	});

	test(`that there is 1 element with ob-grid class`, () => {
		expect(fixture.debugElement.queryAll(By.css('.ob-grid')).length).toBe(1);
	});

	test(`that there are 2 elements with ob-span-2 class`, () => {
		expect(fixture.debugElement.queryAll(By.css('.ob-span-2')).length).toBe(2);
	});

	test(`that there are 5 elements with ob-span-3 class`, () => {
		expect(fixture.debugElement.queryAll(By.css('.ob-span-3')).length).toBe(5);
	});

	test(`that there is 1 element with ob-span-5 class`, () => {
		expect(fixture.debugElement.queryAll(By.css('.ob-span-5')).length).toBe(1);
	});

	test(`that there is 1 element with ob-full class`, () => {
		expect(fixture.debugElement.queryAll(By.css('.ob-full')).length).toBe(1);
	});

	test(`that there are 2 elements with ob-half class`, () => {
		expect(fixture.debugElement.queryAll(By.css('.ob-half')).length).toBe(2);
	});

	test(`that there are 5 elements with ob-quarter class`, () => {
		expect(fixture.debugElement.queryAll(By.css('.ob-quarter')).length).toBe(5);
	});

	test(`that there is 1 element with ob-three-quarters class`, () => {
		expect(fixture.debugElement.queryAll(By.css('.ob-three-quarters')).length).toBe(1);
	});

	test(`that there are 4 elements with ob-third class`, () => {
		expect(fixture.debugElement.queryAll(By.css('.ob-third')).length).toBe(4);
	});

	test(`that there is 1 element with ob-two-thirds class`, () => {
		expect(fixture.debugElement.queryAll(By.css('.ob-two-thirds')).length).toBe(1);
	});

	test(`that there is 1 element with ob-third-flexible class`, () => {
		expect(fixture.debugElement.queryAll(By.css('.ob-third-flexible')).length).toBe(1);
	});

	test(`that there are 2 elements with ob-span-6 class`, () => {
		expect(fixture.debugElement.queryAll(By.css('.ob-span-6')).length).toBe(2);
	});

	test(`that there are 8 elements with ob-flex class`, () => {
		expect(fixture.debugElement.queryAll(By.css('.ob-flex')).length).toBe(8);
	});

	test(`that there are 2 elements with ob-grow-2 class`, () => {
		expect(fixture.debugElement.queryAll(By.css('.ob-grow-2')).length).toBe(2);
	});

	test(`that there is 1 element with ob-grow-3 class`, () => {
		expect(fixture.debugElement.queryAll(By.css('.ob-grow-3')).length).toBe(1);
	});

	test(`that there is 1 element with ob-grow-6 class`, () => {
		expect(fixture.debugElement.queryAll(By.css('.ob-grow-6')).length).toBe(1);
	});
});
