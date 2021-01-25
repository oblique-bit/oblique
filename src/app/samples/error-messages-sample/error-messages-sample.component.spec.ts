import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ObErrorMessagesSampleComponent} from './error-messages-sample.component';

describe('ObErrorMessagesSampleComponent', () => {
	let component: ObErrorMessagesSampleComponent;
	let fixture: ComponentFixture<ObErrorMessagesSampleComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ObErrorMessagesSampleComponent]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ObErrorMessagesSampleComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
