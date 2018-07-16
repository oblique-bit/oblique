import {ComponentFixture, TestBed, async, fakeAsync, tick} from '@angular/core/testing';
import {CommonModule} from '@angular/common';
import {By} from '@angular/platform-browser';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {MockTranslatePipe} from '../../../../testhelpers';
import {NotificationComponent} from './notification.component';
import {NotificationService} from './notification.service';
import {Notification, NotificationType} from './notification';
import {NotificationConfig} from './notification.config';

// TODO: reenable once https://github.com/angular/angular/pull/19055 is merged
describe('NotificationComponent', () => {
	let component: NotificationComponent;
	let fixture: ComponentFixture<NotificationComponent>;
	let notificationConfig: NotificationConfig;
	let notificationService: NotificationService;

	const message = 'myMessage';
	const title = 'myTitle';

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [NotificationComponent, MockTranslatePipe],
			imports: [CommonModule, NoopAnimationsModule],
			providers: [
				NotificationConfig,
				NotificationService
			]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(NotificationComponent);
		component = fixture.componentInstance;
		notificationConfig = fixture.debugElement.injector.get(NotificationConfig);
		notificationService = fixture.debugElement.injector.get(NotificationService);
		spyOn(component, 'close').and.callThrough();
		fixture.detectChanges();
	});

	describe('should display notifications via NotificationService', () => {
		let htmlNotifications;

		beforeEach(() => {
			notificationService.send('Notification 1');
			notificationService.send('Notification 2', 'Title 2', NotificationType.SUCCESS);
			fixture.detectChanges();

			// Retrieve notifications form the component template view:
			htmlNotifications = fixture.debugElement.queryAll(By.css('.notification'));
		});

		it('', () => {
			expect(htmlNotifications.length).toBe(2);
		});

		it('with matching NotificationType CSS classes', () => {

			const notificationAlerts = fixture.debugElement.queryAll(By.css('.notification .alert'));
			expect(notificationAlerts[0].classes).toEqual(jasmine.objectContaining({alert: true}));
			expect(notificationAlerts[0].classes).toEqual(jasmine.objectContaining({'alert-success': true}));
			expect(notificationAlerts[0].classes).not.toEqual(jasmine.objectContaining({'alert-info': true}));
		});
	});

	it('should close a notification when clicking on `.close` button', fakeAsync(() => {
		notificationConfig.sticky = true;
		notificationService.error(message, title, notificationConfig);
		fixture.detectChanges();

		const button = fixture.debugElement.query(By.css('button.close'));
		button.triggerEventHandler('click', null);

		// Wait for animation completion:
		tick(NotificationComponent.ANIMATION_OUT_DURATION);

		expect(component.close).toHaveBeenCalled();
		expect(component.notifications.length).toBe(0);
	}));

	it('should clear all notification', () => {
		// Send multiple notifications:
		notificationService.send(message);
		notificationService.send(message);
		notificationService.send(message);
		fixture.detectChanges();

		expect(component.notifications.length).toBe(3);
		let htmlNotifications = fixture.debugElement.queryAll(By.css('.notification'));
		expect(htmlNotifications.length).toBe(3);

		component.clear();
		fixture.detectChanges();

		expect(component.notifications.length).toBe(0);

		htmlNotifications = fixture.debugElement.queryAll(By.css('.notification'));
		expect(htmlNotifications.length).toBe(0);
	});

	it('should close a _non-sticky_ notification after `timeout` is reached', fakeAsync(() => {
		const notification = notificationService.broadcast(
			notificationConfig.channel,
			{
				messageKey: message,
				titleKey: title,
				sticky: false
			} as Notification
		);
		tick(component.timeout + NotificationComponent.ANIMATION_OUT_DURATION);
		fixture.detectChanges();

		expect(component.close).toHaveBeenCalled();
		expect(component.close).toHaveBeenCalledWith(notification);
		expect(component.notifications.length).toBe(0);

		const htmlNotifications = fixture.debugElement.queryAll(By.css('.notification'));
		expect(htmlNotifications.length).toBe(0);
	}));


	it('should *not* close a _sticky_ notification after `timeout` is reached', fakeAsync(() => {
		notificationService.broadcast(
			notificationConfig.channel,
			{
				messageKey: message,
				titleKey: title,
				sticky: true
			} as Notification
		);
		tick(component.timeout + NotificationComponent.ANIMATION_OUT_DURATION);
		fixture.detectChanges();

		expect(component.close).not.toHaveBeenCalled();
		expect(component.notifications.length).toBe(1);

		const htmlNotifications = fixture.debugElement.queryAll(By.css('.notification'));
		expect(htmlNotifications.length).toBe(1);
	}));

	it('should display notifications from a custom channel', () => {
		component.channel = 'myChannel';

		// Send multiple notifications to different channels:
		const notification = new Notification(message);
		notificationService.broadcast('testChannel', notification);
		notificationService.broadcast('myChannel', notification);
		notificationService.broadcast('anotherChanel', notification);
		notificationService.broadcast('myChannel', notification);
		notificationService.broadcast('appChannel', notification);
		fixture.detectChanges();

		expect(component.notifications.length).toBe(2);
	});

	it('should *not* display a notification from a different channel', () => {
		// Send multiple notifications to different channels:
		const notification = new Notification(message);
		notificationService.broadcast('testChannel', notification);
		notificationService.broadcast(component.channel, notification);
		notificationService.broadcast('anotherChanel', notification);
		notificationService.broadcast(component.channel, notification);
		notificationService.broadcast('appChannel', notification);
		fixture.detectChanges();

		expect(component.notifications.length).toBe(2);
	});
});
