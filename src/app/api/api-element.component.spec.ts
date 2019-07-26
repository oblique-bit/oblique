import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ApiElementComponent} from './api-element.component';

describe('ApiElementComponent', () => {
	let component: ApiElementComponent;
	let fixture: ComponentFixture<ApiElementComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ApiElementComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ApiElementComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
