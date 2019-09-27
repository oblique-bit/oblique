import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {of} from 'rxjs';

import {MasterLayoutConfig, MasterLayoutService} from 'oblique';
import {MasterLayoutHeaderComponent} from './master-layout-header.component';
import {MockTranslatePipe, MockTranslateService} from 'tests';

describe('MasterLayoutHeaderComponent', () => {
	let component: MasterLayoutHeaderComponent;
	let fixture: ComponentFixture<MasterLayoutHeaderComponent>;

	const mockConfig = {
		header: {},
		locale: {locales: []}
	};
	const mockService = {
		header: {
			configEvents: of({})
		},
		layout: {
			configEvents: of({}),
			// isMenuOpened: false
		}
	};

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [RouterTestingModule],
			declarations: [MasterLayoutHeaderComponent, MockTranslatePipe],
			providers: [
				{provide: MasterLayoutService, useValue: mockService},
				{provide: TranslateService, useClass: MockTranslateService},
				{provide: MasterLayoutConfig, useValue: mockConfig}
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
