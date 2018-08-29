import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {EventEmitter} from '@angular/core';
import {RouterTestingModule} from '@angular/router/testing';
import {TranslateService} from '@ngx-translate/core';

import {MasterLayoutFooterComponent} from './master-layout-footer.component';
import {MasterLayoutService} from './master-layout.service';
import {MockTranslatePipe} from '../../../../testhelpers';
import {MasterLayoutConfig} from './master-layout.config';
import {ScrollingConfig} from '../scrolling';

describe('MasterLayoutFooterComponent', () => {
	let component: MasterLayoutFooterComponent;
	let fixture: ComponentFixture<MasterLayoutFooterComponent>;

	const mockTranslateService = jasmine.createSpyObj('TranslateService', ['setDefaultLang', 'use', 'getDefaultLang']);
	mockTranslateService.onLangChange = new EventEmitter();

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [RouterTestingModule],
			declarations: [MasterLayoutFooterComponent, MockTranslatePipe],
			providers: [MasterLayoutService, {provide: TranslateService, useValue: mockTranslateService}, MasterLayoutConfig, ScrollingConfig]
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
