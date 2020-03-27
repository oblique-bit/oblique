import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ObDescriptionComponent} from './description.component';

describe('DescriptionComponent', () => {
	let component: ObDescriptionComponent;
	let fixture: ComponentFixture<ObDescriptionComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ObDescriptionComponent]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ObDescriptionComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
