import {inject, TestBed} from '@angular/core/testing';
import {EventEmitter} from '@angular/core';
import {ControlContainer} from '@angular/forms';
import {NgbTabChangeEvent, NgbTabset} from '@ng-bootstrap/ng-bootstrap';
import {TranslateService} from '@ngx-translate/core';
import {UnsavedChangesTabsService} from './unsaved-changes-tabs.service';

describe('UnsavedChangesTabsService', () => {
	let unsavedChangesService: UnsavedChangesTabsService;
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				UnsavedChangesTabsService,
				{
					provide: TranslateService, useValue: {
						instant: jest.fn().mockImplementation((val) => val)
					}
				}
			]
		});
	});

	beforeEach(inject([UnsavedChangesTabsService], (service: UnsavedChangesTabsService) => {
		unsavedChangesService = service;
	}));

	describe('listenTo()', () => {
		let evtEmitter: EventEmitter<NgbTabChangeEvent>;
		let evt: NgbTabChangeEvent;
		let tabSet: NgbTabset;

		beforeEach(() => {
			evtEmitter = new EventEmitter<NgbTabChangeEvent>();
			evt = {
				activeId: 'tab_1',
				nextId: '',
				preventDefault: jest.fn()
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
				jest.spyOn(window, 'confirm').mockImplementation(() => true);
				tabSet.select('tab_2');
				expect(evt.preventDefault).not.toHaveBeenCalled();
			});

			it('should prevent default, if not confirmed', () => {
				jest.spyOn(window, 'confirm').mockImplementation(() => false);
				tabSet.select('tab_2');
				expect(evt.preventDefault).toHaveBeenCalled();
			});
		});
	});
});
