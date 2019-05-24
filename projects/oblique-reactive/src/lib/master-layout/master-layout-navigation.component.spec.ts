import {EventEmitter} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {TranslateService} from '@ngx-translate/core';
import {of, Subject} from 'rxjs';

import {MasterLayoutConfig, MasterLayoutService} from 'oblique-reactive';
import {MasterLayoutNavigationComponent} from './master-layout-navigation.component';
import {MasterLayoutNavigationService} from './master-layout-navigation.service';
import {MockTranslatePipe} from 'tests';

describe('MasterLayoutNavigationComponent', () => {
	let component: MasterLayoutNavigationComponent;
	let fixture: ComponentFixture<MasterLayoutNavigationComponent>;
	const mockTranslateService = jasmine.createSpyObj('TranslateService', ['setDefaultLang', 'use', 'onLangChange', 'getTranslation']);
	mockTranslateService.onLangChange = new EventEmitter();
	mockTranslateService.getTranslation.and.returnValue(of());
	mockTranslateService.defaultLang = '';
	const mockService = jasmine.createSpyObj('MasterLayoutService', ['']);
	mockService.navigationFullWidthChanged = new Subject<boolean>();
	mockService.navigationScrollableChanged = new Subject<boolean>();
	const mockConfig = jasmine.createSpyObj('MasterLayoutConfig', ['']);
	mockConfig.navigation = {links: []};
	const mockNavService = jasmine.createSpyObj('MasterLayoutNavigationService', ['']);
	mockNavService.refreshed = of();
	mockNavService.scrolledRight = of();
	mockNavService.scrolledLeft = of();

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
