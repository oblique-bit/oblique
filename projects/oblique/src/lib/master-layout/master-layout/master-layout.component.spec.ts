import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {CUSTOM_ELEMENTS_SCHEMA, EventEmitter} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

import {MockTranslatePipe} from 'tests';
import {MasterLayoutComponent, MasterLayoutConfig, MasterLayoutService} from 'oblique';
import {of} from 'rxjs';

describe('MasterLayoutComponent', () => {
	let component: MasterLayoutComponent;
	let fixture: ComponentFixture<MasterLayoutComponent>;

	const mockTranslateService = {
		setDefaultLang: jest.fn(),
		use: jest.fn(),
		getDefaultLang: jest.fn(),
		onLangChange: new EventEmitter()
	};

	const mockConfig = {layout: {}};
	const mockService = {
		layout: {
			isFixed: false,
			hasCover: false,
			isMenuOpened: false,
			hasMainNavigation: true,
			configEvents: of({})
		},
		footer: {
			isSmall: false,
			configEvents: of({})
		}
	};

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [RouterTestingModule],
			declarations: [MasterLayoutComponent, MockTranslatePipe],
			providers: [
				{provide: MasterLayoutService, useValue: mockService},
				{provide: MasterLayoutConfig, useValue: mockConfig},
				{provide: TranslateService, useValue: mockTranslateService}
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(MasterLayoutComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
