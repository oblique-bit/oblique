/* tslint:disable:no-unused-variable */
import {ComponentFixture, TestBed, async} from '@angular/core/testing';

import {MockTranslatePipe} from '../../../../testhelpers';
import {HomePageComponent} from './home.page';

describe('HomePageComponent', () => {
	let component: HomePageComponent;
	let fixture: ComponentFixture<HomePageComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [HomePageComponent, MockTranslatePipe]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(HomePageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
