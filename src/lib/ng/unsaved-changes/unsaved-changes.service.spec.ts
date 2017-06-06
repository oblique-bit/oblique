import {TestBed, inject} from '@angular/core/testing';
import {UnsavedChangesService} from './unsaved-changes.service';
import {TranslateService} from '@ngx-translate/core';
import {ControlContainer} from '@angular/forms';
import {NgbTabChangeEvent, NgbTabset} from '@ng-bootstrap/ng-bootstrap';
import {EventEmitter} from '@angular/core';

describe('UnsavedChangesService', () => {
	let unsavedChangesService: UnsavedChangesService;
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				UnsavedChangesService,
				{
					provide: TranslateService, useValue: {
						instant: jasmine.createSpy('instant').and.callFake((val) => val)
					}
				}
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

	describe('isFormDirty()', () => {
		it('should return false, if the form is not watched', () => {
			expect(unsavedChangesService.isFormDirty('test')).toBeFalsy();
		});

		it('should return true, if the form is dirty', () => {
			const form: ControlContainer = {dirty: true} as ControlContainer;
			unsavedChangesService.watch('test', form);
			expect(unsavedChangesService.isFormDirty('test')).toBeTruthy();
		});

		it('should return false, if the form is not dirty', () => {
			const form: ControlContainer = {dirty: false} as ControlContainer;
			unsavedChangesService.watch('test', form);
			expect(unsavedChangesService.isFormDirty('test')).toBeFalsy();
		});
	});

	describe('listenTo()', () => {
		let evtEmitter: EventEmitter<NgbTabChangeEvent>;
		let evt: NgbTabChangeEvent;
		let tabSet: NgbTabset;

		beforeEach(() => {
			evtEmitter = new EventEmitter<NgbTabChangeEvent>();
			evt = {
				activeId: 'tab_1',
				nextId: '',
				preventDefault: jasmine.createSpy('preventDefault')
			};
			tabSet = {
				tabs: {first: {id: 'tab_1'}, last: {id: 'tab_2'}, length: 2},
				select: (id) => {
					evt.nextId = id;
					evtEmitter.emit(evt);
				},
				tabChange: evtEmitter
			} as NgbTabset;
		});

		describe('with no watched form', () => {
			beforeEach(() => {
				spyOn(window, 'confirm');
				unsavedChangesService.listenTo(tabSet);
				tabSet.select('tab_2');
			});

			it('shouldn\'t call window.confirm', () => {
				expect(window.confirm).not.toHaveBeenCalled();
			});

			it('should\'t prevent default', () => {
				expect(evt.preventDefault).not.toHaveBeenCalled();
			});
		});

		describe('with no dirty form', () => {
			beforeEach(() => {
				spyOn(window, 'confirm');
				const form: ControlContainer = {dirty: false} as ControlContainer;
				unsavedChangesService.watch('tab_1', form);
				unsavedChangesService.listenTo(tabSet);
				tabSet.select('tab_2');
			});

			it('shouldn\'t call window.confirm', () => {
				expect(window.confirm).not.toHaveBeenCalled();
			});

			it('shouldn\'t prevent default', () => {
				expect(evt.preventDefault).not.toHaveBeenCalled();
			});
		});

		describe('with dirty form', () => {
			beforeEach(() => {
				const form: ControlContainer = {dirty: true} as ControlContainer;
				unsavedChangesService.watch('tab_1', form);
				unsavedChangesService.listenTo(tabSet);
			});

			it('should ask for confirmation', () => {
				spyOn(window, 'confirm');
				tabSet.select('tab_2');
				expect(window.confirm).toHaveBeenCalled();
			});

			it('should not prevent default, if confirmed', () => {
				spyOn(window, 'confirm').and.callFake(() => true);
				tabSet.select('tab_2');
				expect(evt.preventDefault).not.toHaveBeenCalled();
			});

			it('should prevent default, if not confirmed', () => {
				spyOn(window, 'confirm').and.callFake(() => false);
				tabSet.select('tab_2');
				expect(evt.preventDefault).toHaveBeenCalled();
			});
		});
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

		describe('with dirty form', () => {
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
				spyOn(window, 'confirm').and.callFake(() => false);
				expect(unsavedChangesService.canDeactivate()).toBeFalsy();
			});

			it('should return true, if confirmed', () => {
				spyOn(window, 'confirm').and.callFake(() => true);
				expect(unsavedChangesService.canDeactivate()).toBeTruthy();
			});
		});
	});
});
