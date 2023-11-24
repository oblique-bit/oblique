import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';

import {ObUnknownRouteComponent} from './unknown-route.component';
import {TranslateService} from '@ngx-translate/core';
import {ObMockTranslateService} from '../_mocks/mock-translate.service';
describe('UnknownRouteComponent', () => {
	let component: ObUnknownRouteComponent;
	let fixture: ComponentFixture<ObUnknownRouteComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			imports: [ObUnknownRouteComponent, RouterTestingModule],
			providers: [{provide: TranslateService, useClass: ObMockTranslateService}]
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
