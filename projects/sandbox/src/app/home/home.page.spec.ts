import {type ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {HomePageComponent} from './home.page';
import {provideObliqueTestingConfiguration} from '@oblique/oblique';
import {TranslateModule} from '@ngx-translate/core';

describe(HomePageComponent.name, () => {
	let component: HomePageComponent;
	let fixture: ComponentFixture<HomePageComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			imports: [TranslateModule],
			declarations: [HomePageComponent],
			providers: [provideObliqueTestingConfiguration()]
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
