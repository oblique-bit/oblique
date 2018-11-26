import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {EventEmitter} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Subject} from 'rxjs';

import {MasterLayoutConfig, MasterLayoutService} from 'oblique-reactive';
import {MasterLayoutFooterComponent} from './master-layout-footer.component';
import {MockTranslatePipe} from 'tests';

describe('MasterLayoutFooterComponent', () => {
	let component: MasterLayoutFooterComponent;
	let fixture: ComponentFixture<MasterLayoutFooterComponent>;

	const mockTranslateService = jasmine.createSpyObj('TranslateService', ['setDefaultLang', 'use', 'getDefaultLang']);
	mockTranslateService.onLangChange = new EventEmitter();
	const mockConfig = jasmine.createSpyObj('MasterLayoutConfig', ['']);
	mockConfig.footer = {};
	const mockService = jasmine.createSpyObj('MasterLayoutService', ['']);
	mockService.footerSmallChanged = new Subject<boolean>();
	mockService.footerCustomChanged = new Subject<boolean>();

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [RouterTestingModule],
			declarations: [MasterLayoutFooterComponent, MockTranslatePipe],
			providers: [
				{provide: MasterLayoutService, useValue: mockService},
				{provide: TranslateService, useValue: mockTranslateService},
				{provide: MasterLayoutConfig, useValue: mockConfig}
			]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(MasterLayoutFooterComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
