import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

import {ObMockTranslatePipe} from '../../_mocks/mock-translate.pipe';
import {windowProvider, WINDOW} from '../../utilities';
import {ObMockGlobalEventsService} from '../../global-events/_mocks/mock-global-events.service';
import {ObMockTranslateService} from '../../_mocks/mock-translate.service';
import {ObMasterLayoutComponent} from './master-layout.component';
import {ObGlobalEventsService} from '../../global-events/global-events.service';

describe('MasterLayoutComponent', () => {
	let component: ObMasterLayoutComponent;
	let fixture: ComponentFixture<ObMasterLayoutComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [RouterTestingModule],
			declarations: [ObMasterLayoutComponent, ObMockTranslatePipe],
			providers: [
				{provide: TranslateService, useClass: ObMockTranslateService},
				{provide: WINDOW, useClass: windowProvider},
				{provide: ObGlobalEventsService, useClass: ObMockGlobalEventsService}
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ObMasterLayoutComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
