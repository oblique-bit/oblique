import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {TranslateService} from '@ngx-translate/core';

import {MasterLayoutConfig, MasterLayoutService} from 'oblique';
import {MasterLayoutNavigationComponent} from './master-layout-navigation.component';
import {MockMasterLayoutService} from '../mock/mock-master-layout.service';
import {MockMasterLayoutConfig} from '../mock/mock-master-layout.config';
import {MockTranslatePipe} from '../../_mocks/mock-translate.pipe';
import {MockTranslateService} from '../../_mocks/mock-translate.service';

describe('MasterLayoutNavigationComponent', () => {
	let component: MasterLayoutNavigationComponent;
	let fixture: ComponentFixture<MasterLayoutNavigationComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [RouterTestingModule],
			declarations: [MasterLayoutNavigationComponent, MockTranslatePipe],
			providers: [
				{provide: TranslateService, useClass: MockTranslateService},
				{provide: MasterLayoutService, useClass: MockMasterLayoutService},
				{provide: MasterLayoutConfig, useClass: MockMasterLayoutConfig}
			]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(MasterLayoutNavigationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
