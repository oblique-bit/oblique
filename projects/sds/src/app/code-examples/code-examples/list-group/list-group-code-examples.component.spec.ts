import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ListGroupCodeExamplesComponent} from './list-group-code-examples.component';

describe(ListGroupCodeExamplesComponent.name, () => {
	let component: ListGroupCodeExamplesComponent;
	let fixture: ComponentFixture<ListGroupCodeExamplesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ListGroupCodeExamplesComponent]
		}).compileComponents();

		fixture = TestBed.createComponent(ListGroupCodeExamplesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
