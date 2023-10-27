import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {ChipsCodeExamplesComponent} from './chips-code-examples.component';
import {ComponentFixture, TestBed} from '@angular/core/testing';

describe(`${ChipsCodeExamplesComponent.name}`, () => {
	let component: ChipsCodeExamplesComponent;
	let fixture: ComponentFixture<ChipsCodeExamplesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({imports: [NoopAnimationsModule]}).compileComponents();

		fixture = TestBed.createComponent(ChipsCodeExamplesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
