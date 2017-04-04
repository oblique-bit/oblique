/* tslint:disable:no-unused-variable */
import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {CommonModule} from '@angular/common';
import {By} from '@angular/platform-browser';

import {NotificationComponent} from './notification.component';
import {NotificationService} from './notification.service';
import {Notification, NotificationTypes} from './notification';
import {MockTranslatePipe} from '../../testhelpers';

//TODO: needs more tests
describe('NotificationComponent', () => {
	let component: NotificationComponent;
	let fixture: ComponentFixture<NotificationComponent>;
	let mockNotificationService;
	const message = 'message';
	const title = 'title';

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [NotificationComponent, MockTranslatePipe],
			imports: [CommonModule],
			providers: [{
				provide: NotificationService,
				useValue: {notifications: [], remove: jasmine.createSpy('remove')}
			}]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(NotificationComponent);
		component = fixture.componentInstance;
		mockNotificationService = fixture.debugElement.injector.get(NotificationService);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('should show messages', () => {
		let htmlNotifications;

		beforeEach(() => {
			mockNotificationService.notifications.push(new Notification(1, NotificationTypes.DEFAULT, message, title, false));
			mockNotificationService.notifications.push(new Notification(2, NotificationTypes.INFO, message, title, false));
			fixture.detectChanges();

			//grabs all alerts of the components template
			htmlNotifications = fixture.debugElement.queryAll(By.css('.alert'));
		});

		it('', () => {
			expect(htmlNotifications.length).toBe(2);
		});

		it('with matching css classes', () => {
			expect(htmlNotifications[0].classes).toEqual(jasmine.objectContaining({alert: true}));
			expect(htmlNotifications[0].classes).not.toEqual(jasmine.objectContaining({'alert-info': true}));
		});
	});

	it('should call NotificationService.remove() on button click', () => {
		mockNotificationService.notifications.push(new Notification(1, NotificationTypes.DEFAULT, message, title, true));
		fixture.detectChanges();

		const button = fixture.debugElement.query(By.css('button'));
		button.triggerEventHandler('click', null);

		expect(mockNotificationService.remove).toHaveBeenCalledWith(1);
	});
});
