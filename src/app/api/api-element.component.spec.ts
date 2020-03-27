import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ObApiElementComponent} from './api-element.component';

describe('ApiElementComponent', () => {
	let component: ObApiElementComponent;
	let fixture: ComponentFixture<ObApiElementComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ObApiElementComponent]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ObApiElementComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
