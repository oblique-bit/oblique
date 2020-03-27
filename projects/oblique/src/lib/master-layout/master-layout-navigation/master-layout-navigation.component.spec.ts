import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {TranslateService} from '@ngx-translate/core';

import {ObMasterLayoutConfig, ObMasterLayoutService} from 'oblique';
import {ObMasterLayoutNavigationComponent} from './master-layout-navigation.component';
import {ObMockMasterLayoutService} from '../mock/mock-master-layout.service';
import {ObMockMasterLayoutConfig} from '../mock/mock-master-layout.config';
import {ObMockTranslatePipe} from '../../_mocks/mock-translate.pipe';
import {ObMockTranslateService} from '../../_mocks/mock-translate.service';

describe('MasterLayoutNavigationComponent', () => {
	let component: ObMasterLayoutNavigationComponent;
	let fixture: ComponentFixture<ObMasterLayoutNavigationComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [RouterTestingModule],
			declarations: [ObMasterLayoutNavigationComponent, ObMockTranslatePipe],
			providers: [
				{provide: TranslateService, useClass: ObMockTranslateService},
				{provide: ObMasterLayoutService, useClass: ObMockMasterLayoutService},
				{provide: ObMasterLayoutConfig, useClass: ObMockMasterLayoutConfig}
			]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ObMasterLayoutNavigationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
