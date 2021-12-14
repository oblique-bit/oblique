import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {ErrorMessagesSampleComponent} from './error-messages-sample.component';

describe('ObErrorMessagesSampleComponent', () => {
	let component: ErrorMessagesSampleComponent;
	let fixture: ComponentFixture<ErrorMessagesSampleComponent>;

	beforeEach(
		waitForAsync(() => {
			TestBed.configureTestingModule({
				declarations: [ErrorMessagesSampleComponent]
			}).compileComponents();
		})
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(ErrorMessagesSampleComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
