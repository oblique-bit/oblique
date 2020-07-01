import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

import {ObMasterLayoutHeaderComponent} from './master-layout-header.component';
import {ObMockTranslatePipe} from '../../_mocks/mock-translate.pipe';
import {ObMockTranslateService} from '../../_mocks/mock-translate.service';
import {WINDOW, windowProvider} from '../../utilities';

describe('MasterLayoutHeaderComponent', () => {
	let component: ObMasterLayoutHeaderComponent;
	let fixture: ComponentFixture<ObMasterLayoutHeaderComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [RouterTestingModule],
			declarations: [ObMasterLayoutHeaderComponent, ObMockTranslatePipe],
			providers: [
				{provide: TranslateService, useClass: ObMockTranslateService},
				{provide: WINDOW, useValue: windowProvider}
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ObMasterLayoutHeaderComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
