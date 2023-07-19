import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SliderCodeExamplesComponent} from './slider-code-examples.component';
import {IdPipe} from '../../../shared/id/id.pipe';

describe('SliderCodeExamplesComponent', () => {
	let component: SliderCodeExamplesComponent;
	let fixture: ComponentFixture<SliderCodeExamplesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [SliderCodeExamplesComponent, IdPipe]
		}).compileComponents();

		fixture = TestBed.createComponent(SliderCodeExamplesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
