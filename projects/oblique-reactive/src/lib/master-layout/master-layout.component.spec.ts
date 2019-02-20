import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {CUSTOM_ELEMENTS_SCHEMA, EventEmitter} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Subject} from 'rxjs';

import {MockTranslatePipe} from 'tests';
import {MasterLayoutComponent, MasterLayoutConfig, MasterLayoutService} from 'oblique-reactive';

describe('MasterLayoutComponent', () => {
	let component: MasterLayoutComponent;
	let fixture: ComponentFixture<MasterLayoutComponent>;

	const mockTranslateService = jasmine.createSpyObj('TranslateService', ['setDefaultLang', 'use', 'getDefaultLang']);
	mockTranslateService.onLangChange = new EventEmitter();
	const mockConfig = jasmine.createSpyObj('MasterLayoutConfig', ['']);
	mockConfig.layout = {};
	const mockService = jasmine.createSpyObj('MasterLayoutService', ['']);
	mockService.menuCollapsedChanged = new Subject<boolean>();
	mockService.applicationFixedChanged = new Subject<boolean>();
	mockService.coverLayoutChanged = new Subject<boolean>();
	mockService.noNavigationChanged = new Subject<boolean>();
	mockService.offCanvasChanged = new Subject<boolean>();

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
