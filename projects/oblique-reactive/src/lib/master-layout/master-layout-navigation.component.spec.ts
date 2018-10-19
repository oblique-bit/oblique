import {EventEmitter} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {TranslateService} from '@ngx-translate/core';

import {MasterLayoutConfig, MasterLayoutNavigationComponent, MasterLayoutService} from 'oblique-reactive';
import {MockTranslatePipe} from 'tests';

describe('MasterLayoutNavigationComponent', () => {
	let component: MasterLayoutNavigationComponent;
	let fixture: ComponentFixture<MasterLayoutNavigationComponent>;
	const mockTranslateService = jasmine.createSpyObj('TranslateService', ['setDefaultLang', 'use', 'onLangChange']);
	mockTranslateService.onLangChange = new EventEmitter();
	const mockService = jasmine.createSpyObj('MasterLayoutService', ['']);
	mockService.navigationFullWidthEmitter = new EventEmitter();
	mockService.navigationScrollableEmitter = new EventEmitter();
	const mockConfig = jasmine.createSpyObj('MasterLayoutConfig', ['']);
	mockConfig.navigation = {links: []};

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
