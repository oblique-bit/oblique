import {type ComponentFixture, TestBed} from '@angular/core/testing';

import {HomePageComponent} from './home.page';
import {provideObliqueTestingConfiguration} from '@oblique/oblique';
import {TranslateModule} from '@ngx-translate/core';

describe(HomePageComponent.name, () => {
	let component: HomePageComponent;
	let fixture: ComponentFixture<HomePageComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [TranslateModule],
			declarations: [HomePageComponent],
			providers: [provideObliqueTestingConfiguration()],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(HomePageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
