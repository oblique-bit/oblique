import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MasterLayoutComponent} from './master-layout.component';
import {MasterLayoutService} from './master-layout.service';
import {ScrollingConfig} from '../scrolling';

describe('MasterLayoutComponent', () => {
	let component: MasterLayoutComponent;
	let fixture: ComponentFixture<MasterLayoutComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [MasterLayoutComponent],
			providers: [MasterLayoutService, ScrollingConfig]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(MasterLayoutComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
