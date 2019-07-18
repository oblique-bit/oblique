import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {TranslateService} from '@ngx-translate/core';
import {of} from 'rxjs';

import {MasterLayoutConfig, MasterLayoutNavigationService, MasterLayoutService} from 'oblique';
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
		navigation: {
			isFullWidth: true,
			configEvents: of({}),
			refreshed: of(),
			scrolled: of()
		}
	};
	const mockConfig = {
		navigation: {links: []}
	};

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [RouterTestingModule],
			declarations: [MasterLayoutNavigationComponent, MockTranslatePipe],
			providers: [
				{provide: TranslateService, useValue: mockTranslateService},
				{provide: MasterLayoutService, useValue: mockService},
				{provide: MasterLayoutConfig, useValue: mockConfig}
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
