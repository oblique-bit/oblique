import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {TranslateService} from '@ngx-translate/core';

import {MasterLayoutConfig, MasterLayoutService} from 'oblique';
import {MasterLayoutFooterComponent} from './master-layout-footer.component';
import {MockTranslatePipe} from '../../_mocks/mock-translate.pipe';
import {MockTranslateService} from '../../_mocks/mock-translate.service';
import {MockMasterLayoutConfig, MockMasterLayoutService} from '../mock/mock-master-layout.module';

describe('MasterLayoutFooterComponent', () => {
	let component: MasterLayoutFooterComponent;
	let fixture: ComponentFixture<MasterLayoutFooterComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [RouterTestingModule],
			declarations: [MasterLayoutFooterComponent, MockTranslatePipe],
			providers: [
				{provide: TranslateService, useClass: MockTranslateService},
				{provide: MasterLayoutService, useClass: MockMasterLayoutService},
				{provide: MasterLayoutConfig, useClass: MockMasterLayoutConfig}
			]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(MasterLayoutFooterComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
