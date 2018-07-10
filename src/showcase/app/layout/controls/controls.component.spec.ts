import {MasterLayoutApplicationService} from '../../../../lib';
import {ProjectConfig} from '../../../../../project.conf';

import {ComponentFixture, TestBed, async} from '@angular/core/testing';

import {LayoutControlsComponent} from './controls.component';
import {MockTranslatePipe} from '../../../../../testhelpers';
import {TranslateService} from '@ngx-translate/core';

describe('LayoutControls', () => {
	const mockTranslateService = jasmine.createSpyObj('TranslateService', ['setDefaultLang', 'use']);
	const mockLayoutApplicationService = {
		userLang: 'en',
		useLang: jasmine.createSpy('useLang')
	};

	let component: LayoutControlsComponent;
	let fixture: ComponentFixture<LayoutControlsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			providers: [
				{provide: TranslateService, useValue: mockTranslateService},
				{provide: MasterLayoutApplicationService, useValue: mockLayoutApplicationService},
				{provide: 'ObliqueReactive.CONFIG', useValue: ProjectConfig.app}
			],
			declarations: [LayoutControlsComponent, MockTranslatePipe]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(LayoutControlsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
