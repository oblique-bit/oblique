import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ErrorMessagesSampleComponent} from './error-messages-sample.component';

describe('ErrorMessagesSampleComponent', () => {
	let component: ErrorMessagesSampleComponent;
	let fixture: ComponentFixture<ErrorMessagesSampleComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ErrorMessagesSampleComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ErrorMessagesSampleComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
