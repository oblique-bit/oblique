import {async, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {NotificationService, SpinnerService} from '../../lib';
import {AppComponent} from './app.component';
import {MockTranslatePipe} from '../../../testhelpers';

describe('AppComponent', () => {
	beforeEach(async(() => {
		const mockNotificationService = jasmine.createSpyObj('NotificationService', ['success']);
		const mockTranslateService = jasmine.createSpyObj('TranslateService', ['setDefaultLang', 'use']);
		TestBed.configureTestingModule({
			declarations: [
				AppComponent, MockTranslatePipe
			],
			imports: [
				RouterTestingModule
			],
			schemas: [
				CUSTOM_ELEMENTS_SCHEMA
			],
			providers: [
				{provide: NotificationService, useValue: mockNotificationService},
				{provide: TranslateService, useValue: mockTranslateService},
				SpinnerService
			]
		});
		TestBed.compileComponents();
	}));

	it('should create the app', () => {
		const fixture = TestBed.createComponent(AppComponent);
		const app = fixture.debugElement.componentInstance;
		expect(app).toBeTruthy();
	});
});

