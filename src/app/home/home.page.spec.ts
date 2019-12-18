/* tslint:disable:no-unused-variable */
import {ComponentFixture, TestBed, async} from '@angular/core/testing';

import {HomePageComponent} from './home.page';
import {ObliqueTestingModule} from 'oblique/lib/oblique-testing.module';

describe('HomePageComponent', () => {
	let component: HomePageComponent;
	let fixture: ComponentFixture<HomePageComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [ObliqueTestingModule],
			declarations: [HomePageComponent]
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
