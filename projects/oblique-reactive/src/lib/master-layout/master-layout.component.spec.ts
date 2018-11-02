import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {CUSTOM_ELEMENTS_SCHEMA, EventEmitter} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

import {MockTranslatePipe} from 'tests';
import {MasterLayoutComponent, MasterLayoutConfig, MasterLayoutService, ScrollingConfig} from 'oblique-reactive';

describe('MasterLayoutComponent', () => {
	let component: MasterLayoutComponent;
	let fixture: ComponentFixture<MasterLayoutComponent>;

	const mockTranslateService = jasmine.createSpyObj('TranslateService', ['setDefaultLang', 'use', 'getDefaultLang']);
	mockTranslateService.onLangChange = new EventEmitter();
	const mockScrolling = jasmine.createSpyObj('ScrollingConfig', ['']);
	const mockConfig = jasmine.createSpyObj('MasterLayoutConfig', ['']);
	mockConfig.layout = {};
	const mockService = jasmine.createSpyObj('MasterLayoutService', ['']);
	mockService.menuCollapsedEmitter = new EventEmitter();
	mockService.applicationFixedEmitter = new EventEmitter();
	mockService.coverLayoutEmitter = new EventEmitter();
	mockService.noNavigationEmitter = new EventEmitter();

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [RouterTestingModule],
			declarations: [MasterLayoutComponent, MockTranslatePipe],
			providers: [
				{provide: MasterLayoutService, useValue: mockService},
				{provide: MasterLayoutConfig, useValue: mockConfig},
				{provide: ScrollingConfig, useValue: mockScrolling},
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
