import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {DescriptionComponent} from './description.component';

describe('DescriptionComponent', () => {
	let component: DescriptionComponent;
	let fixture: ComponentFixture<DescriptionComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [DescriptionComponent]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DescriptionComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
