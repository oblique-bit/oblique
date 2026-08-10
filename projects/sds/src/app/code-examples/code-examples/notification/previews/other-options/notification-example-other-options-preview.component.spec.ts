import {type ComponentFixture, TestBed} from '@angular/core/testing';
import {ObENotificationPlacement, ObENotificationType, ObNotificationService, WINDOW} from '@oblique/oblique';
import {NotificationExampleOtherOptionsPreviewComponent} from './notification-example-other-options-preview.component';

describe(NotificationExampleOtherOptionsPreviewComponent.name, () => {
	let component: NotificationExampleOtherOptionsPreviewComponent;
	let fixture: ComponentFixture<NotificationExampleOtherOptionsPreviewComponent>;
	let notificationService: ObNotificationService;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [NotificationExampleOtherOptionsPreviewComponent],
			providers: [{provide: WINDOW, useValue: window}],
		}).compileComponents();

		fixture = TestBed.createComponent(NotificationExampleOtherOptionsPreviewComponent);
		component = fixture.componentInstance;
		notificationService = TestBed.inject(ObNotificationService);
	});

	test('should create', () => {
		expect(component).toBeTruthy();
	});

	test('should send a notification with the selected placement', () => {
		const sendSpy = jest.spyOn(notificationService, 'send');

		component.sendPlacement(ObENotificationPlacement.TOP_RIGHT);

		expect(notificationService.placement).toBe(ObENotificationPlacement.TOP_RIGHT);
		expect(sendSpy).toHaveBeenCalledWith({
			channel: 'demo',
			title: 'Title',
			message: 'Hello this is the notification message',
		});
	});

	test('should send each notification type', () => {
		const infoSpy = jest.spyOn(notificationService, 'info');
		const successSpy = jest.spyOn(notificationService, 'success');
		const warningSpy = jest.spyOn(notificationService, 'warning');
		const errorSpy = jest.spyOn(notificationService, 'error');

		component.sendInfo();
		component.sendSuccess();
		component.sendWarning();
		component.sendError();

		expect(infoSpy).toHaveBeenCalledWith({
			channel: 'demo',
			title: 'Title of the info message',
			message: 'This is the message text',
		});
		expect(successSpy).toHaveBeenCalledWith({
			channel: 'demo',
			title: 'Title of the success message',
			message: 'This is the message text',
		});
		expect(warningSpy).toHaveBeenCalledWith({
			channel: 'demo',
			title: 'Title of the warning message',
			message: 'This is the message text',
		});
		expect(errorSpy).toHaveBeenCalledWith({
			channel: 'demo',
			title: 'Title of error message',
			message: 'This is the message text',
		});
	});

	test('should send notifications with the configured options', () => {
		const sendSpy = jest.spyOn(notificationService, 'send');
		const infoSpy = jest.spyOn(notificationService, 'info');
		const messageParams = {message: 'foo', parameters: 'bar'};

		component.sendMessageParams(messageParams);
		component.sendGroupSimilar(ObENotificationType.SUCCESS);
		component.sendSticky(true);
		component.sendSticky(false);
		component.sendTimeout(500);
		component.sendWithHTML();

		expect(sendSpy).toHaveBeenNthCalledWith(1, {
			channel: 'demo',
			message: 'i18n.notification.sampleMessage',
			title: 'This is the title of the message with params',
			messageParams,
		});
		expect(sendSpy).toHaveBeenNthCalledWith(2, {
			channel: 'demo',
			title: 'Title of message using group similar',
			message: 'This is the message text',
			groupSimilar: true,
			type: ObENotificationType.SUCCESS,
		});
		expect(infoSpy).toHaveBeenNthCalledWith(1, {
			channel: 'demo',
			message: 'This message is sticky',
			title: 'Title',
			sticky: true,
		});
		expect(infoSpy).toHaveBeenNthCalledWith(2, {
			channel: 'demo',
			message: 'This message is not sticky',
			title: 'Title',
			sticky: false,
		});
		expect(infoSpy).toHaveBeenNthCalledWith(3, {
			channel: 'demo',
			title: 'Title of the message with timeout  500 ms',
			message: 'This is the message text',
			sticky: false,
			timeout: 500,
		});
		expect(infoSpy).toHaveBeenNthCalledWith(4, {
			channel: 'demo',
			title: 'Notification with HTML',
			message: expect.stringContaining('<strong>Angular sanitization</strong>'),
			sticky: true,
		});
	});

	test('should clear the notification channel or all channels', () => {
		const clearSpy = jest.spyOn(notificationService, 'clear');
		const clearAllSpy = jest.spyOn(notificationService, 'clearAll');

		component.clear();
		component.clearAllChannels();

		expect(clearSpy).toHaveBeenCalledWith('demo');
		expect(clearAllSpy).toHaveBeenCalled();
	});
});
