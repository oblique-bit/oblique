import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SliderCodeExamplesComponent} from './slider-code-examples.component';
import {IdModule} from '../../../shared/id/id.module';

describe('SliderCodeExamplesComponent', () => {
	let component: SliderCodeExamplesComponent;
	let fixture: ComponentFixture<SliderCodeExamplesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [SliderCodeExamplesComponent],
			imports: [IdModule]
		}).compileComponents();

		fixture = TestBed.createComponent(SliderCodeExamplesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
