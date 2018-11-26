import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {CUSTOM_ELEMENTS_SCHEMA, EventEmitter} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Subject} from 'rxjs';

import {MasterLayoutConfig, MasterLayoutService} from 'oblique-reactive';
import {MasterLayoutHeaderComponent} from './master-layout-header.component';
import {MockTranslatePipe} from 'tests';

describe('MasterLayoutHeaderComponent', () => {
	let component: MasterLayoutHeaderComponent;
	let fixture: ComponentFixture<MasterLayoutHeaderComponent>;
	const mockTranslateService = jasmine.createSpyObj('TranslateService', ['setDefaultLang', 'use', 'getDefaultLang']);
	const mockConfig = jasmine.createSpyObj('MasterLayoutConfig', ['']);
	mockConfig.header = {};
	mockConfig.locale = {locales: []};
	const mockService = jasmine.createSpyObj('MasterLayoutService', ['']);
	mockService.menuCollapsedChanged = new Subject<boolean>();
	mockService.headerMediumChanged = new Subject<boolean>();
	mockService.headerAnimateChanged = new Subject<boolean>();
	mockService.headerStickyChanged = new Subject<boolean>();
	mockService.headerCustomChanged = new Subject<boolean>();

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [RouterTestingModule],
			declarations: [MasterLayoutHeaderComponent, MockTranslatePipe],
			providers: [
				{provide: MasterLayoutService, useValue: mockService},
				{provide: TranslateService, useValue: mockTranslateService},
				{provide: MasterLayoutConfig, useValue: mockConfig}
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(MasterLayoutHeaderComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
