import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {EventEmitter} from '@angular/core';
import {RouterTestingModule} from '@angular/router/testing';
import {TranslateService} from '@ngx-translate/core';

import {MasterLayoutConfig, MasterLayoutFooterComponent, MasterLayoutService, ScrollingConfig} from 'oblique-reactive';
import {MockTranslatePipe} from 'tests';

describe('MasterLayoutFooterComponent', () => {
	let component: MasterLayoutFooterComponent;
	let fixture: ComponentFixture<MasterLayoutFooterComponent>;

	const mockTranslateService = jasmine.createSpyObj('TranslateService', ['setDefaultLang', 'use', 'getDefaultLang']);
	mockTranslateService.onLangChange = new EventEmitter();

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [RouterTestingModule],
			declarations: [MasterLayoutFooterComponent, MockTranslatePipe],
			providers: [MasterLayoutService, {
				provide: TranslateService,
				useValue: mockTranslateService
			}, MasterLayoutConfig, ScrollingConfig]
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
