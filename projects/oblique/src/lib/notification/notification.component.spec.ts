import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {CommonModule} from '@angular/common';
import {By} from '@angular/platform-browser';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';
import {ObMockTranslatePipe} from '../_mocks/mock-translate.pipe';
import {Subject} from 'rxjs';
import {ObNotificationComponent} from './notification.component';
import {ObNotificationConfig} from './notification.config';
import {ObNotificationService} from './notification.service';
import {ObENotificationType, ObINotification} from './notification.model';
import {ObMockNotificationConfig} from './mock/mock-notification.config';
import {ObMockNotificationService} from './mock/mock-notification.service';
import {WINDOW} from '../utilities';

describe('NotificationComponent', () => {
	let component: ObNotificationComponent;
	let fixture: ComponentFixture<ObNotificationComponent>;
	let notificationConfig: ObNotificationConfig;
	let notificationService: ObNotificationService;

	const message = 'myMessage';
	const title = 'myTitle';

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ObNotificationComponent, ObMockTranslatePipe],
			imports: [CommonModule, NoopAnimationsModule, RouterTestingModule],
			providers: [
				{provide: ObNotificationConfig, useClass: ObMockNotificationConfig},
				{provide: ObNotificationService, useClass: ObMockNotificationService},
				{provide: WINDOW, useValue: window}
			]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ObNotificationComponent);
		component = fixture.componentInstance;
		notificationConfig = fixture.debugElement.injector.get(ObNotificationConfig);
		notificationService = fixture.debugElement.injector.get(ObNotificationService);
		jest.spyOn(component, 'close');
		fixture.detectChanges();
	});

	describe('should display notifications via NotificationService', () => {
		let htmlNotifications;

		beforeEach(() => {
			component.open({message: 'Notification 1'});
			component.open({message: 'Notification 2', title: 'Title 2', type: ObENotificationType.SUCCESS});
			fixture.detectChanges();

			// Retrieve notifications form the component template view:
			htmlNotifications = fixture.debugElement.queryAll(By.css('.ob-notification'));
		});

		it('', () => {
			expect(htmlNotifications.length).toBe(2);
		});

		it('with matching ObENotificationType CSS classes', () => {
			const notificationAlerts = fixture.debugElement.queryAll(By.css('.ob-notification.ob-alert'));
			expect(notificationAlerts[0].classes).toEqual(jasmine.objectContaining({'ob-alert': true}));
			expect(notificationAlerts[0].classes).toEqual(jasmine.objectContaining({'ob-alert-success': true}));
			expect(notificationAlerts[0].classes).not.toEqual(jasmine.objectContaining({'ob-alert-info': true}));
		});
	});

	it('should close a notification when clicking on `.close` button', fakeAsync(() => {
		component.open({message, title, sticky: true});
		fixture.detectChanges();

		const button = fixture.debugElement.query(By.css('button.ob-close'));
		button.triggerEventHandler('click', null);

		// Wait for animation completion:
		tick(ObNotificationComponent.REMOVE_DELAY);

		expect(component.close).toHaveBeenCalled();
		expect(component.notifications.length).toBe(0);
	}));

	it('should clear all notification', fakeAsync(() => {
		// Send multiple notifications:
		component.open({message: 'message 1'});
		component.open({message: 'message 2'});
		component.open({message: 'message 3'});
		fixture.detectChanges();

		expect(component.notifications.length).toBe(3);
		let htmlNotifications = fixture.debugElement.queryAll(By.css('.ob-notification'));
		expect(htmlNotifications.length).toBe(3);

		component.clear();
		tick(ObNotificationComponent.REMOVE_DELAY);
		fixture.detectChanges();

		expect(component.notifications.length).toBe(0);

		htmlNotifications = fixture.debugElement.queryAll(By.css('.ob-notification'));
		expect(htmlNotifications.length).toBe(0);
	}));

	it('should have only 1 message if same message is send multiple times with groupSimilar enabled', () => {
		// Send multiple notifications:
		component.open({message: message, groupSimilar: true});
		component.open({message: message, groupSimilar: true});
		component.open({message: message, groupSimilar: true});
		fixture.detectChanges();

		expect(component.notifications.length).toBe(1);
		const htmlNotifications = fixture.debugElement.queryAll(By.css('.ob-notification'));
		expect(htmlNotifications.length).toBe(1);
	});

	it('should have multiple messages if same message is send multiple times with groupSimilar disabled', () => {
		// Send multiple notifications:
		component.open({message: message, groupSimilar: false});
		component.open({message: message, groupSimilar: false});
		component.open({message: message, groupSimilar: false});
		fixture.detectChanges();

		expect(component.notifications.length).toBe(3);
		const htmlNotifications = fixture.debugElement.queryAll(By.css('.ob-notification'));
		expect(htmlNotifications.length).toBe(3);
	});

	it('should close a _non-sticky_ notification after `timeout` is reached', fakeAsync(() => {
		const notification = {
			message: message,
			title: title,
			sticky: false
		};
		component.open(notification);
		tick(2 * notificationConfig.timeout + ObNotificationComponent.REMOVE_DELAY);
		fixture.detectChanges();

		expect(component.close).toHaveBeenCalled();
		expect(component.close).toHaveBeenCalledWith(notification);
		expect(component.notifications.length).toBe(0);

		const htmlNotifications = fixture.debugElement.queryAll(By.css('.ob-notification'));
		expect(htmlNotifications.length).toBe(0);
	}));

	it('should *not* close a _sticky_ notification after `timeout` is reached', fakeAsync(() => {
		component.open({
			message: message,
			title: title,
			sticky: true
		});
		tick(notificationConfig.timeout + ObNotificationComponent.REMOVE_DELAY);
		fixture.detectChanges();

		expect(component.close).not.toHaveBeenCalled();
		expect(component.notifications.length).toBe(1);

		const htmlNotifications = fixture.debugElement.queryAll(By.css('.ob-notification'));
		expect(htmlNotifications.length).toBe(1);
	}));

	it('should display notifications from a custom channel', () => {
		component.channel = 'myChannel';

		// Send multiple notifications to different channels:
		(notificationService.events as Subject<ObINotification>).next({message: 'message 1', channel: 'testChannel'});
		(notificationService.events as Subject<ObINotification>).next({message: 'message 2', channel: 'myChannel'});
		(notificationService.events as Subject<ObINotification>).next({message: 'message 3', channel: 'anotherChanel'});
		(notificationService.events as Subject<ObINotification>).next({message: 'message 4', channel: 'myChannel'});
		(notificationService.events as Subject<ObINotification>).next({message: 'message 5', channel: 'appChannel'});
		fixture.detectChanges();

		expect(component.notifications.length).toBe(2);
	});

	it('should *not* display a notification from a different channel', () => {
		// Send multiple notifications to different channels:
		(notificationService.events as Subject<ObINotification>).next({message: 'message 1', channel: 'testChannel'});
		(notificationService.events as Subject<ObINotification>).next({message: 'message 2', channel: 'myChannel'});
		(notificationService.events as Subject<ObINotification>).next({message: 'message 3', channel: 'anotherChanel'});
		(notificationService.events as Subject<ObINotification>).next({message: 'message 4', channel: 'oblique'});
		(notificationService.events as Subject<ObINotification>).next({message: 'message 5', channel: 'appChannel'});
		fixture.detectChanges();

		expect(component.notifications.length).toBe(1);
	});
});
