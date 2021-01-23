import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {ObApiComponent} from './api.component';

describe('ApiComponent', () => {
	let component: ObApiComponent;
	let fixture: ComponentFixture<ObApiComponent>;

	beforeEach(
		waitForAsync(() => {
			TestBed.configureTestingModule({
				declarations: [ObApiComponent]
			}).compileComponents();
		})
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(ObApiComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
