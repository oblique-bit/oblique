import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

import {MasterLayoutConfig, MasterLayoutService} from 'oblique';
import {MasterLayoutHeaderComponent} from './master-layout-header.component';
import {MockTranslatePipe} from '../../_mocks/mock-translate.pipe';
import {MockTranslateService} from '../../_mocks/mock-translate.service';
import {MockMasterLayoutService} from '../mock/mock-master-layout.service';
import {MockMasterLayoutConfig} from '../mock/mock-master-layout.config';
import {windowProvider, WINDOW} from '../../utilities';

describe('MasterLayoutHeaderComponent', () => {
	let component: MasterLayoutHeaderComponent;
	let fixture: ComponentFixture<MasterLayoutHeaderComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [RouterTestingModule],
			declarations: [MasterLayoutHeaderComponent, MockTranslatePipe],
			providers: [
				{provide: TranslateService, useClass: MockTranslateService},
				{provide: MasterLayoutService, useClass: MockMasterLayoutService},
				{provide: MasterLayoutConfig, useClass: MockMasterLayoutConfig},
				{provide: WINDOW, useValue: windowProvider},
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(MasterLayoutHeaderComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
