import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {ApiElementComponent} from './api-element.component';

describe('ApiElementComponent', () => {
	let component: ApiElementComponent;
	let fixture: ComponentFixture<ApiElementComponent>;

	beforeEach(
		waitForAsync(() => {
			TestBed.configureTestingModule({
				declarations: [ApiElementComponent]
			}).compileComponents();
		})
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(ApiElementComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
