import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ObDropdownComponent} from './dropdown.component';

describe('DropdownComponent', () => {
	let component: ObDropdownComponent;
	let fixture: ComponentFixture<ObDropdownComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ObDropdownComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ObDropdownComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
