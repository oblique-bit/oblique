import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {NumberFormatSampleComponent} from './number-format-sample.component';

describe('NumberFormatSampleComponent', () => {
	let component: NumberFormatSampleComponent;
	let fixture: ComponentFixture<NumberFormatSampleComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [NumberFormatSampleComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(NumberFormatSampleComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
