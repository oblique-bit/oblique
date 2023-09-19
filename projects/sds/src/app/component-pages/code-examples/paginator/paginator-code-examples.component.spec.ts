import {ComponentFixture, TestBed} from '@angular/core/testing';
import {PaginatorCodeExamplesComponent} from './paginator-code-examples.component';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {By} from '@angular/platform-browser';
import {MatPaginator} from '@angular/material/paginator';

describe(PaginatorCodeExamplesComponent.name, () => {
	let fixture: ComponentFixture<PaginatorCodeExamplesComponent>;
	let component: PaginatorCodeExamplesComponent;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [PaginatorCodeExamplesComponent, NoopAnimationsModule]
		}).compileComponents();

		fixture = TestBed.createComponent(PaginatorCodeExamplesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	test('that creation works', () => {
		expect(component).toBeTruthy();
	});

	test(`that there are 2 ${CodeExampleComponent.name}s`, () => {
		expect(fixture.debugElement.queryAll(By.directive(CodeExampleComponent)).length).toBe(2);
	});

	test(`that there are 13 ${MatPaginator.name}s`, () => {
		expect(fixture.debugElement.queryAll(By.directive(MatPaginator)).length).toBe(13);
	});
});
