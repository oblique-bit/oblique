import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';

import {ObUnknownRouteComponent} from './unknown-route.component';
import {ObMockTranslatePipe} from '../_mocks/mock-translate.pipe';

describe('UnknownRouteComponent', () => {
	let component: ObUnknownRouteComponent;
	let fixture: ComponentFixture<ObUnknownRouteComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [ObUnknownRouteComponent, ObMockTranslatePipe],
			imports: [RouterTestingModule]
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
