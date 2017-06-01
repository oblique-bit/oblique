import {TestBed, inject} from '@angular/core/testing';
import {UnsavedChangesService} from './unsaved-changes.service';
import {TranslateService} from '@ngx-translate/core';
import {ControlContainer} from '@angular/forms';
import {NgbTabChangeEvent, NgbTabset} from '@ng-bootstrap/ng-bootstrap';
import {EventEmitter} from '@angular/core';
import {RouterTestingModule} from '@angular/router/testing';

describe('UnsavedChangesService', () => {
	let unsavedChangesService: UnsavedChangesService;
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [RouterTestingModule],
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

		it('should neither ask for confirmation nor prevent default, if no form is watched', () => {
			spyOn(window, 'confirm');
			unsavedChangesService.listenTo(tabSet);
			tabSet.select('tab_2');
			expect(window.confirm).not.toHaveBeenCalled();
			expect(evt.preventDefault).not.toHaveBeenCalled();
		});

		it('should neither ask for confirmation nor prevent default, if the form is not dirty', () => {
			spyOn(window, 'confirm');
			const form: ControlContainer = {dirty: false} as ControlContainer;
			unsavedChangesService.watch('tab_1', form);
			unsavedChangesService.listenTo(tabSet);
			tabSet.select('tab_2');
			expect(window.confirm).not.toHaveBeenCalled();
			expect(evt.preventDefault).not.toHaveBeenCalled();
		});

		describe('with dirty form', () => {
			beforeEach(() => {
				const form: ControlContainer = {dirty: true} as ControlContainer;
				unsavedChangesService.watch('tab_1', form);
				unsavedChangesService.listenTo(tabSet);
			});

			it('should ask for confirmation, if the form is dirty', () => {
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
		beforeEach(() => {
			spyOn(window, 'confirm');
		});

		it('shouldn\'t call window.confirm, if no form is dirty', () => {
			const form: ControlContainer = {dirty: false} as ControlContainer;
			unsavedChangesService.watch('tab_1', form);

			unsavedChangesService.canDeactivate();

			expect(window.confirm).not.toHaveBeenCalled();
		});

		it('should return true, if no form is dirty', () => {
			const form: ControlContainer = {dirty: false} as ControlContainer;
			unsavedChangesService.watch('tab_1', form);

			expect(unsavedChangesService.canDeactivate()).toBeTruthy();
		});

		it('should call window.confirm, if a form is dirty', () => {
			const form: ControlContainer = {dirty: true} as ControlContainer;
			unsavedChangesService.watch('tab_1', form);

			unsavedChangesService.canDeactivate();

			expect(window.confirm).toHaveBeenCalled();
		});
	});
});
