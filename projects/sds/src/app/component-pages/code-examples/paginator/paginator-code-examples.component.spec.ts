import {ComponentFixture, TestBed} from '@angular/core/testing';
import {PaginatorCodeExamplesComponent} from './paginator-code-examples.component';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

describe(`${PaginatorCodeExamplesComponent.name}`, () => {
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

	test('create', () => {
		expect(component).toBeTruthy();
	});
});
