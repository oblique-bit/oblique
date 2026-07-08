import {TestBed, inject} from '@angular/core/testing';
import {first, take} from 'rxjs/operators';
import {ObNotificationService} from './notification.service';
import {ObENotificationType, ObINotification} from './notification.model';
import {CLEAR_NOTIFICATIONS_ON_ROUTE_CHANGE, ObNotificationConfig} from './notification.config';
import {NavigationEnd, Router, RouterModule} from '@angular/router';
import {Subject} from 'rxjs';

describe('NotificationService', () => {
	let notificationConfig: ObNotificationConfig;
	let notificationService: ObNotificationService;

	const message = 'myMessage';
	const title = 'myTitle';

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [RouterModule],
			providers: [ObNotificationConfig, ObNotificationService],
		});
	});

	beforeEach(inject(
		[ObNotificationConfig, ObNotificationService],
		(config: ObNotificationConfig, service: ObNotificationService) => {
			notificationService = service;
			notificationConfig = config;
		}
	));

	describe('send()', () => {
		let notification: ObINotification;
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
			notificationService.send(message, ObENotificationType.SUCCESS);

			expect(notification.channel).toBe('test');
			expect(notification.type).toBe(ObENotificationType.SUCCESS);
			expect(notification.message).toBe(message);
			expect(notification.title).toBe('i18n.oblique.notification.type.success');
			expect(notification.timeout).toBe(42);
			expect(notification.sticky).toBe(true);
		});

		it('should broadcast a notification with message params in the id prefix', () => {
			notificationService.send({message: 'Message with spaces', messageParams: {id: 42}}, ObENotificationType.INFO);

			expect(notification.idPrefix).toBe('notification-info-message_with_spaces_42-');
		});

		it('should use the type-specific timeout', () => {
			notificationConfig.info.timeout = 42;

			notificationService.send(message, ObENotificationType.INFO);

			expect(notification.timeout).toBe(42);
		});

		it('should use a notification-specific timeout', () => {
			notificationService.send({message, timeout: 42}, ObENotificationType.INFO);

			expect(notification.timeout).toBe(42);
		});

		it('should use notification-specific grouping', () => {
			notificationService.send({message, groupSimilar: true}, ObENotificationType.INFO);

			expect(notification.groupSimilar).toBe(true);
		});

		it('should use notification-specific stickiness', () => {
			notificationService.send({message, sticky: true}, ObENotificationType.INFO);

			expect(notification.sticky).toBe(true);
		});

		it('should use type-specific grouping', () => {
			notificationConfig.info.groupSimilar = true;

			notificationService.send(message, ObENotificationType.INFO);

			expect(notification.groupSimilar).toBe(true);
		});
	});

	describe('send()', () => {
		const notifications: ObINotification[] = [];
		const count = 5;
		beforeEach(() => {
			notificationService.events.pipe(take(count)).subscribe(event => {
				notifications.push(event);
			});
		});

		it('should broadcast multiple notification events', () => {
			for (let index = 0; index < count; index++) {
				notificationService.send(message);
			}

			expect(notifications.length).toBe(count);
		});
	});

	describe('clear()', () => {
		let notification: ObINotification;
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
		let notification: ObINotification;
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
		let notification: ObINotification;
		beforeEach(() => {
			notificationService.events.pipe(first()).subscribe(event => {
				notification = event;
			});
		});

		it('should broadcast a ObENotificationType.INFO notification event', () => {
			notificationService.info(message);

			expect(notification).toBeDefined();
			expect(notification.message).toBe(message);
			expect(notification.type).toBe(ObENotificationType.INFO);
		});
	});

	describe('success()', () => {
		let notification: ObINotification;
		beforeEach(() => {
			notificationService.events.pipe(first()).subscribe(event => {
				notification = event;
			});
		});

		it('should broadcast a ObENotificationType.SUCCESS notification event', () => {
			notificationService.success(message);

			expect(notification).toBeDefined();
			expect(notification.message).toBe(message);
			expect(notification.type).toBe(ObENotificationType.SUCCESS);
		});
	});

	describe('warning()', () => {
		let notification: ObINotification;
		beforeEach(() => {
			notificationService.events.pipe(first()).subscribe(event => {
				notification = event;
			});
		});

		it('should broadcast a ObENotificationType.WARNING notification event', () => {
			notificationService.warning(message);

			expect(notification).toBeDefined();
			expect(notification.message).toBe(message);
			expect(notification.type).toBe(ObENotificationType.WARNING);
		});
	});

	describe('error()', () => {
		let notification: ObINotification;
		beforeEach(() => {
			notificationService.events.pipe(first()).subscribe(event => {
				notification = event;
			});
		});

		it('should broadcast a ObENotificationType.ERROR notification event', () => {
			notificationService.error(message);

			expect(notification).toBeDefined();
			expect(notification.message).toBe(message);
			expect(notification.type).toBe(ObENotificationType.ERROR);
		});
	});

	describe('navigation', () => {
		let routerEvents: Subject<NavigationEnd>;
		let notification: ObINotification;

		beforeEach(() => {
			TestBed.resetTestingModule();
			routerEvents = new Subject<NavigationEnd>();
			TestBed.configureTestingModule({
				providers: [
					ObNotificationConfig,
					ObNotificationService,
					{provide: CLEAR_NOTIFICATIONS_ON_ROUTE_CHANGE, useValue: true},
					{provide: Router, useValue: {events: routerEvents}},
				],
			});
			notificationConfig = TestBed.inject(ObNotificationConfig);
			notificationService = TestBed.inject(ObNotificationService);
			notification = undefined;
			notificationService.events.pipe(first()).subscribe(event => {
				notification = event;
			});
		});

		it('should clear all notifications on navigation by default', () => {
			routerEvents.next(new NavigationEnd(1, '/test', '/test'));

			expect(notification).toBeNull();
		});

		it('should keep notifications on navigation when configured', () => {
			notificationService.clearAllOnNavigate = false;

			routerEvents.next(new NavigationEnd(1, '/test', '/test'));

			expect(notification).toBeUndefined();
		});
	});
});
