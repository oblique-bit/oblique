import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CommonModule} from '@angular/common';
import {By} from '@angular/platform-browser';
import {ChangeDetectorRef, DebugElement} from '@angular/core';
import {RouterModule} from '@angular/router';
import {Subject} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {ObMockTranslatePipe} from '../_mocks/mock-translate.pipe';
import {ObMockTranslateService} from '../_mocks/mock-translate.service';
import {ObAlertComponent} from '../alert/alert.component';
import {ObNotificationComponent} from './notification.component';
import {ObNotificationConfig} from './notification.config';
import {ObNotificationService} from './notification.service';
import {ObENotificationPlacement, ObENotificationType, ObINotification} from './notification.model';
import {ObMockNotificationConfig} from './_mocks/mock-notification.config';
import {ObMockNotificationService} from './_mocks/mock-notification.service';
import {ObMockAlertComponent} from '../alert/_mocks/mock-alert.component';
import {WINDOW} from '../window/window.provider';
import {ObTranslateParamsModule} from '../translate-params/translate-params.module';
import {TranslateModule} from '@ngx-translate/core';

describe('NotificationComponent', () => {
	let component: ObNotificationComponent;
	let fixture: ComponentFixture<ObNotificationComponent>;
	let notificationConfig: ObNotificationConfig;
	let notificationService: ObNotificationService;
	let changeDetectorRef: ChangeDetectorRef;

	const message = 'myMessage';
	const title = 'myTitle';

	beforeEach(async () => {
		TestBed.overrideComponent(ObNotificationComponent, {
			remove: {imports: [ObAlertComponent, TranslateModule]},
			add: {imports: [ObMockAlertComponent, ObMockTranslatePipe]},
		});
		await TestBed.configureTestingModule({
			imports: [
				CommonModule,
				ObMockAlertComponent,
				ObMockTranslatePipe,
				ObNotificationComponent,
				ObTranslateParamsModule,
				RouterModule.forRoot([]),
			],
			providers: [
				{provide: ObNotificationConfig, useClass: ObMockNotificationConfig},
				{provide: ObNotificationService, useClass: ObMockNotificationService},
				{provide: TranslateService, useClass: ObMockTranslateService},
				{provide: WINDOW, useValue: window},
			],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ObNotificationComponent);
		component = fixture.componentInstance;
		notificationConfig = fixture.debugElement.injector.get(ObNotificationConfig);
		notificationService = fixture.debugElement.injector.get(ObNotificationService);
		changeDetectorRef = fixture.componentRef.injector.get(ChangeDetectorRef);
		jest.spyOn(component, 'close');
		detectChanges();
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	describe('should display notifications via NotificationService', () => {
		let htmlNotifications: DebugElement[];

		beforeEach(async () => {
			component.open({message: 'Notification 1', type: ObENotificationType.INFO});
			component.open({message: 'Notification 2', title: 'Title 2', type: ObENotificationType.SUCCESS});
			await render();

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
		beforeEach(async () => {
			component.open({message, title, sticky: true});
			await render();
			closeButton = fixture.debugElement.query(By.css('button.ob-close'));
		});

		it('should be present', () => {
			expect(closeButton).toBeTruthy();
		});

		it('should have an accessible text', () => {
			expect(closeButton.query(By.css('.ob-screen-reader-only')).nativeElement.textContent).toBe(
				'i18n.oblique.notification.close'
			);
		});

		it('should close a notification when clicked', async () => {
			jest.useFakeTimers();
			closeButton.triggerEventHandler('click', null);

			// Wait for animation completion:
			await advanceTimersAndDetectChanges(ObNotificationComponent.REMOVE_DELAY);

			expect(component.close).toHaveBeenCalled();
			expect(component.notifications().length).toBe(0);
		});
	});

	it('should clear all notification', async () => {
		jest.useFakeTimers();
		// Send multiple notifications:
		component.open({message: 'message 1'});
		component.open({message: 'message 2'});
		component.open({message: 'message 3'});
		detectChanges();

		expect(component.notifications().length).toBe(3);
		let htmlNotifications = fixture.debugElement.queryAll(By.css('.ob-notification'));
		expect(htmlNotifications.length).toBe(3);

		component.clear();
		await advanceTimersAndDetectChanges(ObNotificationComponent.REMOVE_DELAY);

		expect(component.notifications().length).toBe(0);

		htmlNotifications = fixture.debugElement.queryAll(By.css('.ob-notification'));
		expect(htmlNotifications.length).toBe(0);
	});

	it('should clear notifications when a clear event is emitted for the channel', () => {
		component.open({message: 'message 1', channel: 'oblique'});

		(notificationService.events as Subject<ObINotification>).next({channel: 'oblique'});

		expect(component.close).toHaveBeenCalledWith(component.notifications()[0]);
	});

	it('should clear notifications when a clear-all event is emitted', () => {
		component.open({message: 'message 1', channel: 'oblique'});

		(notificationService.events as Subject<ObINotification>).next(null);

		expect(component.close).toHaveBeenCalledWith(component.notifications()[0]);
	});

	it('should have only 1 message if same message is send multiple times with groupSimilar enabled', async () => {
		jest.useFakeTimers();
		// Send multiple notifications:
		component.open({message, groupSimilar: true});
		component.open({message, groupSimilar: true});
		component.open({message, groupSimilar: true});
		detectChanges();

		expect(component.notifications().length).toBe(1);
		const htmlNotifications = fixture.debugElement.queryAll(By.css('.ob-notification'));
		expect(htmlNotifications.length).toBe(1);
		// Ensure that the timers responsible for closing notifications are executed before ending the test,
		// so the corresponding branch (if) is covered. This became necessary after switching from
		// "waitForAsync" to "async/await" to preserve equivalent test coverage.
		await advanceTimersAndDetectChanges();
	});

	it('should have multiple messages if same message is send multiple times with groupSimilar disabled', async () => {
		// Send multiple notifications:
		component.open({message, groupSimilar: false});
		component.open({message, groupSimilar: false});
		component.open({message, groupSimilar: false});
		await render();

		expect(component.notifications().length).toBe(3);
		const htmlNotifications = fixture.debugElement.queryAll(By.css('.ob-notification'));
		expect(htmlNotifications.length).toBe(3);
	});

	it('should open notifications on the left side when placement is left', () => {
		notificationService.placement = ObENotificationPlacement.BOTTOM_LEFT;
		component.notifications.set([]);

		component.open({message: 'message 1'});
		component.open({message: 'message 2'});

		expect(component.notifications()[1].$state()).toBe('in-first-left');
		expect(component.notifications()[0].$state()).toBe('in-left');
	});

	it('should create first notification state for an empty left-side list', () => {
		notificationService.placement = ObENotificationPlacement.BOTTOM_LEFT;
		component.notifications.set([]);

		expect((component as unknown as {getOpenState: () => string}).getOpenState()).toBe('in-first-left');
	});

	it('should close a _non-sticky_ notification after `timeout` is reached', async () => {
		jest.useFakeTimers();
		const notification = {
			message,
			title,
			sticky: false,
		};
		component.open(notification);
		await advanceTimersAndDetectChanges(2 * notificationConfig.timeout + ObNotificationComponent.REMOVE_DELAY);

		expect(component.close).toHaveBeenCalled();
		expect(component.close).toHaveBeenCalledWith(expect.objectContaining({message, title, sticky: false}));
		expect(component.notifications().length).toBe(0);

		const htmlNotifications = fixture.debugElement.queryAll(By.css('.ob-notification'));
		expect(htmlNotifications.length).toBe(0);
	});

	it('should *not* close a _sticky_ notification after `timeout` is reached', async () => {
		jest.useFakeTimers();
		component.open({
			message,
			title,
			sticky: true,
		});
		await advanceTimersAndDetectChanges(notificationConfig.timeout + ObNotificationComponent.REMOVE_DELAY);

		expect(component.close).not.toHaveBeenCalled();
		expect(component.notifications().length).toBe(1);

		const htmlNotifications = fixture.debugElement.queryAll(By.css('.ob-notification'));
		expect(htmlNotifications.length).toBe(1);
	});

	it('should display notifications from a custom channel', async () => {
		fixture.componentRef.setInput('channel', 'myChannel');

		// Send multiple notifications to different channels:
		(notificationService.events as Subject<ObINotification>).next({message: 'message 1', channel: 'testChannel'});
		(notificationService.events as Subject<ObINotification>).next({message: 'message 2', channel: 'myChannel'});
		(notificationService.events as Subject<ObINotification>).next({message: 'message 3', channel: 'anotherChanel'});
		(notificationService.events as Subject<ObINotification>).next({message: 'message 4', channel: 'myChannel'});
		(notificationService.events as Subject<ObINotification>).next({message: 'message 5', channel: 'appChannel'});
		await render();

		expect(component.notifications().length).toBe(2);
	});

	it('should *not* display a notification from a different channel', async () => {
		// Send multiple notifications to different channels:
		(notificationService.events as Subject<ObINotification>).next({message: 'message 1', channel: 'testChannel'});
		(notificationService.events as Subject<ObINotification>).next({message: 'message 2', channel: 'myChannel'});
		(notificationService.events as Subject<ObINotification>).next({message: 'message 3', channel: 'anotherChanel'});
		(notificationService.events as Subject<ObINotification>).next({message: 'message 4', channel: 'oblique'});
		(notificationService.events as Subject<ObINotification>).next({message: 'message 5', channel: 'appChannel'});
		await render();

		expect(component.notifications().length).toBe(1);
	});

	async function render(): Promise<void> {
		changeDetectorRef.detectChanges();
		fixture.detectChanges();
		await fixture.whenStable();
	}

	function detectChanges(): void {
		changeDetectorRef.detectChanges();
		fixture.detectChanges();
	}

	async function advanceTimersAndDetectChanges(delay?: number): Promise<void> {
		if (delay === undefined) {
			await jest.runAllTimersAsync();
		} else {
			await jest.advanceTimersByTimeAsync(delay);
		}
		detectChanges();
	}
});
