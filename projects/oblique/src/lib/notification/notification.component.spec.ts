import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {CommonModule} from '@angular/common';
import {By} from '@angular/platform-browser';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';
import {MockTranslatePipe} from 'tests';
import {NotificationComponent, NotificationConfig, NotificationService, NotificationType} from 'oblique';

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
			imports: [CommonModule, NoopAnimationsModule, RouterTestingModule],
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
		jest.spyOn(component, 'close');
		fixture.detectChanges();
	});

	describe('should display notifications via NotificationService', () => {
		let htmlNotifications;

		beforeEach(() => {
			notificationService.info('Notification 1');
			notificationService.send({message: 'Notification 2', title: 'Title 2', type: NotificationType.SUCCESS});
			fixture.detectChanges();

			// Retrieve notifications form the component template view:
			htmlNotifications = fixture.debugElement.queryAll(By.css('.notification'));
		});

		it('', () => {
			expect(htmlNotifications.length).toBe(2);
		});

		it('with matching NotificationType CSS classes', () => {
			const notificationAlerts = fixture.debugElement.queryAll(By.css('.notification.alert'));
			expect(notificationAlerts[0].classes).toEqual(jasmine.objectContaining({alert: true}));
			expect(notificationAlerts[0].classes).toEqual(jasmine.objectContaining({'alert-success': true}));
			expect(notificationAlerts[0].classes).not.toEqual(jasmine.objectContaining({'alert-info': true}));
		});
	});

	it('should close a notification when clicking on `.close` button', fakeAsync(() => {
		notificationService.error({message, title, sticky: true});
		fixture.detectChanges();

		const button = fixture.debugElement.query(By.css('button.close'));
		button.triggerEventHandler('click', null);

		// Wait for animation completion:
		tick(NotificationComponent.REMOVE_DELAY);

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
		const notification = notificationService.send({
			message: message,
			title: title,
			sticky: false
		});
		tick(notificationConfig.timeout + NotificationComponent.REMOVE_DELAY);
		fixture.detectChanges();

		expect(component.close).toHaveBeenCalled();
		expect(component.close).toHaveBeenCalledWith(notification);
		expect(component.notifications.length).toBe(0);

		const htmlNotifications = fixture.debugElement.queryAll(By.css('.notification'));
		expect(htmlNotifications.length).toBe(0);
	}));


	it('should *not* close a _sticky_ notification after `timeout` is reached', fakeAsync(() => {
		notificationService.send({
			message: message,
			title: title,
			sticky: true
		});
		tick(notificationConfig.timeout + NotificationComponent.REMOVE_DELAY);
		fixture.detectChanges();

		expect(component.close).not.toHaveBeenCalled();
		expect(component.notifications.length).toBe(1);

		const htmlNotifications = fixture.debugElement.queryAll(By.css('.notification'));
		expect(htmlNotifications.length).toBe(1);
	}));

	it('should display notifications from a custom channel', () => {
		component.channel = 'myChannel';

		// Send multiple notifications to different channels:
		notificationService.send({message, channel: 'testChannel'});
		notificationService.send({message, channel: 'myChannel'});
		notificationService.send({message, channel: 'anotherChanel'});
		notificationService.send({message, channel: 'myChannel'});
		notificationService.send({message, channel: 'appChannel'});
		fixture.detectChanges();

		expect(component.notifications.length).toBe(2);
	});

	it('should *not* display a notification from a different channel', () => {
		// Send multiple notifications to different channels:
		notificationService.send({message, channel: 'testChannel'});
		notificationService.send({message, channel: 'myChannel'});
		notificationService.send({message, channel: 'anotherChanel'});
		notificationService.send({message, channel: 'oblique'});
		notificationService.send({message, channel: 'appChannel'});
		fixture.detectChanges();

		expect(component.notifications.length).toBe(1);
	});
});
