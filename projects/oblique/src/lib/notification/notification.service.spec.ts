import {RouterTestingModule} from '@angular/router/testing';
import {inject, TestBed} from '@angular/core/testing';
import {first, take} from 'rxjs/operators';
import {NotificationService} from './notification.service';
import {INotification, NotificationType} from './notification.interfaces';
import {NotificationConfig} from './notification.config';

describe('NotificationService', () => {
	let notificationConfig: NotificationConfig;
	let notificationService: NotificationService;

	const message = 'myMessage';
	const title = 'myTitle';

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [RouterTestingModule],
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
			}
		)
	);

	describe('send()', () => {
		let notification: INotification;
		beforeEach(() => {
			notificationService.events.pipe(first()).subscribe(event => {
				notification = event;
			});
		});

		it('should broadcast a notification event', () => {
			notificationService.send({message, title});

			expect(notification.channel).toBe(notificationConfig.channel);
			expect(notification.message).toBe(message);
			expect(notification.title).toBe(title);
		});

		it('should broadcast a notification with a custom NotificationConfig', () => {
			notificationConfig.channel = 'test';
			notificationConfig.timeout = 42;
			notificationConfig.sticky = true;
			notificationService.send(message, NotificationType.SUCCESS);

			expect(notification.channel).toBe('test');
			expect(notification.type).toBe(NotificationType.SUCCESS);
			expect(notification.message).toBe(message);
			expect(notification.title).toBe('i18n.oblique.notification.type.success');
			expect(notification.timeout).toBe(42);
			expect(notification.sticky).toBe(true);
		});
	});

	describe('send()', () => {
		const notifications: INotification[] = [];
		const count = 5;
		beforeEach(() => {
			notificationService.events.pipe(take(count)).subscribe(event => {
				notifications.push(event);
			});
		});

		it('should broadcast multiple notification events', () => {
			for (let i = 0; i < count; i++) {
				notificationService.send(message);
			}

			expect(notifications.length).toBe(count);
		});
	});

	describe('clear()', () => {
		let notification: INotification;
		beforeEach(() => {
			notificationService.events.pipe(first()).subscribe(event => {
				notification = event;
			});
		});

		it('should emit a `clear` NotificationEvent', () => {
			notificationService.clear();
			expect(notification).toBeDefined();
			expect(notification.message).toBeUndefined();
		});
	});

	describe('clearAll()', () => {
		let notificationEmitted = false;
		let notification: INotification;
		beforeEach(() => {
			notificationService.events.pipe(first()).subscribe(event => {
				notificationEmitted = true;
				notification = event;
			});
		});

		it('should emit a `clear all` NotificationEvent', () => {
			notificationService.clearAll();
			expect(notificationEmitted).toBeTruthy();
			expect(notification).toBeNull();
		});
	});

	describe('info()', () => {
		let notification: INotification;
		beforeEach(() => {
			notificationService.events.pipe(first()).subscribe(event => {
				notification = event;
			});
		});

		it('should broadcast a NotificationType.INFO notification event', () => {
			notificationService.info(message);

			expect(notification).toBeDefined();
			expect(notification.message).toBe(message);
			expect(notification.type).toBe(NotificationType.INFO);
		});
	});

	describe('success()', () => {
		let notification: INotification;
		beforeEach(() => {
			notificationService.events.pipe(first()).subscribe(event => {
				notification = event;
			});
		});

		it('should broadcast a NotificationType.SUCCESS notification event', () => {
			notificationService.success(message);

			expect(notification).toBeDefined();
			expect(notification.message).toBe(message);
			expect(notification.type).toBe(NotificationType.SUCCESS);
		});
	});

	describe('warning()', () => {
		let notification: INotification;
		beforeEach(() => {
			notificationService.events.pipe(first()).subscribe(event => {
				notification = event;
			});
		});

		it('should broadcast a NotificationType.WARNING notification event', () => {
			notificationService.warning(message);

			expect(notification).toBeDefined();
			expect(notification.message).toBe(message);
			expect(notification.type).toBe(NotificationType.WARNING);
		});
	});

	describe('error()', () => {
		let notification: INotification;
		beforeEach(() => {
			notificationService.events.pipe(first()).subscribe(event => {
				notification = event;
			});
		});

		it('should broadcast a NotificationType.ERROR notification event', () => {
			notificationService.error(message);

			expect(notification).toBeDefined();
			expect(notification.message).toBe(message);
			expect(notification.type).toBe(NotificationType.ERROR);
		});
	});
});
