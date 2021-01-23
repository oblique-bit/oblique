import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {ObCollapseSampleComponent} from './collapse-sample.component';

describe('ObCollapseSampleComponent', () => {
	let component: ObCollapseSampleComponent;
	let fixture: ComponentFixture<ObCollapseSampleComponent>;

	beforeEach(
		waitForAsync(() => {
			TestBed.configureTestingModule({
				declarations: [ObCollapseSampleComponent]
			}).compileComponents();
		})
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(ObCollapseSampleComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
