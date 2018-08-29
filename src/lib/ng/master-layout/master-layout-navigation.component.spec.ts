import {EventEmitter} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {TranslateService} from '@ngx-translate/core';

import {MasterLayoutNavigationComponent} from './master-layout-navigation.component';
import {MockTranslatePipe} from '../../../../testhelpers';
import {MasterLayoutService} from './master-layout.service';
import {MasterLayoutConfig} from './master-layout.config';

describe('MasterLayoutNavigationComponent', () => {
	let component: MasterLayoutNavigationComponent;
	let fixture: ComponentFixture<MasterLayoutNavigationComponent>;
	const mockTranslateService = jasmine.createSpyObj('TranslateService', ['setDefaultLang', 'use', 'onLangChange']);
	mockTranslateService.onLangChange = new EventEmitter();

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [RouterTestingModule],
			declarations: [MasterLayoutNavigationComponent, MockTranslatePipe],
			providers: [MasterLayoutService, MasterLayoutConfig, {provide: TranslateService, useValue: mockTranslateService}]
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
