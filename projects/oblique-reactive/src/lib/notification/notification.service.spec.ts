import {TestBed, inject} from '@angular/core/testing';
import {first, take} from 'rxjs/operators';
import {NotificationService} from './notification.service';
import {NotificationEvent, NotificationType} from './notification.interfaces';
import {NotificationConfig} from './notification.config';

describe('NotificationService', () => {
	let notificationConfig: NotificationConfig;
	let notificationService: NotificationService;

	const message = 'myMessage';
	const title = 'myTitle';

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				NotificationConfig,
				NotificationService
			]
		});
	});

	beforeEach(
		inject(
			[NotificationConfig, NotificationService],
			(config: NotificationConfig, service: NotificationService) => {
				notificationService = service;
				notificationConfig = config;
				spyOn(notificationService, 'broadcast').and.callThrough();
			}
		)
	);

	describe('send()', () => {
		let notificationEvent: NotificationEvent;
		beforeEach(() => {
			notificationService.events.pipe(first()).subscribe(event => {
				notificationEvent = event;
			});
		});

		it('should broadcast a notification event', () => {
			notificationService.send(message, title);

			expect(notificationService.broadcast).toHaveBeenCalled();
			expect(notificationEvent.channel).toBe(notificationConfig.channel);
			expect(notificationEvent.notification.messageKey).toBe(message);
			expect(notificationEvent.notification.titleKey).toBe(title);
		});

		it('should broadcast a notification with a custom NotificationConfig', () => {
			notificationConfig.channel = 'test';
			notificationConfig.timeout = 42;
			notificationConfig.sticky = true;
			notificationService.send(message, title, NotificationType.SUCCESS, notificationConfig);

			expect(notificationService.broadcast).toHaveBeenCalled();
			expect(notificationEvent.channel).toBe('test');
			expect(notificationEvent.notification.type).toBe(NotificationType.SUCCESS);
			expect(notificationEvent.notification.messageKey).toBe(message);
			expect(notificationEvent.notification.titleKey).toBe(title);
			expect(notificationEvent.notification.timeout).toBe(42);
			expect(notificationEvent.notification.sticky).toBe(true);
		});
	});

	describe('send()', () => {
		const notificationEvents: NotificationEvent[] = [];
		const count = 5;
		beforeEach(() => {
			notificationService.events.pipe(take(count)).subscribe(event => {
				notificationEvents.push(event);
			});
		});

		it('should broadcast multiple notification events', () => {
			for (let i = 0; i < count; i++) {
				notificationService.send(message, title);
			}

			expect(notificationService.broadcast).toHaveBeenCalledTimes(count);
			expect(notificationEvents.length).toBe(count);
		});
	});

	describe('clear()', () => {
		let notificationEvent: NotificationEvent;
		beforeEach(() => {
			notificationService.events.pipe(first()).subscribe(event => {
				notificationEvent = event;
			});
		});

		it('should emit a `clear` NotificationEvent', () => {
			notificationService.clear();
			expect(notificationEvent).toBeDefined();
			expect(notificationEvent.notification).toBeUndefined();
		});
	});

	describe('clearAll()', () => {
		let notificationEmitted = false;
		let notificationEvent: NotificationEvent;
		beforeEach(() => {
			notificationService.events.pipe(first()).subscribe(event => {
				notificationEmitted = true;
				notificationEvent = event;
			});
		});

		it('should emit a `clear all` NotificationEvent', () => {
			notificationService.clearAll();
			expect(notificationEmitted).toBeTruthy();
			expect(notificationEvent).toBeNull();
		});
	});

	describe('default()', () => {
		let notificationEvent: NotificationEvent;
		beforeEach(() => {
			notificationService.events.pipe(first()).subscribe(event => {
				notificationEvent = event;
			});
		});

		it('should broadcast a NotificationType.DEFAULT notification event', () => {
			notificationService.default(message, title);

			expect(notificationService.broadcast).toHaveBeenCalled();

			expect(notificationEvent).toBeDefined();
			expect(notificationEvent.notification).toBeDefined();
			expect(notificationEvent.notification.type).toBe(NotificationType.DEFAULT);
		});
	});

	describe('info()', () => {
		let notificationEvent: NotificationEvent;
		beforeEach(() => {
			notificationService.events.pipe(first()).subscribe(event => {
				notificationEvent = event;
			});
		});

		it('should broadcast a NotificationType.INFO notification event', () => {
			notificationService.info(message, title);

			expect(notificationService.broadcast).toHaveBeenCalled();

			expect(notificationEvent).toBeDefined();
			expect(notificationEvent.notification).toBeDefined();
			expect(notificationEvent.notification.type).toBe(NotificationType.INFO);
		});
	});

	describe('success()', () => {
		let notificationEvent: NotificationEvent;
		beforeEach(() => {
			notificationService.events.pipe(first()).subscribe(event => {
				notificationEvent = event;
			});
		});

		it('should broadcast a NotificationType.SUCCESS notification event', () => {
			notificationService.success(message, title);

			expect(notificationService.broadcast).toHaveBeenCalled();

			expect(notificationEvent).toBeDefined();
			expect(notificationEvent.notification).toBeDefined();
			expect(notificationEvent.notification.type).toBe(NotificationType.SUCCESS);
		});
	});

	describe('warning()', () => {
		let notificationEvent: NotificationEvent;
		beforeEach(() => {
			notificationService.events.pipe(first()).subscribe(event => {
				notificationEvent = event;
			});
		});

		it('should broadcast a NotificationType.WARNING notification event', () => {
			notificationService.warning(message, title);

			expect(notificationService.broadcast).toHaveBeenCalled();

			expect(notificationEvent).toBeDefined();
			expect(notificationEvent.notification).toBeDefined();
			expect(notificationEvent.notification.type).toBe(NotificationType.WARNING);
		});
	});

	describe('error()', () => {
		let notificationEvent: NotificationEvent;
		beforeEach(() => {
			notificationService.events.pipe(first()).subscribe(event => {
				notificationEvent = event;
			});
		});

		it('should broadcast a NotificationType.ERROR notification event', () => {
			notificationService.error(message, title);

			expect(notificationService.broadcast).toHaveBeenCalled();

			expect(notificationEvent).toBeDefined();
			expect(notificationEvent.notification).toBeDefined();
			expect(notificationEvent.notification.type).toBe(NotificationType.ERROR);
		});
	});
});
