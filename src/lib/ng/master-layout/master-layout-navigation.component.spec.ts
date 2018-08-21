import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MasterLayoutNavigationComponent} from './master-layout-navigation.component';

describe('MasterLayoutNavigationComponent', () => {
	let component: MasterLayoutNavigationComponent;
	let fixture: ComponentFixture<MasterLayoutNavigationComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [MasterLayoutNavigationComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(MasterLayoutNavigationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
