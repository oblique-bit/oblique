/* tslint:disable:no-unused-variable */

import {TestBed, async} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {NotificationService, SpinnerService} from '../../src';
import {MockTranslatePipe} from '../../testhelpers';
import {TranslateService} from 'ng2-translate';

describe('AppComponent', () => {
    beforeEach(() => {
        const mockNotificationService = jasmine.createSpyObj('NotificationService', ['success']);
        const mockTranslateService = jasmine.createSpyObj('TranslateService', ['setDefaultLang', 'use']);
        TestBed.configureTestingModule({
            declarations: [
                AppComponent,
                MockTranslatePipe
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
    });

    it('should create the app', async(() => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    }));
});

