import {ComponentFixture, TestBed} from '@angular/core/testing';
import {SliderCodeExamplesComponent} from './slider-code-examples.component';

describe('SliderCodeExamplesComponent', () => {
	let component: SliderCodeExamplesComponent;
	let fixture: ComponentFixture<SliderCodeExamplesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [SliderCodeExamplesComponent]
		}).compileComponents();

		fixture = TestBed.createComponent(SliderCodeExamplesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
