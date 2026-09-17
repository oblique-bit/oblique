import {ChipsCodeExamplesComponent} from './chips-code-examples.component';
import {type ComponentFixture, TestBed} from '@angular/core/testing';

describe(ChipsCodeExamplesComponent.name, () => {
	let component: ChipsCodeExamplesComponent;
	let fixture: ComponentFixture<ChipsCodeExamplesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({}).compileComponents();

		fixture = TestBed.createComponent(ChipsCodeExamplesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
