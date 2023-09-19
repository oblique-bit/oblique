import {ComponentFixture, TestBed, fakeAsync, tick, waitForAsync} from '@angular/core/testing';
import {CommonModule} from '@angular/common';
import {By} from '@angular/platform-browser';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';
import {DebugElement} from '@angular/core';
import {Subject} from 'rxjs';
import {ObMockTranslatePipe} from '../_mocks/mock-translate.pipe';
import {ObNotificationComponent} from './notification.component';
import {ObNotificationConfig} from './notification.config';
import {ObNotificationService} from './notification.service';
import {ObENotificationType, ObINotification} from './notification.model';
import {ObMockNotificationConfig} from './_mocks/mock-notification.config';
import {ObMockNotificationService} from './_mocks/mock-notification.service';
import {ObMockAlertComponent} from '../alert/_mocks/mock-alert.component';
import {WINDOW} from '../utilities';

describe('NotificationComponent', () => {
	let component: ObNotificationComponent;
	let fixture: ComponentFixture<ObNotificationComponent>;
	let notificationConfig: ObNotificationConfig;
	let notificationService: ObNotificationService;

	const message = 'myMessage';
	const title = 'myTitle';

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [ObNotificationComponent],
			imports: [ObMockAlertComponent, ObMockTranslatePipe, CommonModule, NoopAnimationsModule, RouterTestingModule],
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
		let htmlNotifications: DebugElement[];

		beforeEach(() => {
			component.open({message: 'Notification 1', type: ObENotificationType.INFO});
			component.open({message: 'Notification 2', title: 'Title 2', type: ObENotificationType.SUCCESS});
			fixture.detectChanges();

			// Retrieve notifications form the component template view:
			htmlNotifications = fixture.debugElement.queryAll(By.css('.ob-notification'));
		});

		it('should have 2 notifications', () => {
			expect(htmlNotifications.length).toBe(2);
		});

		describe('notification should be alerts', () => {
			let alerts: DebugElement[];
			beforeEach(() => {
				alerts = fixture.debugElement.queryAll(By.directive(ObMockAlertComponent));
			});

			it('should have 2 alerts', () => {
				expect(alerts.length).toBe(2);
			});

			it('1st alert should be success', () => {
				expect(alerts[0].componentInstance.type).toEqual('success');
			});

			it('2nd alert should be undefined', () => {
				expect(alerts[1].componentInstance.type).toEqual('info');
			});
		});
	});

	describe('close button', () => {
		let closeButton: DebugElement;
		beforeEach(() => {
			component.open({message, title, sticky: true});
			fixture.detectChanges();
			closeButton = fixture.debugElement.query(By.css('button.ob-close'));
		});

		it('should be present', () => {
			expect(closeButton).toBeTruthy();
		});

		it('should have an accessible text', () => {
			expect(closeButton.query(By.css('.ob-screen-reader-only')).nativeElement.textContent).toBe('i18n.oblique.notification.close');
		});

		it('should close a notification when clicked', fakeAsync(() => {
			closeButton.triggerEventHandler('click', null);

			// Wait for animation completion:
			tick(ObNotificationComponent.REMOVE_DELAY);

			expect(component.close).toHaveBeenCalled();
			expect(component.notifications.length).toBe(0);
		}));
	});

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
		component.open({message, groupSimilar: true});
		component.open({message, groupSimilar: true});
		component.open({message, groupSimilar: true});
		fixture.detectChanges();

		expect(component.notifications.length).toBe(1);
		const htmlNotifications = fixture.debugElement.queryAll(By.css('.ob-notification'));
		expect(htmlNotifications.length).toBe(1);
	});

	it('should have multiple messages if same message is send multiple times with groupSimilar disabled', () => {
		// Send multiple notifications:
		component.open({message, groupSimilar: false});
		component.open({message, groupSimilar: false});
		component.open({message, groupSimilar: false});
		fixture.detectChanges();

		expect(component.notifications.length).toBe(3);
		const htmlNotifications = fixture.debugElement.queryAll(By.css('.ob-notification'));
		expect(htmlNotifications.length).toBe(3);
	});

	it('should close a _non-sticky_ notification after `timeout` is reached', fakeAsync(() => {
		const notification = {
			message,
			title,
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
			message,
			title,
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
