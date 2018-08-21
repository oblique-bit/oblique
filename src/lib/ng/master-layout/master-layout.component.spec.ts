import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {CUSTOM_ELEMENTS_SCHEMA, EventEmitter} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

import {MasterLayoutComponent} from './master-layout.component';
import {MasterLayoutService} from './master-layout.service';
import {ScrollingConfig} from '../scrolling';

describe('MasterLayoutComponent', () => {
	let component: MasterLayoutComponent;
	let fixture: ComponentFixture<MasterLayoutComponent>;

	const mockTranslateService = jasmine.createSpyObj('TranslateService', ['setDefaultLang', 'use', 'getDefaultLang']);
	mockTranslateService.onLangChange = new EventEmitter();

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [RouterTestingModule],
			declarations: [MasterLayoutComponent],
			providers: [
				MasterLayoutService,
				ScrollingConfig,
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
