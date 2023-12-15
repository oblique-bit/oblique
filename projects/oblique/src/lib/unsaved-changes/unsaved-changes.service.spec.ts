import {TestBed, inject} from '@angular/core/testing';
import {ControlContainer} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {WINDOW} from '../utilities';
import {ObMockTranslateService} from '../_mocks/mock-translate.service';
import {ObUnsavedChangesService} from './unsaved-changes.service';
import {ObGlobalEventsService} from '../global-events/global-events.service';
import {Subject} from 'rxjs';

describe('UnsavedChangesService', () => {
	let unsavedChangesService: ObUnsavedChangesService;
	let globalEventsService: ObGlobalEventsService;

	const unload = new Subject();
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				ObUnsavedChangesService,
				{provide: TranslateService, useClass: ObMockTranslateService},
				{provide: ObGlobalEventsService, useValue: {beforeUnload$: unload.asObservable()}},
				{provide: WINDOW, useValue: window}
			]
		});
		globalEventsService = TestBed.inject(ObGlobalEventsService);
	});

	beforeEach(() => {
		// This prevents the opening of a confirmation dialog if the cli reloads the tests
		jest.spyOn(window, 'addEventListener');
	});

	beforeEach(inject([ObUnsavedChangesService], (service: ObUnsavedChangesService) => {
		unsavedChangesService = service;
	}));

	describe('onUnload', () => {
		describe('with no watched form', () => {
			it("shouldn't alter the beforeUnloadEvent", done => {
				globalEventsService.beforeUnload$.subscribe(event => {
					expect(event).toEqual({});
					done();
				});
				unload.next({});
			});
		});
		describe('with no dirty form', () => {
			beforeEach(() => {
				const form: ControlContainer = {dirty: false} as ControlContainer;
				unsavedChangesService.watch('tab_1', form);
			});
			it("shouldn't alter the beforeUnloadEvent", done => {
				globalEventsService.beforeUnload$.subscribe(event => {
					expect(event).toEqual({});
					done();
				});
				unload.next({});
			});
		});
		describe('with dirty form (watch)', () => {
			beforeEach(() => {
				const form: ControlContainer = {dirty: true} as ControlContainer;
				unsavedChangesService.watch('tab_1', form);
			});
			it('should alter the beforeUnloadEvent', done => {
				globalEventsService.beforeUnload$.subscribe(event => {
					expect(event).toEqual({returnValue: 'i18n.validation.unsavedChanges'});
					done();
				});
				unload.next({});
			});
		});
	});

	describe('canDeactivate()', () => {
		describe('with no watched form', () => {
			it("shouldn't call window.confirm", () => {
				jest.spyOn(window, 'confirm');
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

			it("shouldn't call window.confirm", () => {
				jest.spyOn(window, 'confirm');
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
				jest.spyOn(window, 'confirm');
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

	describe('dirty form', () => {
		describe('with isActive = false', () => {
			beforeEach(() => {
				unsavedChangesService.isActive = false;
				const form: ControlContainer = {dirty: true} as ControlContainer;
				unsavedChangesService.watch('tab_1', form);
			});

			it('should ignore changes  because of isActive = false', () => {
				expect(unsavedChangesService.ignoreChanges()).toBe(true);
			});
		});
		describe('with isActive = true', () => {
			beforeEach(() => {
				unsavedChangesService.isActive = true;
				const form: ControlContainer = {dirty: true} as ControlContainer;
				unsavedChangesService.watch('tab_1', form);
			});

			it('should NOT ignore changes', () => {
				jest.spyOn(window, 'confirm').mockImplementation(() => false);
				expect(unsavedChangesService.ignoreChanges()).toBe(false);
			});
		});
	});
});
