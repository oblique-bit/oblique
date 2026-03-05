import {type ComponentFixture, TestBed} from '@angular/core/testing';
import {SpinnerCodeExamplesComponent} from './spinner-code-examples.component';
import {provideObliqueTestingConfiguration} from '@oblique/oblique';

describe('SpinnerCodeExamplesComponent', () => {
	let component: SpinnerCodeExamplesComponent;
	let fixture: ComponentFixture<SpinnerCodeExamplesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [SpinnerCodeExamplesComponent],
			providers: [provideObliqueTestingConfiguration()],
		}).compileComponents();

		fixture = TestBed.createComponent(SpinnerCodeExamplesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
