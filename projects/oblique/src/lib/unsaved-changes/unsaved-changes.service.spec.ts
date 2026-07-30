import {TestBed, inject} from '@angular/core/testing';
import {ControlContainer} from '@angular/forms';
import {Subject} from 'rxjs';
import {ObGlobalEventsService} from '../global-events/global-events.service';
import {provideObliqueTestingConfiguration} from '../utilities';
import {ObUnsavedChangesService} from './unsaved-changes.service';

describe('UnsavedChangesService', () => {
	let unsavedChangesService: ObUnsavedChangesService;
	let globalEventsService: ObGlobalEventsService;

	const unload = new Subject();
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				provideObliqueTestingConfiguration(),
				ObUnsavedChangesService,
				{provide: ObGlobalEventsService, useValue: {beforeUnload$: unload.asObservable()}},
			],
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
				unsavedChangesService.isActive.set(false);
				const form: ControlContainer = {dirty: true} as ControlContainer;
				unsavedChangesService.watch('tab_1', form);
			});

			it('should ignore changes  because of isActive = false', () => {
				expect(unsavedChangesService.ignoreChanges()).toBe(true);
			});
		});
		describe('with isActive = true', () => {
			beforeEach(() => {
				unsavedChangesService.isActive.set(true);
				const form: ControlContainer = {dirty: true} as ControlContainer;
				unsavedChangesService.watch('tab_1', form);
			});

			it('should NOT ignore changes', () => {
				jest.spyOn(window, 'confirm').mockImplementation(() => false);
				expect(unsavedChangesService.ignoreChanges()).toBe(false);
			});
		});
	});

	describe('with explicit formIds parameter', () => {
		beforeEach(() => {
			unsavedChangesService.unWatch('tab_1');
			unsavedChangesService.unWatch('tab_2');
			unsavedChangesService.isActive.set(true);
			const form1: ControlContainer = {dirty: true} as ControlContainer;
			const form2: ControlContainer = {dirty: false} as ControlContainer;
			unsavedChangesService.watch('tab_1', form1);
			unsavedChangesService.watch('tab_2', form2);
			jest.clearAllMocks();
		});

		it('ignoreChanges with specific dirty formId should call confirm', () => {
			jest.spyOn(window, 'confirm').mockImplementation(() => true);
			unsavedChangesService.ignoreChanges(['tab_1']);
			expect(window.confirm).toHaveBeenCalled();
		});

		it('ignoreChanges with specific clean formId should not call confirm', () => {
			jest.spyOn(window, 'confirm').mockImplementation(() => true);
			unsavedChangesService.ignoreChanges(['tab_2']);
			expect(window.confirm).not.toHaveBeenCalled();
		});

		it('hasPendingChangesFor with explicit ids should check only those forms', () => {
			unsavedChangesService.isActive.set(true);
			unsavedChangesService.unWatch('tab_1');
			unsavedChangesService.unWatch('tab_2');
			const form1: ControlContainer = {dirty: true} as ControlContainer;
			const form2: ControlContainer = {dirty: false} as ControlContainer;
			unsavedChangesService.watch('tab_1', form1);
			unsavedChangesService.watch('tab_2', form2);
			// @ts-ignore - testing private method for coverage
			expect(unsavedChangesService.hasPendingChangesFor(['tab_1'])).toBe(true);
			// @ts-ignore - testing private method for coverage
			expect(unsavedChangesService.hasPendingChangesFor(['tab_2'])).toBe(false);
			// @ts-ignore - testing private method for coverage
			expect(unsavedChangesService.hasPendingChangesFor(['tab_1', 'tab_2'])).toBe(true);
		});

		it('hasPendingChangesFor without ids should check all forms', () => {
			unsavedChangesService.isActive.set(true);
			unsavedChangesService.unWatch('tab_1');
			unsavedChangesService.unWatch('tab_2');
			const form1: ControlContainer = {dirty: true} as ControlContainer;
			const form2: ControlContainer = {dirty: false} as ControlContainer;
			unsavedChangesService.watch('tab_1', form1);
			unsavedChangesService.watch('tab_2', form2);
			// @ts-ignore - testing private method for coverage (tests fallback to Object.keys)
			expect(unsavedChangesService.hasPendingChangesFor()).toBe(true);
		});

		it('hasPendingChangesFor with undefined ids should use Object.keys fallback', () => {
			unsavedChangesService.isActive.set(true);
			unsavedChangesService.unWatch('tab_1');
			const form1: ControlContainer = {dirty: true} as ControlContainer;
			unsavedChangesService.watch('tab_1', form1);
			// @ts-ignore - testing private method for coverage (tests explicit undefined fallback to Object.keys)
			expect(unsavedChangesService.hasPendingChangesFor(undefined)).toBe(true);
		});
	});
});
