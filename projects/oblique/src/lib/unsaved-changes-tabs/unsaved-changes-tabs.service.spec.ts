import {TestBed} from '@angular/core/testing';
import {EventEmitter} from '@angular/core';
import {ControlContainer} from '@angular/forms';
import {NgbTabChangeEvent, NgbTabset} from '@ng-bootstrap/ng-bootstrap';
import {TranslateService} from '@ngx-translate/core';
import {MockTranslateService} from '../_mocks/mock-translate.service';
import {UnsavedChangesService} from 'oblique';
import {MockUnsavedChangesService} from '../unsaved-changes/mock/mock-unsaved-changes.service';
import {UnsavedChangesTabsService} from './unsaved-changes-tabs.service';

describe('UnsavedChangesTabsService', () => {
	let unsavedChangesService: UnsavedChangesService;
	let unsavedChangesTabService: UnsavedChangesTabsService;
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				UnsavedChangesTabsService,
				{provide: UnsavedChangesService, useClass: MockUnsavedChangesService},
				{provide: TranslateService, useClass: MockTranslateService}
			]
		});
		unsavedChangesService = TestBed.get(UnsavedChangesService);
		unsavedChangesTabService = TestBed.get(UnsavedChangesTabsService);
	});

	describe('listenTo()', () => {
		let evtEmitter: EventEmitter<NgbTabChangeEvent>;
		let evt: NgbTabChangeEvent;
		let tabSet: NgbTabset;

		beforeEach(() => {
			spyOn(unsavedChangesService, 'watch');
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
				spyOn(unsavedChangesService, 'ignoreChanges').and.returnValue(true);
				unsavedChangesTabService.listenTo(tabSet);
				tabSet.select('tab_2');
			});

			it('shouldn\'t call unsavedChangesService.watch', () => {
				expect(unsavedChangesService.watch).not.toHaveBeenCalled();
			});

			it('should call unsavedChangesService.ignoreChanges', () => {
				expect(unsavedChangesService.ignoreChanges).toHaveBeenCalledWith(['tab_1']);
			});

			it('should\'t prevent default', () => {
				expect(evt.preventDefault).not.toHaveBeenCalled();
			});
		});

		describe('with no dirty form', () => {
			beforeEach(() => {
				spyOn(unsavedChangesService, 'ignoreChanges').and.returnValue(true);
				unsavedChangesTabService.watch('tab_1', {} as ControlContainer);
				unsavedChangesTabService.listenTo(tabSet);
				tabSet.select('tab_2');
			});

			it('should call unsavedChangesService.watch', () => {
				expect(unsavedChangesService.watch).toHaveBeenCalled();
			});

			it('should call unsavedChangesService.ignoreChanges', () => {
				expect(unsavedChangesService.ignoreChanges).toHaveBeenCalledWith(['tab_1']);
			});

			it('should\'t prevent default', () => {
				expect(evt.preventDefault).not.toHaveBeenCalled();
			});
		});

		describe('with dirty form', () => {
			beforeEach(() => {
				spyOn(unsavedChangesService, 'ignoreChanges').and.returnValue(false);
				unsavedChangesTabService.watch('tab_1', {} as ControlContainer);
				unsavedChangesTabService.listenTo(tabSet);
				tabSet.select('tab_2');
			});

			it('should call unsavedChangesService.watch', () => {
				expect(unsavedChangesService.watch).toHaveBeenCalled();
			});

			it('should call unsavedChangesService.ignoreChanges', () => {
				expect(unsavedChangesService.ignoreChanges).toHaveBeenCalledWith(['tab_1']);
			});

			it('should prevent default', () => {
				expect(evt.preventDefault).toHaveBeenCalled();
			});
		});

		describe('unListenTo()', () => {
			beforeEach(() => {
				spyOn(unsavedChangesService, 'ignoreChanges').and.returnValue(false);
				unsavedChangesTabService.watch('tab_1', {} as ControlContainer);
				unsavedChangesTabService.listenTo(tabSet);
				unsavedChangesTabService.unListenTo(tabSet);
				tabSet.select('tab_2');
			});

			it('should call unsavedChangesService.watch', () => {
				expect(unsavedChangesService.watch).toHaveBeenCalled();
			});

			it('shouldn\'t call unsavedChangesService.ignoreChanges', () => {
				expect(unsavedChangesService.ignoreChanges).not.toHaveBeenCalled();
			});

			it('shouldn\'t prevent default', () => {
				expect(evt.preventDefault).not.toHaveBeenCalled();
			});
		});
	});
});
