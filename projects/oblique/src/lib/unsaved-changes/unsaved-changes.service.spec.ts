import {inject, TestBed} from '@angular/core/testing';
import {ControlContainer} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {UnsavedChangesService} from 'oblique';
import {MockTranslateService} from '../_mocks/mock-translate.service';

describe('UnsavedChangesService', () => {
	let unsavedChangesService: UnsavedChangesService;
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				UnsavedChangesService,
				{provide: TranslateService, useClass: MockTranslateService}
			]
		});
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
		//TODO: does not work
		//expect(window.addEventListener).toHaveBeenCalledWith('beforeUnload', jasmine.any(Function));
	});

	describe('canDeactivate()', () => {
		describe('with no watched form', () => {
			it('shouldn\'t call window.confirm', () => {
				spyOn(window, 'confirm');
				unsavedChangesService.canDeactivate();
				expect(window.confirm).not.toHaveBeenCalled();
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
				spyOn(window, 'confirm');
				unsavedChangesService.canDeactivate();
				expect(window.confirm).not.toHaveBeenCalled();
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
				spyOn(window, 'confirm');
				unsavedChangesService.canDeactivate();
				expect(window.confirm).toHaveBeenCalled();
			});

			it('should return false, if not confirmed', () => {
				jest.spyOn(window, 'confirm').mockImplementation(() => false);
				expect(unsavedChangesService.canDeactivate()).toBeFalsy();
			});

			it('should return true, if confirmed', () => {
				jest.spyOn(window, 'confirm').mockImplementation(() => true);
				expect(unsavedChangesService.canDeactivate()).toBeTruthy();
			});
		});

		describe('with dirty form (unWatch)', () => {
			beforeEach(() => {
				unsavedChangesService.unWatch('tab_1');
			});

			it('should return true, if confirmed', () => {
				jest.spyOn(window, 'confirm').mockImplementation(() => true);
				expect(unsavedChangesService.canDeactivate()).toBeTruthy();
			});
		});
	});
});
