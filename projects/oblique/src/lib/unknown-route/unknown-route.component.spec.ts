import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';

import {TranslateModule} from '@ngx-translate/core';
import {ObUnknownRouteComponent} from './unknown-route.component';

describe('UnknownRouteComponent', () => {
	let component: ObUnknownRouteComponent;
	let fixture: ComponentFixture<ObUnknownRouteComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			imports: [ObUnknownRouteComponent, RouterTestingModule, TranslateModule]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ObUnknownRouteComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
