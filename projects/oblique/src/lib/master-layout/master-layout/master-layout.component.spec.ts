import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

import {ObMasterLayoutComponent, ObMasterLayoutConfig, ObMasterLayoutService} from 'oblique';
import {ObMockTranslatePipe} from '../../_mocks/mock-translate.pipe';
import {ObMockMasterLayoutConfig, ObMockMasterLayoutService} from '../mock/mock-master-layout.module';
import {ObMockTranslateService} from '../../_mocks/mock-translate.service';
import {windowProvider, WINDOW} from '../../utilities';

describe('MasterLayoutComponent', () => {
	let component: ObMasterLayoutComponent;
	let fixture: ComponentFixture<ObMasterLayoutComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [RouterTestingModule],
			declarations: [ObMasterLayoutComponent, ObMockTranslatePipe],
			providers: [
				{provide: ObMasterLayoutService, useClass: ObMockMasterLayoutService},
				{provide: ObMasterLayoutConfig, useClass: ObMockMasterLayoutConfig},
				{provide: TranslateService, useClass: ObMockTranslateService},
				{provide: WINDOW, useClass: windowProvider}
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA]
		})
			.compileComponents();
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
