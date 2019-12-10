import {inject, TestBed} from '@angular/core/testing';
import {ControlContainer} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {UnsavedChangesService, WINDOW} from 'oblique';
import {PopUpService} from '../pop-up/pop-up.service';
import {MockTranslateService} from '../_mocks/mock-translate.service';
import {MockPopUpModule} from '../pop-up/_mock/mock-pop-up.module';
import {windowProvider} from '../utilities';

describe('UnsavedChangesService', () => {
	let unsavedChangesService: UnsavedChangesService;
	let popUpService: PopUpService;
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [MockPopUpModule],
			providers: [
				UnsavedChangesService,
				{provide: TranslateService, useClass: MockTranslateService},
				{provide: WINDOW, useFactory: windowProvider}
			]
		});
		popUpService = TestBed.get(PopUpService);
	});

	beforeEach(() => {
		//This prevents the opening of a confirmation dialog if the cli reloads the tests
		spyOn(window, 'addEventListener');
	});

	beforeEach(inject([UnsavedChangesService], (service: UnsavedChangesService) => {
		unsavedChangesService = service;
	}));

	it('should attach beforeUnload eventListener', () => {
		expect(window.addEventListener).toHaveBeenCalled();
	});

	describe('canDeactivate()', () => {
		describe('with no watched form', () => {
			it('shouldn\'t call window.confirm', () => {
				jest.spyOn(popUpService, 'confirm');
				unsavedChangesService.canDeactivate();
				expect(popUpService.confirm).not.toHaveBeenCalled();
			});

			it('should return true', () => {
				expect(unsavedChangesService.canDeactivate()).toBeTruthy();
			});
		});

		describe('with no dirty form', () => {
			beforeEach(() => {
				const form: ControlContainer = {dirty: false} as ControlContainer;
				unsavedChangesService.watch('tab_1', form);
			});

			it('shouldn\'t call window.confirm', () => {
				jest.spyOn(popUpService, 'confirm');
				unsavedChangesService.canDeactivate();
				expect(popUpService.confirm).not.toHaveBeenCalled();
			});

			it('should return true', () => {
				expect(unsavedChangesService.canDeactivate()).toBeTruthy();
			});
		});

		describe('with dirty form (watch)', () => {
			beforeEach(() => {
				const form: ControlContainer = {dirty: true} as ControlContainer;
				unsavedChangesService.watch('tab_1', form);
			});

			it('should call window.confirm', () => {
				jest.spyOn(popUpService, 'confirm');
				unsavedChangesService.canDeactivate();
				expect(popUpService.confirm).toHaveBeenCalled();
			});

			it('should return false, if not confirmed', () => {
				jest.spyOn(popUpService, 'confirm').mockImplementation(() => false);
				expect(unsavedChangesService.canDeactivate()).toBeFalsy();
			});

			it('should return true, if confirmed', () => {
				jest.spyOn(popUpService, 'confirm').mockImplementation(() => true);
				expect(unsavedChangesService.canDeactivate()).toBeTruthy();
			});
		});

		describe('with dirty form (unWatch)', () => {
			beforeEach(() => {
				unsavedChangesService.unWatch('tab_1');
			});

			it('should return true, if confirmed', () => {
				jest.spyOn(popUpService, 'confirm').mockImplementation(() => true);
				expect(unsavedChangesService.canDeactivate()).toBeTruthy();
			});
		});
	});
});
