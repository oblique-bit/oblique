import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {HomePageComponent} from './home.page';
import {ObliqueTestingModule} from '@oblique/oblique';

describe('HomePageComponent', () => {
	let component: HomePageComponent;
	let fixture: ComponentFixture<HomePageComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			imports: [ObliqueTestingModule],
			declarations: [HomePageComponent]
		}).compileComponents();
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
