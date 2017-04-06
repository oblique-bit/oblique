/* tslint:disable:no-unused-variable */
const project = require('../../../../project.conf.js');

import {ComponentFixture, TestBed, async} from '@angular/core/testing';

import {LayoutControlsComponent} from './controls.component';
import {MockTranslatePipe} from '../../../../testhelpers';
import {TranslateService} from '@ngx-translate/core';

describe('LayoutControls', () => {
	const mockTranslateService = jasmine.createSpyObj('TranslateService', ['setDefaultLang', 'use']);

	let component: LayoutControlsComponent;
	let fixture: ComponentFixture<LayoutControlsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			providers: [
				{provide: TranslateService, useValue: mockTranslateService},
				{provide: 'ObliqueReactive.CONFIG', useValue: project.app},
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
