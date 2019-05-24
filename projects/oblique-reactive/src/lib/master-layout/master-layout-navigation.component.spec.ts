import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {TranslateService} from '@ngx-translate/core';
import {of} from 'rxjs';

import {MasterLayoutConfig, MasterLayoutNavigationService, MasterLayoutService} from 'oblique-reactive';
import {MasterLayoutNavigationComponent} from './master-layout-navigation.component';
import {MockTranslatePipe} from 'tests';

describe('MasterLayoutNavigationComponent', () => {
	let component: MasterLayoutNavigationComponent;
	let fixture: ComponentFixture<MasterLayoutNavigationComponent>;
	const mockTranslateService =  {
		setDefaultLang: jest.fn(),
		use: jest.fn(),
		onLangChange: of(),
		getTranslation: jest.fn(),
	};
	const mockService = {
		navigationFullWidthChanged: of(),
		navigationScrollableChanged: of()
	};
	const mockConfig = {
		navigation: {links: []}
	};

	const mockNavService = {
		refreshed: of(),
		scrolledRight: of(),
		scrolledLeft: of()
	};
	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [RouterTestingModule],
			declarations: [MasterLayoutNavigationComponent, MockTranslatePipe],
			providers: [
				{provide: TranslateService, useValue: mockTranslateService},
				{provide: MasterLayoutService, useValue: mockService},
				{provide: MasterLayoutConfig, useValue: mockConfig},
				{provide: MasterLayoutNavigationService, useValue: mockNavService}
			]
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
