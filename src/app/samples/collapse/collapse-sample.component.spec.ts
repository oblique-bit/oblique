import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ObCollapseSampleComponent} from './collapse-sample.component';

describe('ObCollapseSampleComponent', () => {
	let component: ObCollapseSampleComponent;
	let fixture: ComponentFixture<ObCollapseSampleComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ObCollapseSampleComponent]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ObCollapseSampleComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
