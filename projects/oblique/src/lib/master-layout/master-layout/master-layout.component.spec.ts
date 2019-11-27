import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

import {MasterLayoutComponent, MasterLayoutConfig, MasterLayoutService} from 'oblique';
import {MockTranslatePipe} from '../../_mocks/mock-translate.pipe';
import {MockMasterLayoutConfig, MockMasterLayoutService} from '../mock/mock-master-layout.module';
import {MockTranslateService} from '../../_mocks/mock-translate.service';

describe('MasterLayoutComponent', () => {
	let component: MasterLayoutComponent;
	let fixture: ComponentFixture<MasterLayoutComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [RouterTestingModule],
			declarations: [MasterLayoutComponent, MockTranslatePipe],
			providers: [
				{provide: MasterLayoutService, useClass: MockMasterLayoutService},
				{provide: MasterLayoutConfig, useClass: MockMasterLayoutConfig},
				{provide: TranslateService, useClass: MockTranslateService}
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
