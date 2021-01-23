import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {ObDescriptionComponent} from './description.component';

describe('DescriptionComponent', () => {
	let component: ObDescriptionComponent;
	let fixture: ComponentFixture<ObDescriptionComponent>;

	beforeEach(
		waitForAsync(() => {
			TestBed.configureTestingModule({
				declarations: [ObDescriptionComponent]
			}).compileComponents();
		})
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(ObDescriptionComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
