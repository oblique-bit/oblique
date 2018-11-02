import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {CUSTOM_ELEMENTS_SCHEMA, EventEmitter} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

import {MasterLayoutConfig, MasterLayoutHeaderComponent, MasterLayoutService, ScrollingConfig} from 'oblique-reactive';
import {MockTranslatePipe} from 'tests';

describe('MasterLayoutHeaderComponent', () => {
	let component: MasterLayoutHeaderComponent;
	let fixture: ComponentFixture<MasterLayoutHeaderComponent>;
	const mockTranslateService = jasmine.createSpyObj('TranslateService', ['setDefaultLang', 'use', 'getDefaultLang']);
	const mockScrolling = jasmine.createSpyObj('ScrollingConfig', ['']);
	mockScrolling.transitions = {};
	const mockConfig = jasmine.createSpyObj('MasterLayoutConfig', ['']);
	mockConfig.header = {};
	mockConfig.locale = {locales: []};
	const mockService = jasmine.createSpyObj('MasterLayoutService', ['']);
	mockService.menuCollapsedEmitter = new EventEmitter();
	mockService.headerMediumEmitter = new EventEmitter();
	mockService.headerAnimateEmitter = new EventEmitter();
	mockService.headerStickyEmitter = new EventEmitter();

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [RouterTestingModule],
			declarations: [MasterLayoutHeaderComponent, MockTranslatePipe],
			providers: [
				{provide: MasterLayoutService, useValue: mockService},
				{provide: TranslateService, useValue: mockTranslateService},
				{provide: ScrollingConfig, useValue: mockScrolling},
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
