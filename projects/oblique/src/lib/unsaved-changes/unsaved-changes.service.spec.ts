import {inject, TestBed} from '@angular/core/testing';
import {ControlContainer} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {ObUnsavedChangesService, WINDOW} from 'oblique';
import {ObPopUpService} from '../pop-up/pop-up.service';
import {ObMockTranslateService} from '../_mocks/mock-translate.service';
import {ObMockPopUpModule} from '../pop-up/_mock/mock-pop-up.module';
import {windowProvider} from '../utilities';

describe('UnsavedChangesService', () => {
	let unsavedChangesService: ObUnsavedChangesService;
	let popUpService: ObPopUpService;
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [ObMockPopUpModule],
			providers: [ObUnsavedChangesService, {provide: TranslateService, useClass: ObMockTranslateService}, {provide: WINDOW, useFactory: windowProvider}]
		});
		popUpService = TestBed.get(ObPopUpService);
	});

	beforeEach(() => {
		//This prevents the opening of a confirmation dialog if the cli reloads the tests
		spyOn(window, 'addEventListener');
	});

	beforeEach(inject([ObUnsavedChangesService], (service: ObUnsavedChangesService) => {
		unsavedChangesService = service;
	}));

	it('should attach beforeUnload eventListener', () => {
		expect(window.addEventListener).toHaveBeenCalled();
	});

	describe('canDeactivate()', () => {
		describe('with no watched form', () => {
			it("shouldn't call window.confirm", () => {
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

			it("shouldn't call window.confirm", () => {
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
