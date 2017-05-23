/* tslint:disable:no-unused-variable */

import {TestBed, async} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {NotificationService, SpinnerService} from '../../lib';
import {MockTranslatePipe} from '../../../testhelpers';
import {TranslateService} from '@ngx-translate/core';
import {NgbTooltipModule, NgbDatepickerModule} from '@ng-bootstrap/ng-bootstrap';

describe('AppComponent', () => {
	beforeEach(async(() => {
		const mockNotificationService = jasmine.createSpyObj('NotificationService', ['success']);
		const mockTranslateService = jasmine.createSpyObj('TranslateService', ['setDefaultLang', 'use']);
		TestBed.configureTestingModule({
			declarations: [
				AppComponent,
				MockTranslatePipe
			],
			imports: [
				NgbTooltipModule.forRoot(),
				NgbDatepickerModule.forRoot(),
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

