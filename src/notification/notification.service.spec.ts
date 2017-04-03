/* tslint:disable:no-unused-variable */

import {TestBed, inject, tick, fakeAsync} from '@angular/core/testing';
import {NotificationService} from './notification.service';
import {NotificationTypes} from './notification';

describe('NotificationService', () => {
	let notificationService: NotificationService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				NotificationService,
				{provide: 'notificationTimeout', useValue: 100}
			]
		});
	});

	beforeEach(inject([NotificationService], (service: NotificationService) => {
		notificationService = service;
		spyOn(notificationService, 'add').and.callThrough();
	}));

	describe('add()', () => {
		beforeEach(() => {
			spyOn(notificationService, 'remove').and.callThrough();
		});

		it('should save notification in array', () => {
			notificationService.add(NotificationTypes.DEFAULT, 'message', 'title', true);
			expect(notificationService.notifications.length).toBe(1);
		});

		it('should call remove() after notificationTimeout is reached, if the notification isn\'t sticky', fakeAsync(() => {
			const id = notificationService.add(NotificationTypes.DEFAULT, 'message', 'title', false);

			tick(150);

			expect(notificationService.remove).toHaveBeenCalled();
			expect(notificationService.remove).toHaveBeenCalledWith(id);
			expect(notificationService.notifications.length).toBe(0);
		}));

		it('shouldn\'t call remove() after notificationTimeout is reached, if the notification isn\'t sticky', fakeAsync(() => {
			const id = notificationService.add(NotificationTypes.DEFAULT, 'message', 'title', true);

			tick(150);

			expect(notificationService.remove).not.toHaveBeenCalled();
			expect(notificationService.notifications.length).toBe(1);
		}));
	});

	describe('clear()', () => {
		it('should remove all notification', () => {
			notificationService.add(NotificationTypes.DEFAULT, 'message', 'title', true);
			notificationService.add(NotificationTypes.ERROR, 'message', 'title', false);

			notificationService.clear();

			expect(notificationService.notifications.length).toBe(0);
		});
	});

	describe('remove()', () => {
		it('should remove item with matching id', () => {
			const id: number = notificationService.add(NotificationTypes.DEFAULT, 'message', 'title', true);

			notificationService.remove(id);

			expect(notificationService.notifications.length).toBe(0);
		});

		it('shouldn\'t remove item with other id', () => {
			let id: number = notificationService.add(NotificationTypes.DEFAULT, 'message', 'title', true);

			notificationService.remove(++id);

			expect(notificationService.notifications.length).toBe(1);
		});

		it('should only remove item with matching id', () => {
			const idToRemove: number = notificationService.add(NotificationTypes.DEFAULT, 'message', 'title', true);
			const idToKeep: number = notificationService.add(NotificationTypes.ERROR, 'message', 'title', true);

			notificationService.remove(idToRemove);

			expect(notificationService.notifications.length).toBe(1);
			expect(notificationService.notifications[0].id).toBe(idToKeep);
		});
	});

	describe('default()', () => {
		it('should call add with NotificationTypes.DEFAULT', () => {
			notificationService.default('message', 'title');

			expect(notificationService.add).toHaveBeenCalledWith(NotificationTypes.DEFAULT, jasmine.any(String), jasmine.any(String), jasmine.any(Boolean));
		});
	});

	describe('info()', () => {
		it('should call add with NotificationTypes.INFO', () => {
			notificationService.info('message', 'title');

			expect(notificationService.add).toHaveBeenCalledWith(NotificationTypes.INFO, jasmine.any(String), jasmine.any(String), jasmine.any(Boolean));
		});
	});

	describe('success()', () => {
		it('should call add with NotificationTypes.SUCCESS', () => {
			notificationService.success('message', 'title');

			expect(notificationService.add).toHaveBeenCalledWith(NotificationTypes.SUCCESS, jasmine.any(String), jasmine.any(String), jasmine.any(Boolean));
		});
	});

	describe('warn()', () => {
		it('should call add with NotificationTypes.WARNING', () => {
			notificationService.warn('message', 'title');

			expect(notificationService.add).toHaveBeenCalledWith(NotificationTypes.WARNING, jasmine.any(String), jasmine.any(String), jasmine.any(Boolean));
		});

		it('should be called from warning()', () => {
			spyOn(notificationService, 'warn');
			notificationService.warning('message', 'title');

			expect(notificationService.warn).toHaveBeenCalled();
		});
	});

	describe('error()', () => {
		it('should call add with NotificationTypes.ERROR', () => {
			notificationService.error('message', 'title');

			expect(notificationService.add).toHaveBeenCalledWith(NotificationTypes.ERROR, jasmine.any(String), jasmine.any(String), jasmine.any(Boolean));
		});

		it('should call add with sticky', () => {
			notificationService.error('message', 'title');

			expect(notificationService.add).toHaveBeenCalledWith(jasmine.any(Object), jasmine.any(String), jasmine.any(String), true);
		});

	});

	//TODO: more tests
});
